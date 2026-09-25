from datetime import datetime
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models.user import User
from models.problem import Problem
from models.platform_stat import PlatformStat
from services.leetcode_service import fetch_leetcode_progress
from services.codeforces_service import (
    fetch_codeforces_stats, fetch_codeforces_rating_history, fetch_codeforces_upcoming
)
from models.daily_activity import DailyActivity
from services.leetcode_service import (
    fetch_leetcode_stats, fetch_leetcode_calendar,
    fetch_leetcode_accepted_submissions, fetch_leetcode_upcoming_contests
)


platform_bp = Blueprint("platforms", __name__)


def _upsert_platform_stat(user_id, platform_name, stats):
    existing = PlatformStat.query.filter_by(user_id=user_id, platform=platform_name).first()
    if not existing:
        existing = PlatformStat(user_id=user_id, platform=platform_name)
        db.session.add(existing)

    existing.rating = stats.get("rating")
    existing.max_rating = stats.get("max_rating")
    existing.problems_solved = stats.get("problems_solved", existing.problems_solved or 0)
    existing.rank = stats.get("rank")
    existing.global_rank = stats.get("global_rank") or stats.get("ranking")
    existing.easy_solved = stats.get("easy_solved", existing.easy_solved or 0)
    existing.medium_solved = stats.get("medium_solved", existing.medium_solved or 0)
    existing.hard_solved = stats.get("hard_solved", existing.hard_solved or 0)
    existing.fetched_at = datetime.utcnow()
    return existing


@platform_bp.route("/sync/leetcode", methods=["POST"])
@jwt_required()
def sync_leetcode():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user.leetcode_handle:
        return jsonify({"error": "No LeetCode handle set"}), 400

    handle = user.leetcode_handle

    # One sync = fetch everything from the external API, then cache it in our DB.
    # We fetch ONE AT A TIME (not in parallel): the public API rate-limits bursts
    # hard, so sequential calls + the retry/backoff in _get are far more reliable.
    # After this, every page load reads from the DB — no more live calls.
    stats    = fetch_leetcode_stats(handle)
    progress = fetch_leetcode_progress(handle)
    calendar = fetch_leetcode_calendar(handle)

    if not stats:
        return jsonify({"error": "Could not fetch LeetCode stats. The platform is rate-limiting us — wait a minute and try again."}), 429

    stat_row = _upsert_platform_stat(user_id, "LeetCode", stats)

    # Cache the topic breakdown + submission calendar on the same row.
    if progress and progress.get("topics"):
        stat_row.skill_data = progress["topics"]
    if calendar:
        stat_row.calendar_data = calendar
    stat_row.last_synced_at = datetime.utcnow()

    db.session.commit()
    return jsonify({"message": "LeetCode synced", "stats": stat_row.to_dict()}), 200


@platform_bp.route("/sync/codeforces", methods=["POST"])
@jwt_required()
def sync_codeforces():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user.codeforces_handle:
        return jsonify({"error": "No Codeforces handle set"}), 400

    stats = fetch_codeforces_stats(user.codeforces_handle)
    if not stats:
        return jsonify({"error": "Could not fetch Codeforces stats"}), 404

    stat_row = _upsert_platform_stat(user_id, "Codeforces", stats)
    db.session.commit()
    return jsonify({"message": "Codeforces synced", "stats": stat_row.to_dict()}), 200


@platform_bp.route("/codeforces/rating-history", methods=["GET"])
@jwt_required()
def codeforces_rating_history():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user.codeforces_handle:
        return jsonify({"error": "No Codeforces handle set"}), 400

    history = fetch_codeforces_rating_history(user.codeforces_handle)
    if history is None:
        return jsonify({"error": "Could not fetch rating history"}), 404
    return jsonify({"history": history}), 200


