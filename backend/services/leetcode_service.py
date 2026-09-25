"""LeetCode data — fetched directly from LeetCode's own GraphQL API.

We used to go through the public alfa-leetcode-api proxy, but that's a single
shared instance everyone hammers, so it rate-limits us (429) constantly. Talking
to https://leetcode.com/graphql directly removes the flaky middleman: it's the
same data LeetCode's own profile pages use, needs no login for public profiles,
and is far more reliable. Each function returns the SAME shape it always did, so
nothing downstream had to change.
"""
import json
import time
import requests

GRAPHQL_URL = "https://leetcode.com/graphql"

_BASE_HEADERS = {
    "Content-Type": "application/json",
    "Origin": "https://leetcode.com",
    "Referer": "https://leetcode.com",
    # A browser-like User-Agent — LeetCode rejects obviously-bot requests.
    "User-Agent": ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                   "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"),
}


def _gql(query, variables=None, referer=None, retries=3):
    """POST a GraphQL query to LeetCode. Returns the `data` object, or None.

    Keeps the retry/backoff habit (2s, 4s, 8s) for the rare 429 / 5xx / timeout.
    """
    headers = dict(_BASE_HEADERS)
    if referer:
        headers["Referer"] = referer
    payload = {"query": query, "variables": variables or {}}

    for attempt in range(retries):
        try:
            r = requests.post(GRAPHQL_URL, json=payload, headers=headers, timeout=20)
            if r.status_code == 429 or r.status_code >= 500:
                wait = 2 ** (attempt + 1)
                print(f"[LeetCode GQL] {r.status_code}; retry {attempt + 1}/{retries} in {wait}s")
                time.sleep(wait)
                continue
            r.raise_for_status()
            body = r.json()
            if body.get("errors"):
                print(f"[LeetCode GQL] query errors: {body['errors']}")
                return None
            return body.get("data")
        except requests.exceptions.HTTPError as e:
            print(f"[LeetCode GQL Error] {e}")
            return None
        except requests.exceptions.RequestException as e:
            print(f"[LeetCode GQL Error] (attempt {attempt + 1}/{retries}): {e}")
            if attempt < retries - 1:
                time.sleep(2 ** (attempt + 1))
    print("[LeetCode GQL] gave up after retries")
    return None


def _user_referer(username):
    # LeetCode is happier when the Referer points at the profile being queried.
    return f"https://leetcode.com/u/{username}/"


def _counts_by_difficulty(ac_submission_num):
    """Turn [{difficulty, count}, ...] into {'All': n, 'Easy': n, ...}."""
    return {row["difficulty"]: row["count"] for row in (ac_submission_num or [])}


def fetch_leetcode_stats(username):
    """Solved counts + contest rating — for the platform stat card."""
    data = _gql("""
    query userStats($username: String!) {
      matchedUser(username: $username) {
        submitStatsGlobal { acSubmissionNum { difficulty count } }
        profile { ranking }
      }
      userContestRanking(username: $username) { rating globalRanking }
    }""", {"username": username}, referer=_user_referer(username))

    if not data or not data.get("matchedUser"):
        return None

    counts = _counts_by_difficulty(data["matchedUser"]["submitStatsGlobal"]["acSubmissionNum"])
    contest = data.get("userContestRanking")  # null for users who never did a contest
    rating = round(contest["rating"]) if contest and contest.get("rating") else None

    return {
        "platform": "LeetCode",
        "easy_solved": counts.get("Easy", 0),
        "medium_solved": counts.get("Medium", 0),
        "hard_solved": counts.get("Hard", 0),
        "problems_solved": counts.get("All", 0),
        "rating": rating,
        "global_rank": contest.get("globalRanking") if contest else None,
        "rank": _rating_to_rank(rating) if rating else None,
    }


def fetch_leetcode_skill_stats(username):
    """Topic-level skill breakdown — for Strength vs Weakness chart."""
    data = _gql("""
    query skillStats($username: String!) {
      matchedUser(username: $username) {
        tagProblemCounts {
          advanced { tagName tagSlug problemsSolved }
          intermediate { tagName tagSlug problemsSolved }
          fundamental { tagName tagSlug problemsSolved }
        }
      }
    }""", {"username": username}, referer=_user_referer(username))

    if not data or not data.get("matchedUser"):
        return None

    tag_counts = data["matchedUser"]["tagProblemCounts"]
    result = []
    for level in ["advanced", "intermediate", "fundamental"]:
        for item in tag_counts.get(level, []):
            result.append({
                "topic": item.get("tagName"),
                "problems_solved": item.get("problemsSolved", 0),
                "level": level,
            })
    return result


def fetch_leetcode_calendar(username, year=None):
    """Daily submission data — for the Consistency Heatmap.
    Returns dict of {timestamp_str: submission_count}.
    """
    if year:
        query = """
        query userCalendar($username: String!, $year: Int) {
          matchedUser(username: $username) {
            userCalendar(year: $year) { submissionCalendar }
          }
        }"""
        variables = {"username": username, "year": year}
    else:
        query = """
        query userCalendar($username: String!) {
          matchedUser(username: $username) {
            userCalendar { submissionCalendar }
          }
        }"""
        variables = {"username": username}

    data = _gql(query, variables, referer=_user_referer(username))
    if not data or not data.get("matchedUser"):
        return None

    calendar_str = data["matchedUser"]["userCalendar"].get("submissionCalendar", "{}")
    try:
        return json.loads(calendar_str)
    except Exception:
        return {}


