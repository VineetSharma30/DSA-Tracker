import requests

CF_BASE = "https://codeforces.com/api"


def fetch_codeforces_stats(handle):
    try:
        r = requests.get(f"{CF_BASE}/user.info", params={"handles": handle}, timeout=10)
        r.raise_for_status()
        result = r.json()
        if result.get("status") != "OK" or not result.get("result"):
            return None
        u = result["result"][0]
        return {
            "platform": "Codeforces",
            "rating": u.get("rating"),
            "max_rating": u.get("maxRating"),
            "rank": u.get("rank"),
        }
    except Exception as e:
        print(f"[Codeforces Error] {e}")
        return None


def fetch_codeforces_upcoming():
    """Upcoming Codeforces contests (phase == BEFORE). Global, not per-user."""
    try:
        r = requests.get(f"{CF_BASE}/contest.list", params={"gym": "false"}, timeout=15)
        r.raise_for_status()
        result = r.json()
        if result.get("status") != "OK":
            return []
        upcoming = []
        for c in result.get("result", []):
            if c.get("phase") != "BEFORE":
                continue
            upcoming.append({
                "id": f"cf-{c['id']}",
                "platform": "Codeforces",
                "name": c.get("name"),
                "start_time": c.get("startTimeSeconds"),
                "duration": c.get("durationSeconds"),
                "url": f"https://codeforces.com/contests/{c['id']}",
            })
        upcoming.sort(key=lambda x: x["start_time"] or 0)
        return upcoming
    except Exception as e:
        print(f"[Codeforces Error] {e}")
        return []


def fetch_codeforces_rating_history(handle):
    try:
        r = requests.get(f"{CF_BASE}/user.rating", params={"handle": handle}, timeout=10)
        r.raise_for_status()
        result = r.json()
        if result.get("status") != "OK":
            return None
        return [
            {
                "contest_name": c["contestName"],
                "rank": c["rank"],
                "old_rating": c["oldRating"],
                "new_rating": c["newRating"],
                "date": c["ratingUpdateTimeSeconds"],
            }
            for c in result.get("result", [])
        ]
    except Exception as e:
        print(f"[CF Rating History Error] {e}")
        return None