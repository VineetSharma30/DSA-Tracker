// src/data/mockData.js

export const platformStats = [
  {
    platform: "LeetCode",
    rating: 1842,
    problemsSolved: 342,
    rank: "Knight",
    color: "#F89F1B",
    ratingChange: +23,
    trend: "up",
  },
  {
    platform: "Codeforces",
    rating: 1456,
    problemsSolved: 118,
    rank: "Specialist",
    color: "#3B82F6",
    ratingChange: -12,
    trend: "down",
  },
  {
    platform: "CodeChef",
    rating: 1623,
    problemsSolved: 64,
    rank: "3★",
    color: "#FCD34D",
    ratingChange: +0,
    trend: "neutral",
  },
  {
    platform: "HackerRank",
    rating: 2180,
    problemsSolved: 89,
    rank: "Gold",
    color: "#00C853",
    ratingChange: +45,
    trend: "up",
  },
];

export const overallStats = {
  totalSolved: 613,
  streak: 21,
  accuracy: 78.4,
  globalRank: 14203,
  dsaScore: 78,
  scoreLabel: "Good",
};


export const solvedOverTime = [
  { date: "Mon 20", solved: 21 },
  { date: "Tue 21", solved: 29 },
  { date: "Wed 22", solved: 41 },
  { date: "Thu 23", solved: 52 },
  { date: "Fri 24", solved: 67 },
  { date: "Sat 25", solved: 59 },
  { date: "Sun 27", solved: 61 },
];

export const topicDistribution = [
  { topic: "Arrays",  count: 142, fill: "#7C3AED" },
  { topic: "DP",      count: 89,  fill: "#3B82F6" },
  { topic: "Graphs",  count: 67,  fill: "#10B981" },
  { topic: "Trees",   count: 98,  fill: "#F59E0B" },
  { topic: "Strings", count: 71,  fill: "#EF4444" },
  { topic: "Others",  count: 146, fill: "#6B7280" },
];

export const upcomingContests = [
  { platform: "LeetCode",   abbr: "LC", name: "Weekly Contest 452",    date: "Jun 22", time: "8:00 AM IST", color: "#F89F1B", startsIn: "Starts in 2 days" },
  { platform: "Codeforces", abbr: "CF", name: "Codeforces Round 987",  date: "Jun 19", time: "8:05 PM IST", color: "#3B82F6", startsIn: "Starts in 4 days" },
  { platform: "CodeChef",   abbr: "CC", name: "Starters 145",          date: "Jun 25", time: "8:00 PM IST", color: "#FCD34D", startsIn: "Starts in 6 days" },
];


export const difficultyStats = {
  easy:   { count: 198, percent: 36 },
  medium: { count: 275, percent: 51 },
  hard:   { count: 69,  percent: 13 },
};

export const difficultyDistribution = [
  { level: "Easy",   percent: 36, fill: "#10B981" },
  { level: "Medium", percent: 51, fill: "#F59E0B" },
  { level: "Hard",   percent: 13, fill: "#EF4444" },
];

export const strengthWeakness = [
  { topic: "Arrays",            score: 82 },
  { topic: "Linked List",       score: 75 },
  { topic: "Trees",             score: 68 },
  { topic: "Graphs",            score: 45 },
  { topic: "Dynamic Programming", score: 32 },
  { topic: "Advanced Topics",   score: 28 },
];
