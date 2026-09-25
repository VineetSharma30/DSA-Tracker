from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from extensions import db
from models.user import User
from models.friendship import Friendship
from models.friend_activity import FriendActivity
from models.platform_stat import PlatformStat

friends_bp = Blueprint("friends", __name__)


def _friend_ids(user_id):
    """Return set of user IDs that are accepted friends of user_id."""
    sent     = Friendship.query.filter_by(user_id=user_id,   status="accepted").all()
    received = Friendship.query.filter_by(friend_id=user_id, status="accepted").all()
    ids = {f.friend_id for f in sent} | {f.user_id for f in received}
    return ids


# ── GET /api/friends ──────────────────────────────────────────────
@friends_bp.route("", methods=["GET"])
@jwt_required()
def get_friends():
    user_id = int(get_jwt_identity())
    sent     = Friendship.query.filter_by(user_id=user_id,   status="accepted").all()
    received = Friendship.query.filter_by(friend_id=user_id, status="accepted").all()
    all_friendships = sent + received

    # Update current user's last_active
    me = User.query.get(user_id)
    if me:
        me.last_active = datetime.utcnow()
        db.session.commit()

    friends = [f.to_dict(user_id) for f in all_friendships]
    return jsonify({ "friends": friends, "total": len(friends) })


# ── GET /api/friends/requests ─────────────────────────────────────
@friends_bp.route("/requests", methods=["GET"])
@jwt_required()
def get_requests():
    user_id = int(get_jwt_identity())
    pending = Friendship.query.filter_by(friend_id=user_id, status="pending").all()
    return jsonify({ "requests": [f.to_dict(user_id) for f in pending] })


# ── POST /api/friends/request ─────────────────────────────────────
@friends_bp.route("/request", methods=["POST"])
@jwt_required()
def send_request():
    user_id = int(get_jwt_identity())
    body    = request.get_json(silent=True) or {}
    handle  = (body.get("handle") or "").lstrip("@").strip()

    if not handle:
        return jsonify({"error": "Handle is required"}), 400

    target = User.query.filter(
        (User.username == handle) |
        (User.leetcode_handle == handle) |
        (User.codeforces_handle == handle)
    ).first()

    if not target:
        return jsonify({"error": f"No user found with handle '{handle}'"}), 404

    if target.id == user_id:
        return jsonify({"error": "You can't add yourself"}), 400

    # Check if friendship already exists either direction
    existing = Friendship.query.filter(
        ((Friendship.user_id == user_id)   & (Friendship.friend_id == target.id)) |
        ((Friendship.user_id == target.id) & (Friendship.friend_id == user_id))
    ).first()

    if existing:
        return jsonify({"error": "Friend request already exists or already friends"}), 409

    friendship = Friendship(user_id=user_id, friend_id=target.id, status="pending")
    db.session.add(friendship)
    db.session.commit()
    return jsonify({"message": f"Friend request sent to {target.username}"}), 201


# ── POST /api/friends/accept/<friendship_id> ──────────────────────
@friends_bp.route("/accept/<int:fid>", methods=["POST"])
@jwt_required()
def accept_request(fid):
    user_id = int(get_jwt_identity())
    f = Friendship.query.get_or_404(fid)

    if f.friend_id != user_id:
        return jsonify({"error": "Not authorized"}), 403

    f.status = "accepted"
    db.session.commit()
    return jsonify({"message": "Friend request accepted"})


# ── DELETE /api/friends/<friendship_id> ───────────────────────────
@friends_bp.route("/<int:fid>", methods=["DELETE"])
@jwt_required()
def remove_friend(fid):
    user_id = int(get_jwt_identity())
    f = Friendship.query.get_or_404(fid)

    if f.user_id != user_id and f.friend_id != user_id:
        return jsonify({"error": "Not authorized"}), 403

    db.session.delete(f)
    db.session.commit()
    return jsonify({"message": "Friend removed"})


# ── GET /api/friends/activity ─────────────────────────────────────
@friends_bp.route("/activity", methods=["GET"])
@jwt_required()
def get_activity():
    user_id = int(get_jwt_identity())
    ids = _friend_ids(user_id) | {user_id}

    activities = (
        FriendActivity.query
        .filter(FriendActivity.user_id.in_(ids))
        .order_by(FriendActivity.created_at.desc())
        .limit(20)
        .all()
    )
    return jsonify({ "activity": [a.to_dict() for a in activities] })


# ── GET /api/friends/leaderboard ──────────────────────────────────
@friends_bp.route("/leaderboard", methods=["GET"])
@jwt_required()
def get_leaderboard():
    user_id = int(get_jwt_identity())
    ids = list(_friend_ids(user_id) | {user_id})

    entries = []
    for uid in ids:
        u   = User.query.get(uid)
        lc  = PlatformStat.query.filter_by(user_id=uid, platform="LeetCode").first()
        solved = lc.problems_solved if lc else 0
        entries.append({
            "user_id": uid,
            "name":    u.username,
            "avatar":  u.username[0].upper(),
            "color":   "#7C3AED" if uid == user_id else "#EF4444",
            "score":   solved,
            "is_me":   uid == user_id,
        })

    entries.sort(key=lambda x: x["score"], reverse=True)
    for i, e in enumerate(entries):
        e["rank"] = i + 1

    return jsonify({ "leaderboard": entries })


# ── GET /api/friends/stats ────────────────────────────────────────
@friends_bp.route("/stats", methods=["GET"])
@jwt_required()
def get_stats():
    user_id = int(get_jwt_identity())
    friend_ids = _friend_ids(user_id)

    online  = 0
    contest = 0
    total   = len(friend_ids)
    solved_sum = 0

    for fid in friend_ids:
        u   = User.query.get(fid)
        lc  = PlatformStat.query.filter_by(user_id=fid, platform="LeetCode").first()
        solved_sum += lc.problems_solved if lc else 0
        if u and u.last_active:
            delta = (datetime.utcnow() - u.last_active).total_seconds()
            if delta < 300:
                online += 1

    avg_solved = round(solved_sum / total, 0) if total else 0

    return jsonify({
        "active_now":   online,
        "in_contest":   contest,
        "total_friends": total,
        "avg_solved":   int(avg_solved),
    })


# ── POST /api/friends/activity (internal — log an event) ─────────
@friends_bp.route("/activity", methods=["POST"])
@jwt_required()
def post_activity():
    user_id = int(get_jwt_identity())
    body    = request.get_json(silent=True) or {}
    event   = FriendActivity(
        user_id=user_id,
        action=body.get("action", "did something"),
        detail=body.get("detail", ""),
        tag=body.get("tag"),
        tag_color=body.get("tagColor"),
    )
    db.session.add(event)
    db.session.commit()
    return jsonify({"message": "Activity logged"}), 201