def fetch_leetcode_upcoming_contests():
    """The next couple of upcoming LeetCode contests (global, not per-user)."""
    data = _gql("query upcoming { topTwoContests { title titleSlug startTime duration } }")
    if not data:
        return []
    out = []
    for c in data.get("topTwoContests") or []:
        slug = c.get("titleSlug", "")
        out.append({
            "id": f"lc-{slug}",
            "platform": "LeetCode",
            "name": c.get("title"),
            "start_time": c.get("startTime"),
            "duration": c.get("duration"),
            "url": f"https://leetcode.com/contest/{slug}",
        })
    return out


def _rating_to_rank(rating):
    """Convert contest rating to a LeetCode rank badge."""
    if not rating:
        return None
    if rating >= 2500: return "Guardian"
    if rating >= 2200: return "Knight"
    if rating >= 1600: return "Knight"
    if rating >= 1400: return "Silver"
    return "Bronze"


def fetch_leetcode_progress(username):
    """Combines solved counts + skill stats into one rich progress object.
    Used for the Dashboard stat row and Strength vs Weakness chart.
    """
    data = _gql("""
    query userProgress($username: String!) {
      allQuestionsCount { difficulty count }
      matchedUser(username: $username) {
        submitStatsGlobal { acSubmissionNum { difficulty count } }
        tagProblemCounts {
          advanced { tagName problemsSolved }
          intermediate { tagName problemsSolved }
          fundamental { tagName problemsSolved }
        }
      }
    }""", {"username": username}, referer=_user_referer(username))

    if not data or not data.get("matchedUser"):
        return None

    solved = _counts_by_difficulty(data["matchedUser"]["submitStatsGlobal"]["acSubmissionNum"])
    totals = _counts_by_difficulty(data.get("allQuestionsCount"))

    result = {
        "easy_solved": solved.get("Easy", 0),
        "medium_solved": solved.get("Medium", 0),
        "hard_solved": solved.get("Hard", 0),
        "total_solved": solved.get("All", 0),
        "easy_total": totals.get("Easy", 0),
        "medium_total": totals.get("Medium", 0),
        "hard_total": totals.get("Hard", 0),
        "topics": []
    }

    tag_counts = data["matchedUser"]["tagProblemCounts"]
    # Flatten all skill levels into one list with an estimated mastery score.
    for level, weight in [("advanced", 1.0), ("intermediate", 0.75), ("fundamental", 0.5)]:
        for item in tag_counts.get(level, []):
            solved_count = item.get("problemsSolved", 0)
            if solved_count > 0:
                result["topics"].append({
                    "topic": item.get("tagName"),
                    "solved": solved_count,
                    "level": level,
                    "score": min(round(solved_count * weight * 10), 100)
                })

    result["topics"].sort(key=lambda x: x["score"], reverse=True)
    return result


# Cache per-problem metadata so we never look up the same slug twice.
_meta_cache = {}


def fetch_problem_meta(title_slug):
    """Difficulty + primary topic tag for a problem, in one query. Cached.

    Returns {"difficulty": "Easy"/"Medium"/"Hard", "topic": "Array" or None}.
    """
    if title_slug in _meta_cache:
        return _meta_cache[title_slug]

    data = _gql("""
    query questionMeta($titleSlug: String!) {
      question(titleSlug: $titleSlug) { difficulty topicTags { name } }
    }""", {"titleSlug": title_slug})

    meta = {"difficulty": "Medium", "topic": None}
    if data and data.get("question"):
        q = data["question"]
        meta["difficulty"] = q.get("difficulty", "Medium")
        tags = q.get("topicTags") or []
        if tags:
            meta["topic"] = tags[0].get("name")   # first tag = the primary topic
    _meta_cache[title_slug] = meta
    return meta


def fetch_problem_difficulty(title_slug):
    """Difficulty only — kept for callers that don't need the topic."""
    return fetch_problem_meta(title_slug)["difficulty"]


def fetch_leetcode_accepted_submissions(username, limit=20):
    """Recent accepted submissions with real difficulty.

    Note: LeetCode caps recentAcSubmissionList at ~20 regardless of `limit`,
    so this naturally returns at most ~20 problems (and ~20 difficulty lookups).
    """
    data = _gql("""
    query recentAc($username: String!, $limit: Int!) {
      recentAcSubmissionList(username: $username, limit: $limit) {
        title titleSlug timestamp
      }
    }""", {"username": username, "limit": limit}, referer=_user_referer(username))

    if not data:
        return []

    submissions = data.get("recentAcSubmissionList") or []
    seen_slugs = set()
    unique = []

    for s in submissions:
        slug = s.get("titleSlug", "")
        if slug and slug not in seen_slugs:
            seen_slugs.add(slug)
            meta = fetch_problem_meta(slug)
            unique.append({
                # GraphQL gives the real, properly-cased title (e.g. "Pow(x, n)").
                "title": s.get("title") or " ".join(w.capitalize() for w in slug.split("-")),
                "title_slug": slug,
                "url": f"https://leetcode.com/problems/{slug}/",
                "difficulty": meta["difficulty"],
                "topic": meta["topic"],
                "timestamp": s.get("timestamp"),
            })

    return unique
