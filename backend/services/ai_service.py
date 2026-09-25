"""Provider-agnostic AI layer.

Today this talks to Google Gemini, but every feature function below calls
_generate() — the ONE place we touch the LLM SDK. Swapping providers later
(Claude, OpenAI, a local model...) means rewriting _generate only, not the app.
"""
import os
from google import genai

# Model is an env var so you can change it (or swap to a free-tier model) without
# editing code. Defaults to the current Gemini Flash model.
MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")

_client = None


def _get_client():
    """Create the Gemini client lazily so the app still boots without a key."""
    global _client
    if _client is None:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY is not set — add it to backend/.env")
        _client = genai.Client(api_key=api_key)
    return _client


def _generate(prompt):
    """The single point of contact with the LLM. Swap providers HERE only."""
    client = _get_client()
    resp = client.models.generate_content(model=MODEL, contents=prompt)
    return (resp.text or "").strip()


def generate_weekly_insight(stats):
    prompt = f"""You are a direct, encouraging DSA coach.

Stats: {stats}

Write a 2-3 sentence insight. Be specific — name actual topics and numbers.
Identify ONE strength and ONE weakness, then give one concrete next step.
No greeting or preamble. Just the insight."""
    return _generate(prompt)


def generate_full_report(stats, recent_problems):
    problems_summary = "\n".join([
        f"- {p['title']} ({p['platform']}, {p['difficulty']}, {p['topic']}, {p['status']})"
        for p in recent_problems[:30]
    ])
    prompt = f"""You are a senior competitive programming mentor.

STATS: {stats}
RECENT PROBLEMS:
{problems_summary}

Write a structured report in markdown. Use '##' headers for each section:
## Overall Assessment  (2-3 sentences)
## Top Strengths  (2 specific topics)
## Areas Needing Work  (2 specific topics)
## This Week's Action Plan  (3 concrete problems/topics)
## Pattern Observation

Use **bold** for emphasis and bullet lists where helpful. Write complexities in
plain text like O(n log n) — do NOT use LaTeX or dollar signs. Under 350 words. Be specific."""
    return _generate(prompt)


def generate_problem_recommendations(stats, weak_topics, solved_titles=None):
    solved_titles = solved_titles or []
    already_solved = ", ".join(solved_titles[:60]) if solved_titles else "none yet"
    prompt = f"""You are a DSA coach. Weak topics: {weak_topics}
Stats: {stats}

The student has ALREADY SOLVED these problems — do NOT recommend any of them again:
{already_solved}

Recommend exactly 3 specific, well-known LeetCode problems the student has NOT solved yet,
chosen to strengthen their weak topics and to build naturally on what they've already done.

Format as a markdown numbered list. For each problem:
- Make the title a markdown link to its real LeetCode URL using the correct slug, e.g.
  **[Coin Change](https://leetcode.com/problems/coin-change/)**
- On the next line put the difficulty in bold (e.g. **Medium**) and one sentence on why it
  helps, referencing what they've already solved when relevant.

No preamble or closing remarks."""
    return _generate(prompt)


def generate_roast(stats, strength_weakness):
    prompt = f"""You are a witty, slightly savage but supportive competitive programming mentor.
Roast this student's DSA data — funny and a little brutal, but end with encouragement.

Stats: {stats}
Topic breakdown: {strength_weakness}

3-4 sentences. Call out their weakest topic by name. End on an encouraging note."""
    return _generate(prompt)
