from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models.goal import Goal

goal_bp = Blueprint("goals", __name__)


@goal_bp.route("", methods=["GET"])
@jwt_required()
def get_goals():
    user_id = get_jwt_identity()
    goals = Goal.query.filter_by(user_id=user_id).order_by(Goal.created_at.desc()).all()
    return jsonify({"goals": [g.to_dict() for g in goals]}), 200


@goal_bp.route("", methods=["POST"])
@jwt_required()
def create_goal():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data.get("title") or not data.get("target_value"):
        return jsonify({"error": "title and target_value are required"}), 400

    deadline = None
    if data.get("deadline"):
        deadline = datetime.strptime(data["deadline"], "%Y-%m-%d").date()

    goal = Goal(
        user_id=user_id,
        title=data["title"],
        category=data.get("category"),
        target_value=data["target_value"],
        current_value=data.get("current_value", 0),
        deadline=deadline,
        color=data.get("color", "#7C3AED"),
    )
    db.session.add(goal)
    db.session.commit()
    return jsonify({"goal": goal.to_dict()}), 201


@goal_bp.route("/<int:goal_id>", methods=["PUT"])
@jwt_required()
def update_goal(goal_id):
    user_id = get_jwt_identity()
    goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()
    if not goal:
        return jsonify({"error": "Goal not found"}), 404

    data = request.get_json()
    for field in ["title", "category", "target_value", "current_value", "color", "is_completed"]:
        if field in data:
            setattr(goal, field, data[field])

    if data.get("deadline"):
        goal.deadline = datetime.strptime(data["deadline"], "%Y-%m-%d").date()

    if goal.current_value >= goal.target_value:
        goal.is_completed = True

    db.session.commit()
    return jsonify({"goal": goal.to_dict()}), 200


@goal_bp.route("/<int:goal_id>", methods=["DELETE"])
@jwt_required()
def delete_goal(goal_id):
    user_id = get_jwt_identity()
    goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()
    if not goal:
        return jsonify({"error": "Goal not found"}), 404

    db.session.delete(goal)
    db.session.commit()
    return jsonify({"message": "Goal deleted"}), 200