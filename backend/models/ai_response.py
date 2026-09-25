from datetime import datetime
from app import db


class AIResponse(db.Model):
    """Caches a generated AI payload per (user, kind) so we don't pay to
    regenerate on every page load. We serve the latest row within the TTL."""
    __tablename__ = "ai_responses"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    kind = db.Column(db.String(30), nullable=False)   # insight / report / recommend / roast
    payload = db.Column(db.JSON, nullable=False)        # the exact JSON we return to the client
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
