from datetime import datetime
from app import db


class Problem(db.Model):
    __tablename__ = "problems"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)

    title = db.Column(db.String(300), nullable=False)
    platform = db.Column(db.String(50), nullable=False)
    difficulty = db.Column(db.String(20), nullable=False)
    topic = db.Column(db.String(100), nullable=True)
    status = db.Column(db.String(20), default="Solved")

    url = db.Column(db.String(500), nullable=True)
    notes = db.Column(db.Text, nullable=True)
    time_taken_mins = db.Column(db.Integer, nullable=True)

    solved_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "platform": self.platform,
            "difficulty": self.difficulty,
            "topic": self.topic,
            "status": self.status,
            "url": self.url,
            "notes": self.notes,
            "time_taken_mins": self.time_taken_mins,
            "solved_at": self.solved_at.isoformat() if self.solved_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }