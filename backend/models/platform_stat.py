from datetime import datetime
from app import db


class PlatformStat(db.Model):
    __tablename__ = "platform_stats"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)

    platform = db.Column(db.String(50), nullable=False)
    rating = db.Column(db.Integer, nullable=True)
    max_rating = db.Column(db.Integer, nullable=True)
    problems_solved = db.Column(db.Integer, default=0)
    rank = db.Column(db.String(50), nullable=True)
    global_rank = db.Column(db.Integer, nullable=True)

    easy_solved = db.Column(db.Integer, default=0)
    medium_solved = db.Column(db.Integer, default=0)
    hard_solved = db.Column(db.Integer, default=0)

    # Cached JSON blobs so we only call the external API on an explicit "Sync"
    # and serve every page load straight from our own database.
    skill_data = db.Column(db.JSON, nullable=True)        # topic breakdown (list of dicts)
    calendar_data = db.Column(db.JSON, nullable=True)     # {timestamp: count} submission calendar
    last_synced_at = db.Column(db.DateTime, nullable=True)  # when the last full sync happened

    fetched_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "platform": self.platform,
            "rating": self.rating,
            "max_rating": self.max_rating,
            "problems_solved": self.problems_solved,
            "rank": self.rank,
            "global_rank": self.global_rank,
            "easy_solved": self.easy_solved,
            "medium_solved": self.medium_solved,
            "hard_solved": self.hard_solved,
            "skill_data": self.skill_data,
            "calendar_data": self.calendar_data,
            "fetched_at": self.fetched_at.isoformat() if self.fetched_at else None,
            "last_synced_at": self.last_synced_at.isoformat() if self.last_synced_at else None,
        }