from datetime import datetime
from extensions import db


class Friendship(db.Model):
    """Bidirectional friendship: user_id sent the request, friend_id received it."""
    __tablename__ = "friendships"

    id          = db.Column(db.Integer, primary_key=True)
    user_id     = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    friend_id   = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    status      = db.Column(db.String(20), default="pending", nullable=False)
    # pending | accepted | blocked
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

    user   = db.relationship("User", foreign_keys=[user_id],   backref="sent_requests")
    friend = db.relationship("User", foreign_keys=[friend_id], backref="received_requests")

    __table_args__ = (
        db.UniqueConstraint("user_id", "friend_id", name="uq_friendship"),
    )

    def to_dict(self, viewer_id):
        """Return the other person's info from the viewer's perspective."""
        other = self.friend if self.user_id == viewer_id else self.user
        lc  = next((s for s in other.platform_stats if s.platform == "LeetCode"), None)
        solved  = lc.problems_solved if lc else 0
        acc     = lc.acceptance_rate if lc else 0

        # Determine if last_active makes them "online" (< 5 min) or "away"
        delta = (datetime.utcnow() - other.last_active).total_seconds() if other.last_active else 9999
        if delta < 300:
            status, label = "online", "Online"
        elif delta < 1800:
            status, label = "away", "Away"
        else:
            status, label = "away", f"Away · {_fmt_time(delta)}"

        return {
            "id":           other.id,
            "name":         other.username,
            "handle":       f"@{other.username}",
            "avatar":       other.username[0].upper(),
            "color":        "#7C3AED",          # avatar bg — consistent per user
            "streak":       0,                  # no streak model on User yet
            "solved":       solved,
            "acc":          round(acc, 1),
            "status":       status,
            "statusLabel":  label,
            "activity":     other.bio or "Active DSA practitioner",
            "bio":          other.bio or "",
            "friendship_id": self.id,
            "friendship_status": self.status,
        }


def _fmt_time(seconds):
    m = int(seconds // 60)
    if m < 60:
        return f"{m} min ago"
    return f"{int(m // 60)}h ago"
