from datetime import datetime, timedelta
from collections import Counter
from flask import Blueprint, jsonify
# pyrefly: ignore [missing-import]
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.problem import Problem
from models.daily_activity import DailyActivity
from models.platform_stat import PlatformStat

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/stats", methods=["GET"])
@jwt_required()
def get_stats():
    user_id = get_jwt_identity()
    problems = Problem.query.filter_by(user_id=user_id).all()
    solved = [p for p in problems if p.status == "Solved"]

    # Read cached LeetCode data from our own DB — NO external API calls here.
    # (It was synced once via Settings → Sync. This is what kills the 429s.)
    lc_stat = PlatformStat.query.filter_by(user_id=user_id, platform="LeetCode").first()

    # Counts: prefer the cached LeetCode numbers, otherwise count our DB problems.
    if lc_stat and lc_stat.problems_solved:
        total_solved  = lc_stat.problems_solved
        easy_solved   = lc_stat.easy_solved or 0
        medium_solved = lc_stat.medium_solved or 0
        hard_solved   = lc_stat.hard_solved or 0
    else:
        total_solved  = len(solved)
        easy_solved   = len([p for p in solved if p.difficulty == "Easy"])
        medium_solved = len([p for p in solved if p.difficulty == "Medium"])
        hard_solved   = len([p for p in solved if p.difficulty == "Hard"])

    # Accuracy = solved vs all problems we track in the DB.
    accuracy = round((len(solved) / len(problems)) * 100, 1) if problems else 0

    # Topic distribution / strength — prefer cached skill data, fall back to DB topics.
    if lc_stat and lc_stat.skill_data:
        topics = lc_stat.skill_data
        topic_distribution = [
            {
                "topic": t["topic"],
                "count": t["solved"],
                "pct": round((t["solved"] / total_solved) * 100, 1) if total_solved else 0
            }
            for t in topics[:6]
        ]
        strength_weakness = [
            {"topic": t["topic"], "accuracy_pct": t["score"], "solved": t["solved"]}
            for t in topics
        ]
    else:
        # Fall back to DB-derived topic stats (when the user has never synced)
        topic_counter = Counter([p.topic for p in solved if p.topic])
        topic_distribution = [
            {"topic": t, "count": c, "pct": round((c / total_solved) * 100, 1) if total_solved else 0}
            for t, c in topic_counter.most_common(6)
        ]
        topic_stats = {}
        for p in problems:
            if not p.topic:
                continue
            topic_stats.setdefault(p.topic, {"solved": 0, "total": 0})
            topic_stats[p.topic]["total"] += 1
            if p.status == "Solved":
                topic_stats[p.topic]["solved"] += 1
        strength_weakness = [
            {"topic": t, "accuracy_pct": round((s["solved"]/s["total"])*100, 1), "solved": s["solved"]}
            for t, s in topic_stats.items()
        ]
        strength_weakness.sort(key=lambda x: x["accuracy_pct"], reverse=True)

    # Streak from DB daily activities
    activities = DailyActivity.query.filter_by(user_id=user_id).all()
    activity_dates = {a.date for a in activities}
    today = datetime.utcnow().date()
    current_streak = 0
    check_date = today
    while check_date in activity_dates:
        current_streak += 1
        check_date -= timedelta(days=1)

    best_streak = 0
    temp_streak = 0
    prev = None
    for d in sorted(activity_dates):
        if prev and (d - prev).days == 1:
            temp_streak += 1
        else:
            temp_streak = 1
        best_streak = max(best_streak, temp_streak)
        prev = d

    # Problems solved over time — cumulative total, grouped by month, from the
    # daily activity we already loaded above. Feeds the "Over Time" area chart.
    monthly = {}
    for a in sorted(activities, key=lambda x: x.date):
        label = a.date.strftime("%b '%y")  # e.g. "Jun '26"
        monthly[label] = monthly.get(label, 0) + (a.problems_solved or 0)

    problems_over_time = []
    running = 0
    for label, count in monthly.items():
        running += count
        problems_over_time.append({"date": label, "solved": running})

    platform_stats = PlatformStat.query.filter_by(user_id=user_id).all()

    return jsonify({
        "total_solved": total_solved,
        "easy_solved": easy_solved,
        "medium_solved": medium_solved,
        "hard_solved": hard_solved,
        "accuracy": accuracy,
        "current_streak": current_streak,
        "best_streak": best_streak,
        "topic_distribution": topic_distribution,
        "strength_weakness": strength_weakness,
        "problems_over_time": problems_over_time,
        "platform_stats": [ps.to_dict() for ps in platform_stats],
    }), 200