@platform_bp.route("/sync-all", methods=["POST"])
@jwt_required()
def sync_all():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    results = {}

    if user.leetcode_handle:
        lc = fetch_leetcode_stats(user.leetcode_handle)
        if lc:
            _upsert_platform_stat(user_id, "LeetCode", lc)
            results["leetcode"] = "synced"
        else:
            results["leetcode"] = "failed"

    if user.codeforces_handle:
        cf = fetch_codeforces_stats(user.codeforces_handle)
        if cf:
            _upsert_platform_stat(user_id, "Codeforces", cf)
            results["codeforces"] = "synced"
        else:
            results["codeforces"] = "failed"

    db.session.commit()
    return jsonify({"message": "Sync complete", "results": results}), 200

@platform_bp.route("/leetcode/skill", methods=["GET"])
@jwt_required()
def leetcode_skill():
    user_id = get_jwt_identity()
    # Serve cached skill data — no external call. Sync first to populate it.
    lc_stat = PlatformStat.query.filter_by(user_id=user_id, platform="LeetCode").first()
    if not lc_stat or not lc_stat.skill_data:
        return jsonify({"error": "No skill data. Please sync first."}), 404
    return jsonify({"skills": lc_stat.skill_data}), 200


@platform_bp.route("/leetcode/calendar", methods=["GET"])
@jwt_required()
def leetcode_calendar():
    user_id = get_jwt_identity()
    # Serve cached calendar — no external call. Sync first to populate it.
    lc_stat = PlatformStat.query.filter_by(user_id=user_id, platform="LeetCode").first()
    if not lc_stat or not lc_stat.calendar_data:
        return jsonify({"error": "No calendar data. Please sync first."}), 404
    return jsonify({"calendar": lc_stat.calendar_data}), 200


@platform_bp.route("/leetcode/import-submissions", methods=["POST"])
@jwt_required()
def import_leetcode_submissions():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user.leetcode_handle:
        return jsonify({"error": "No LeetCode handle set"}), 400

    # clean=true removes all existing LeetCode problems before re-importing
    clean = request.args.get("clean", "false").lower() == "true"

    if clean:
        Problem.query.filter_by(
            user_id=user_id,
            platform="LeetCode"
        ).delete()
        db.session.commit()

    # Keep this bounded: each unique problem costs one extra /select call to look
    # up its real difficulty, and the public API rate-limits. 50 recent solves is
    # plenty for the dashboard without hammering the API into 429s.
    submissions = fetch_leetcode_accepted_submissions(
        user.leetcode_handle, limit=50
    )
    if not submissions:
        return jsonify({"error": "No submissions found"}), 404

    existing_urls = set()
    existing_titles = set()

    if not clean:
        existing_urls = {
            p.url for p in Problem.query.filter_by(user_id=user_id).all() if p.url
        }
        existing_titles = {
            p.title.lower() for p in Problem.query.filter_by(user_id=user_id).all()
        }

    new_problems = []
    for s in submissions:
        if s["url"] in existing_urls:
            continue
        if s["title"].lower() in existing_titles:
            continue

        problem = Problem(
            user_id=user_id,
            title=s["title"],
            platform="LeetCode",
            difficulty=s.get("difficulty", "Medium"),  # now real difficulty
            topic=s.get("topic"),                       # primary topic tag from LeetCode
            status="Solved",
            url=s["url"],
            solved_at=datetime.fromtimestamp(int(s["timestamp"])) if s.get("timestamp") else datetime.utcnow(),
        )
        db.session.add(problem)

        # Count this solve towards that day's activity (for streak + heatmap).
        if s.get("timestamp"):
            activity_date = datetime.fromtimestamp(int(s["timestamp"])).date()
            existing_activity = DailyActivity.query.filter_by(
                user_id=user_id, date=activity_date
            ).first()
            if existing_activity:
                existing_activity.problems_solved += 1
            else:
                new_activity = DailyActivity(
                    user_id=user_id,
                    date=activity_date,
                    problems_solved=1
                )
                db.session.add(new_activity)

        new_problems.append(s["title"])
        existing_titles.add(s["title"].lower())
        existing_urls.add(s["url"])



    db.session.commit()
    return jsonify({
        "message": f"Imported {len(new_problems)} new problems",
        "imported": len(new_problems),
        "skipped": len(submissions) - len(new_problems),
    }), 201

