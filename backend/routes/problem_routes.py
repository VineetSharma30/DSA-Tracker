from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models.problem import Problem
from models.daily_activity import DailyActivity

problem_bp = Blueprint("problems", __name__)


@problem_bp.route("", methods=["GET"])
@jwt_required()
def get_problems():
    user_id = get_jwt_identity()
    query = Problem.query.filter_by(user_id=user_id)

    platform = request.args.get("platform")
    difficulty = request.args.get("difficulty")
    topic = request.args.get("topic")
    status = request.args.get("status")
    search = request.args.get("search")

    if platform and platform != "All":
        query = query.filter_by(platform=platform)
    if difficulty and difficulty != "All":
        query = query.filter_by(difficulty=difficulty)
    if topic:
        query = query.filter_by(topic=topic)
    if status:
        query = query.filter_by(status=status)
    if search:
        query = query.filter(Problem.title.ilike(f"%{search}%"))

    problems = query.order_by(Problem.created_at.desc()).all()
    return jsonify({"problems": [p.to_dict() for p in problems], "count": len(problems)}), 200


@problem_bp.route("", methods=["POST"])
@jwt_required()
def create_problem():
    user_id = get_jwt_identity()
    data = request.get_json()

    for field in ["title", "platform", "difficulty"]:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    problem = Problem(
        user_id=user_id,
        title=data["title"],
        platform=data["platform"],
        difficulty=data["difficulty"],
        topic=data.get("topic"),
        status=data.get("status", "Solved"),
        url=data.get("url"),
        notes=data.get("notes"),
        solved_at=datetime.utcnow() if data.get("status", "Solved") == "Solved" else None,
    )
    db.session.add(problem)

    if problem.status == "Solved":
        today = datetime.utcnow().date()
        activity = DailyActivity.query.filter_by(user_id=user_id, date=today).first()
        if activity:
            activity.problems_solved += 1
        else:
            activity = DailyActivity(user_id=user_id, date=today, problems_solved=1)
            db.session.add(activity)

    db.session.commit()
    return jsonify({"problem": problem.to_dict()}), 201


@problem_bp.route("/<int:problem_id>", methods=["PUT"])
@jwt_required()
def update_problem(problem_id):
    user_id = get_jwt_identity()
    problem = Problem.query.filter_by(id=problem_id, user_id=user_id).first()
    if not problem:
        return jsonify({"error": "Problem not found"}), 404

    data = request.get_json()
    for field in ["title", "platform", "difficulty", "topic", "status", "url", "notes"]:
        if field in data:
            setattr(problem, field, data[field])

    if data.get("status") == "Solved" and not problem.solved_at:
        problem.solved_at = datetime.utcnow()

    db.session.commit()
    return jsonify({"problem": problem.to_dict()}), 200


@problem_bp.route("/<int:problem_id>", methods=["DELETE"])
@jwt_required()
def delete_problem(problem_id):
    user_id = get_jwt_identity()
    problem = Problem.query.filter_by(id=problem_id, user_id=user_id).first()
    if not problem:
        return jsonify({"error": "Problem not found"}), 404

    db.session.delete(problem)
    db.session.commit()
    return jsonify({"message": "Problem deleted"}), 200


@problem_bp.route("/bulk-import", methods=["POST"])
@jwt_required()
def bulk_import():
    user_id = get_jwt_identity()
    data = request.get_json()
    problems_data = data.get("problems", [])

    created = []
    for item in problems_data:
        if not item.get("title") or not item.get("platform"):
            continue
        problem = Problem(
            user_id=user_id,
            title=item["title"],
            platform=item["platform"],
            difficulty=item.get("difficulty", "Medium"),
            topic=item.get("topic"),
            status=item.get("status", "Solved"),
            url=item.get("url"),
        )
        db.session.add(problem)
        created.append(problem)

    db.session.commit()
    return jsonify({"message": f"Imported {len(created)} problems", "count": len(created)}), 201