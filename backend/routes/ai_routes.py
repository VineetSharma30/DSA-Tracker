from datetime import datetime, timedelta
from collections import Counter
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.problem import Problem
from models.daily_activity import DailyActivity
from models.ai_response import AIResponse
from services.ai_service import (
    generate_weekly_insight, generate_full_report,
    generate_problem_recommendations, generate_roast
)

ai_bp = Blueprint("ai", __name__)

# How long a generated answer stays "fresh" before we'll spend tokens again.
CACHE_TTL = timedelta(hours=24)


def _cached(user_id, kind, refresh):
    """Return the most recent cached payload for (user, kind) if still fresh."""
    if refresh:
        return None
    row = (AIResponse.query
           .filter_by(user_id=user_id, kind=kind)
           .order_by(AIResponse.created_at.desc())
           .first())
    if row and (datetime.utcnow() - row.created_at) < CACHE_TTL:
        return row.payload
    return None


def _store(user_id, kind, payload):
    db.session.add(AIResponse(user_id=user_id, kind=kind, payload=payload))
    db.session.commit()
    return payload


def _build_stats(user_id):
    problems = Problem.query.filter_by(user_id=user_id).all()
    solved = [p for p in problems if p.status == "Solved"]
    total = len(solved)
    accuracy = round((total / len(problems)) * 100, 1) if problems else 0

    topic_counter = Counter([p.topic for p in solved if p.topic])
    topic_distribution = [{"topic": t, "count": c} for t, c in topic_counter.most_common(6)]

    activities = DailyActivity.query.filter_by(user_id=user_id).all()
    activity_dates = {a.date for a in activities}
    today = datetime.utcnow().date()
    current_streak = 0
    check_date = today
    while check_date in activity_dates:
        current_streak += 1
        check_date -= timedelta(days=1)

    topic_stats = {}
    for p in problems:
        if not p.topic:
            continue
        topic_stats.setdefault(p.topic, {"solved": 0, "total": 0})
        topic_stats[p.topic]["total"] += 1
        if p.status == "Solved":
            topic_stats[p.topic]["solved"] += 1

    strength_weakness = [
        {"topic": t, "accuracy_pct": round((s["solved"] / s["total"]) * 100, 1) if s["total"] else 0}
        for t, s in topic_stats.items()
    ]
    strength_weakness.sort(key=lambda x: x["accuracy_pct"], reverse=True)

    return {
        "total_solved": total,
        "easy_solved": len([p for p in solved if p.difficulty == "Easy"]),
        "medium_solved": len([p for p in solved if p.difficulty == "Medium"]),
        "hard_solved": len([p for p in solved if p.difficulty == "Hard"]),
        "accuracy": accuracy,
        "current_streak": current_streak,
        "topic_distribution": topic_distribution,
        "strength_weakness": strength_weakness,
    }, problems


@ai_bp.route("/insight", methods=["GET"])
@jwt_required()
def get_insight():
    user_id = get_jwt_identity()
    refresh = request.args.get("refresh") == "true"
    cached = _cached(user_id, "insight", refresh)
    if cached:
        return jsonify(cached), 200

    stats, _ = _build_stats(user_id)
    if stats["total_solved"] == 0:
        return jsonify({"insight": "Log some problems first and I'll have something smart to say!"}), 200
    try:
        insight = generate_weekly_insight(stats)
    except Exception as e:
        return jsonify({"error": "AI is unavailable right now.", "detail": str(e)}), 503
    return jsonify(_store(user_id, "insight", {"insight": insight})), 200


@ai_bp.route("/report", methods=["GET"])
@jwt_required()
def get_report():
    user_id = get_jwt_identity()
    refresh = request.args.get("refresh") == "true"
    cached = _cached(user_id, "report", refresh)
    if cached:
        return jsonify(cached), 200

    stats, problems = _build_stats(user_id)
    if stats["total_solved"] == 0:
        return jsonify({"error": "No problems logged yet"}), 400
    recent = sorted(problems, key=lambda p: p.created_at, reverse=True)
    try:
        report = generate_full_report(stats, [p.to_dict() for p in recent])
    except Exception as e:
        return jsonify({"error": "AI is unavailable right now.", "detail": str(e)}), 503
    return jsonify(_store(user_id, "report", {"report": report})), 200


@ai_bp.route("/recommend", methods=["GET"])
@jwt_required()
def get_recommendations():
    user_id = get_jwt_identity()
    refresh = request.args.get("refresh") == "true"
    cached = _cached(user_id, "recommend", refresh)
    if cached:
        return jsonify(cached), 200

    stats, problems = _build_stats(user_id)
    weak = [t["topic"] for t in stats["strength_weakness"] if t["accuracy_pct"] < 50][:3]
    if not weak:
        weak = [""]
    # What they've already solved — so we never recommend a repeat and can build on it.
    solved_titles = [p.title for p in problems if p.status == "Solved"]
    try:
        recs = generate_problem_recommendations(stats, weak, solved_titles)
    except Exception as e:
        return jsonify({"error": "AI is unavailable right now.", "detail": str(e)}), 503
    return jsonify(_store(user_id, "recommend", {"recommendations": recs, "weak_topics": weak})), 200


@ai_bp.route("/roast", methods=["GET"])
@jwt_required()
def get_roast():
    user_id = get_jwt_identity()
    refresh = request.args.get("refresh") == "true"
    cached = _cached(user_id, "roast", refresh)
    if cached:
        return jsonify(cached), 200

    stats, _ = _build_stats(user_id)
    if stats["total_solved"] == 0:
        return jsonify({"roast": "Can't roast an empty plate. Go solve something first. 🔥"}), 200
    try:
        roast = generate_roast(stats, stats["strength_weakness"])
    except Exception as e:
        return jsonify({"error": "AI is unavailable right now.", "detail": str(e)}), 503
    return jsonify(_store(user_id, "roast", {"roast": roast})), 200
