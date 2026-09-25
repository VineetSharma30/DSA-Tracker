from datetime import datetime
from app import db


class Goal(db.Model):
    __tablename__ = "goals"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)

    title = db.Column(db.String(300), nullable=False)
    category = db.Column(db.String(50), nullable=True)
    target_value = db.Column(db.Integer, nullable=False)
    current_value = db.Column(db.Integer, default=0)
    deadline = db.Column(db.Date, nullable=True)
    color = db.Column(db.String(20), default="#7C3AED")
    is_completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        pct = round((self.current_value / self.target_value) * 100, 1) if self.target_value else 0
        return {
            "id": self.id,
            "title": self.title,
            "category": self.category,
            "target_value": self.target_value,
            "current_value": self.current_value,
            "progress_pct": min(pct, 100),
            "deadline": self.deadline.isoformat() if self.deadline else None,
            "color": self.color,
            "is_completed": self.is_completed,
        }