@dashboard_bp.route("/heatmap", methods=["GET"])
@jwt_required()
def get_heatmap():
    user_id = get_jwt_identity()
    since = datetime.utcnow().date() - timedelta(days=90)
    activities = DailyActivity.query.filter(
        DailyActivity.user_id == user_id,
        DailyActivity.date >= since
    ).order_by(DailyActivity.date.asc()).all()
    return jsonify({"activity": [a.to_dict() for a in activities]}), 200


@dashboard_bp.route("/strength-weakness", methods=["GET"])
@jwt_required()
def get_strength_weakness():
    user_id = get_jwt_identity()
    problems = Problem.query.filter_by(user_id=user_id).all()

    topic_stats = {}
    for p in problems:
        if not p.topic:
            continue
        topic_stats.setdefault(p.topic, {"solved": 0, "total": 0})
        topic_stats[p.topic]["total"] += 1
        if p.status == "Solved":
            topic_stats[p.topic]["solved"] += 1

    result = [
        {
            "topic": topic,
            "accuracy_pct": round((s["solved"] / s["total"]) * 100, 1) if s["total"] else 0,
            "solved": s["solved"],
            "total": s["total"],
        }
        for topic, s in topic_stats.items()
    ]
    result.sort(key=lambda x: x["accuracy_pct"], reverse=True)
    return jsonify({"strength_weakness": result}), 200


@dashboard_bp.route("/analytics", methods=["GET"])
@jwt_required()
def get_analytics():
    """Everything the Analytics page needs, computed from data we already store."""
    user_id = get_jwt_identity()
    problems = Problem.query.filter_by(user_id=user_id).all()
    solved = [p for p in problems if p.status == "Solved"]
    activities = DailyActivity.query.filter_by(user_id=user_id).all()
    activity_by_date = {a.date: (a.problems_solved or 0) for a in activities}
    activity_dates = set(activity_by_date.keys())

    lc_stat = PlatformStat.query.filter_by(user_id=user_id, platform="LeetCode").first()
    today = datetime.utcnow().date()

    # --- Summary cards ---
    total_solved = lc_stat.problems_solved if (lc_stat and lc_stat.problems_solved) else len(solved)
    acceptance_rate = round((len(solved) / len(problems)) * 100, 1) if problems else 0
    window = 60
    active_days = sum(1 for d in activity_dates if 0 <= (today - d).days < window)

    current_streak = 0
    check = today
    while check in activity_dates:
        current_streak += 1
        check -= timedelta(days=1)

    best_streak, temp, prev = 0, 0, None
    for d in sorted(activity_dates):
        temp = temp + 1 if (prev and (d - prev).days == 1) else 1
        best_streak = max(best_streak, temp)
        prev = d

    # --- Topic radar (top 6 by mastery score) ---
    if lc_stat and lc_stat.skill_data:
        topic_radar = [{"topic": t["topic"], "score": t["score"]} for t in lc_stat.skill_data[:6]]
    else:
        topic_stats = {}
        for p in problems:
            if not p.topic:
                continue
            topic_stats.setdefault(p.topic, {"solved": 0, "total": 0})
            topic_stats[p.topic]["total"] += 1
            if p.status == "Solved":
                topic_stats[p.topic]["solved"] += 1
        radar = [{"topic": t, "score": round((s["solved"] / s["total"]) * 100)} for t, s in topic_stats.items()]
        radar.sort(key=lambda x: x["score"], reverse=True)
        topic_radar = radar[:6]

    # --- Daily counts (last 30 days) ---
    daily_counts = []
    for i in range(29, -1, -1):
        d = today - timedelta(days=i)
        daily_counts.append({"date": d.strftime("%b %d"), "count": activity_by_date.get(d, 0)})

    # --- Weekly velocity (last 10 weeks, Mon-Sun buckets) ---
    weekly_velocity = []
    for w in range(9, -1, -1):
        week_start = today - timedelta(days=today.weekday() + w * 7)
        week_end = week_start + timedelta(days=6)
        total = sum(c for d, c in activity_by_date.items() if week_start <= d <= week_end)
        weekly_velocity.append({"week": week_start.strftime("%b %d"), "solved": total})

    return jsonify({
        "summary": {
            "total_solved": total_solved,
            "acceptance_rate": acceptance_rate,
            "active_days": active_days,
            "active_window": window,
            "best_streak": best_streak,
            "current_streak": current_streak,
        },
        "topic_radar": topic_radar,
        "daily_counts": daily_counts,
        "weekly_velocity": weekly_velocity,
    }), 200

