from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from models.user import User

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email", "").strip().lower()
    username = data.get("username", "").strip()
    password = data.get("password", "")

    if not email or not username or not password:
        return jsonify({"error": "email, username and password are required"}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already taken"}), 409

    user = User(email=email, username=username)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.to_dict()}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.to_dict()}), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"user": user.to_dict()}), 200


@auth_bp.route("/me", methods=["PATCH"])
@jwt_required()
def update_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    for field in ["leetcode_handle", "codeforces_handle", "codechef_handle", "bio", "avatar_url"]:
        if field in data:
            setattr(user, field, data[field])

    db.session.commit()
    return jsonify({"user": user.to_dict()}), 200


@auth_bp.route("/me/preferences", methods=["PATCH"])
@jwt_required()
def update_preferences():
    """Save notification and privacy toggle preferences to the DB."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json() or {}
    pref_map = {
        "contestReminders": "pref_contest_reminders",
        "weeklyReport":     "pref_weekly_report",
        "streakAlerts":     "pref_streak_alerts",
        "platformSync":     "pref_platform_sync",
        "publicProfile":    "pref_public_profile",
        "showStreak":       "pref_show_streak",
        "showRatings":      "pref_show_ratings",
    }
    for frontend_key, model_attr in pref_map.items():
        if frontend_key in data:
            val = data[frontend_key]
            if isinstance(val, bool):
                setattr(user, model_attr, val)

    db.session.commit()
    return jsonify({"preferences": user.to_dict()["preferences"]}), 200


@auth_bp.route("/me", methods=["DELETE"])
@jwt_required()
def delete_account():
    """Permanently delete the authenticated user and all their data."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)   # cascade removes problems, goals, stats, activities, ai_responses
    db.session.commit()
    return jsonify({"message": "Account deleted successfully"}), 200