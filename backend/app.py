from flask import Flask
from flask_cors import CORS
from extensions import db, migrate, jwt
from config import Config
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime

def auto_sync_all_users():
    """Runs daily — syncs LeetCode stats + last 20 submissions for every user."""
    with app.app_context():
        from models.user import User
        from models.problem import Problem
        from services.leetcode_service import fetch_leetcode_stats, fetch_leetcode_accepted_submissions

        users = User.query.filter(User.leetcode_handle.isnot(None)).all()
        print(f"[Auto-sync] Syncing {len(users)} users at {datetime.utcnow()}")

        for user in users:
            try:
                # Sync stats
                stats = fetch_leetcode_stats(user.leetcode_handle)
                if stats:
                    from routes.platform_routes import _upsert_platform_stat
                    _upsert_platform_stat(user.id, "LeetCode", stats)

                # Import new submissions
                submissions = fetch_leetcode_accepted_submissions(user.leetcode_handle, limit=20)
                existing_urls = {p.url for p in Problem.query.filter_by(user_id=user.id).all() if p.url}

                for s in submissions:
                    if s["url"] not in existing_urls:
                        problem = Problem(
                            user_id=user.id,
                            title=s["title"],
                            platform="LeetCode",
                            difficulty=s.get("difficulty", "Medium"),  # real difficulty from the API
                            status="Solved",
                            url=s["url"],
                            solved_at=datetime.fromtimestamp(int(s["timestamp"])) if s.get("timestamp") else datetime.utcnow(),
                        )
                        db.session.add(problem)

                db.session.commit()
                print(f"[Auto-sync] Done: {user.username}")

            except Exception as e:
                print(f"[Auto-sync] Failed for {user.username}: {e}")
                db.session.rollback()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Init extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": app.config["FRONTEND_URL"]}},
         supports_credentials=True)

    # Register blueprints
    from routes.auth_routes import auth_bp
    from routes.problem_routes import problem_bp
    from routes.dashboard_routes import dashboard_bp
    from routes.platform_routes import platform_bp
    from routes.ai_routes import ai_bp
    from routes.goal_routes import goal_bp
    from routes.friend_routes import friends_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(problem_bp, url_prefix="/api/problems")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    app.register_blueprint(platform_bp, url_prefix="/api/platforms")
    app.register_blueprint(ai_bp, url_prefix="/api/ai")
    app.register_blueprint(goal_bp, url_prefix="/api/goals")
    app.register_blueprint(friends_bp, url_prefix="/api/friends")

    @app.route("/api/health")
    def health():
        return {"status": "ok", "message": "DSA Tracker API is running"}

    scheduler = BackgroundScheduler()
    scheduler.add_job(
        func=lambda: auto_sync_all_users(),
        trigger="interval",
        hours=24,
        id="daily_leetcode_sync",
        replace_existing=True
    )
    scheduler.start()

    return app