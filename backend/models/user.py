from datetime import datetime
import bcrypt
from app import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)

    leetcode_handle = db.Column(db.String(100), nullable=True)
    codeforces_handle = db.Column(db.String(100), nullable=True)
    codechef_handle = db.Column(db.String(100), nullable=True)

    avatar_url = db.Column(db.String(500), nullable=True)
    bio = db.Column(db.String(280), nullable=True)

    # Notification preferences
    pref_contest_reminders = db.Column(db.Boolean, default=True, nullable=False)
    pref_weekly_report     = db.Column(db.Boolean, default=True, nullable=False)
    pref_streak_alerts     = db.Column(db.Boolean, default=True, nullable=False)
    pref_platform_sync     = db.Column(db.Boolean, default=False, nullable=False)

    # Privacy preferences
    pref_public_profile = db.Column(db.Boolean, default=False, nullable=False)
    pref_show_streak    = db.Column(db.Boolean, default=True, nullable=False)
    pref_show_ratings   = db.Column(db.Boolean, default=True, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_active = db.Column(db.DateTime, default=datetime.utcnow)

    problems         = db.relationship("Problem",       backref="user", lazy=True, cascade="all, delete-orphan")
    goals            = db.relationship("Goal",          backref="user", lazy=True, cascade="all, delete-orphan")
    platform_stats   = db.relationship("PlatformStat", backref="user", lazy=True, cascade="all, delete-orphan")
    daily_activities = db.relationship("DailyActivity",backref="user", lazy=True, cascade="all, delete-orphan")
    ai_responses     = db.relationship("AIResponse",   backref="user", lazy=True, cascade="all, delete-orphan")

    def set_password(self, raw_password):
        self.password_hash = bcrypt.hashpw(
            raw_password.encode(), bcrypt.gensalt()
        ).decode()

    def check_password(self, raw_password):
        return bcrypt.checkpw(
            raw_password.encode(), self.password_hash.encode()
        )

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "leetcode_handle": self.leetcode_handle,
            "codeforces_handle": self.codeforces_handle,
            "codechef_handle": self.codechef_handle,
            "avatar_url": self.avatar_url,
            "bio": self.bio,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "preferences": {
                "contestReminders": self.pref_contest_reminders,
                "weeklyReport":     self.pref_weekly_report,
                "streakAlerts":     self.pref_streak_alerts,
                "platformSync":     self.pref_platform_sync,
                "publicProfile":    self.pref_public_profile,
                "showStreak":       self.pref_show_streak,
                "showRatings":      self.pref_show_ratings,
            },
        }