@platform_bp.route("/leetcode/progress", methods=["GET"])
@jwt_required()
def leetcode_progress():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user.leetcode_handle:
        return jsonify({"error": "No LeetCode handle set"}), 400

    progress = fetch_leetcode_progress(user.leetcode_handle)
    if not progress:
        return jsonify({"error": "Could not fetch progress"}), 404
    return jsonify({"progress": progress}), 200


@platform_bp.route("/contests/upcoming", methods=["GET"])
@jwt_required()
def upcoming_contests():
    """Global upcoming contests across platforms (LeetCode + Codeforces)."""
    contests = fetch_leetcode_upcoming_contests() + fetch_codeforces_upcoming()
    contests = [c for c in contests if c.get("start_time")]
    contests.sort(key=lambda x: x["start_time"])
    return jsonify({"contests": contests}), 200


@platform_bp.route("/contests/history", methods=["GET"])
@jwt_required()
def contest_history():
    """The user's past rated contests. Codeforces only for now (LeetCode contest
    history needs a separate query and this user base mostly uses CF for contests)."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    history = []
    if user.codeforces_handle:
        cf = fetch_codeforces_rating_history(user.codeforces_handle)
        for c in (cf or []):
            history.append({
                "platform": "Codeforces",
                "name": c["contest_name"],
                "date": c["date"],
                "rank": c["rank"],
                "delta": c["new_rating"] - c["old_rating"],
            })

    history.sort(key=lambda x: x["date"], reverse=True)
    return jsonify({"history": history}), 200


@platform_bp.route("/leetcode/backfill-topics", methods=["POST"])
@jwt_required()
def backfill_topics():
    """Fix null topic/difficulty on LeetCode problems imported before fetch_problem_meta() existed.

    Looks up each problem by its URL slug, calls the LeetCode GraphQL API (in-memory
    cached per-slug so we never look up the same problem twice), and updates the DB row.
    Returns {"fixed": N, "skipped": N, "errors": N}.
    """
    import re
    from services.leetcode_service import fetch_problem_meta

    user_id = get_jwt_identity()
    problems = Problem.query.filter_by(user_id=user_id, platform="LeetCode").all()

    fixed = skipped = errors = 0
    slug_re = re.compile(r"leetcode\.com/problems/([^/]+)")

    for problem in problems:
        # Only process problems missing a topic (difficulty is almost always set)
        if problem.topic:
            skipped += 1
            continue

        # Extract slug from URL, fall back to slugifying the title
        slug = None
        if problem.url:
            m = slug_re.search(problem.url)
            if m:
                slug = m.group(1)
        if not slug:
            # Derive slug from title as a best-effort fallback
            slug = re.sub(r"[^a-z0-9]+", "-", problem.title.lower()).strip("-")

        try:
            meta = fetch_problem_meta(slug)
            changed = False
            if meta.get("topic") and not problem.topic:
                problem.topic = meta["topic"]
                changed = True
            if meta.get("difficulty") and problem.difficulty in (None, "Medium"):
                # Only overwrite if currently the default ("Medium") to avoid
                # clobbering a difficulty the user set manually.
                problem.difficulty = meta["difficulty"]
                changed = True
            if changed:
                fixed += 1
            else:
                skipped += 1
        except Exception:
            errors += 1

    db.session.commit()
    return jsonify({
        "message": f"Backfill complete: {fixed} fixed, {skipped} skipped, {errors} errors",
        "fixed": fixed,
        "skipped": skipped,
        "errors": errors,
    }), 200