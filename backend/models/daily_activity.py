from datetime import datetime
from app import db


class DailyActivity(db.Model):
    __tablename__ = "daily_activities"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)

    date = db.Column(db.Date, nullable=False, index=True)
    problems_solved = db.Column(db.Integer, default=0)
    time_spent_mins = db.Column(db.Integer, default=0)

    __table_args__ = (
        db.UniqueConstraint("user_id", "date", name="unique_user_date"),
    )

    def to_dict(self):
        return {
            "date": self.date.isoformat() if self.date else None,
            "problems_solved": self.problems_solved,
            "time_spent_mins": self.time_spent_mins,
        }