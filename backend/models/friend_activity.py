from datetime import datetime
from extensions import db


class FriendActivity(db.Model):
    """A log of public DSA events visible to friends."""
    __tablename__ = "friend_activities"

    id          = db.Column(db.Integer, primary_key=True)
    user_id     = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    action      = db.Column(db.String(60),  nullable=False)   # "solved", "reached", "improved"
    detail      = db.Column(db.String(200), nullable=False)   # problem name / achievement
    tag         = db.Column(db.String(20),  nullable=True)    # "Hard" | "Medium" | "Easy" | null
    tag_color   = db.Column(db.String(10),  nullable=True)
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", backref="activities")

    def to_dict(self):
        from models.user import User  # local import avoids circular
        u = self.user
        delta = datetime.utcnow() - self.created_at
        mins  = int(delta.total_seconds() // 60)
        if mins < 60:
            time_str = f"{mins}m ago"
        elif mins < 1440:
            time_str = f"{mins // 60}h ago"
        else:
            time_str = f"{mins // 1440}d ago"

        return {
            "id":       self.id,
            "name":     u.username,
            "avatar":   u.username[0].upper(),
            "color":    "#7C3AED",
            "action":   self.action,
            "detail":   self.detail,
            "tag":      self.tag,
            "tagColor": self.tag_color,
            "time":     time_str,
        }
