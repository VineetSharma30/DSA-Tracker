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

export const mockProblems = [
  { id: 1, title: "Two Sum", platform: "LeetCode", difficulty: "Easy", topic: "Arrays", status: "Solved", solvedAt: "Jun 12" },
  { id: 2, title: "Longest Substring Without Repeating Characters", platform: "LeetCode", difficulty: "Medium", topic: "Strings", status: "Solved", solvedAt: "Jun 11" },
  { id: 3, title: "Median of Two Sorted Arrays", platform: "LeetCode", difficulty: "Hard", topic: "Binary Search", status: "Attempted", solvedAt: "Jun 10" },
  { id: 4, title: "Container With Most Water", platform: "LeetCode", difficulty: "Medium", topic: "Two Pointers", status: "Solved", solvedAt: "Jun 09" },
  { id: 5, title: "Best Time to Buy and Sell Stock", platform: "LeetCode", difficulty: "Easy", topic: "DP", status: "Solved", solvedAt: "Jun 08" },
  { id: 6, title: "Word Break", platform: "Codeforces", difficulty: "Medium", topic: "DP", status: "Not Attempted", solvedAt: "—" },
  { id: 7, title: "Merge K Sorted Lists", platform: "LeetCode", difficulty: "Hard", topic: "Linked List", status: "Solved", solvedAt: "Jun 07" },
  { id: 8, title: "Valid Parentheses", platform: "LeetCode", difficulty: "Easy", topic: "Stacks", status: "Solved", solvedAt: "Jun 06" },
  { id: 9, title: "Course Schedule", platform: "LeetCode", difficulty: "Medium", topic: "Graphs", status: "Attempted", solvedAt: "Jun 05" },
  { id: 10, title: "Trapping Rain Water", platform: "CodeChef", difficulty: "Hard", topic: "Arrays", status: "Solved", solvedAt: "Jun 04" },
  { id: 11, title: "Binary Search", platform: "LeetCode", difficulty: "Easy", topic: "Binary Search", status: "Solved", solvedAt: "Jun 03" },
  { id: 12, title: "Maximum Subarray", platform: "LeetCode", difficulty: "Medium", topic: "DP", status: "Solved", solvedAt: "Jun 02" },
  { id: 13, title: "Climbing Stairs", platform: "LeetCode", difficulty: "Easy", topic: "DP", status: "Solved", solvedAt: "Jun 01" },
  { id: 14, title: "Number of Islands", platform: "Codeforces", difficulty: "Medium", topic: "Graphs", status: "Attempted", solvedAt: "May 31" },
  { id: 15, title: "Rotate Image", platform: "LeetCode", difficulty: "Medium", topic: "Arrays", status: "Solved", solvedAt: "May 30" },
];

export const analyticsStats = [
  { label: "Total Solved", value: "542", delta: "+23 this week", color: "#7C3AED" },
  { label: "Acceptance Rate", value: "78.6%", delta: "↑ 4.2% vs last month", color: "#10B981" },
  { label: "Active Days", value: "47/60", delta: "78% consistency", color: "#3B82F6" },
  { label: "Best Streak", value: "45 Days", delta: "Current: 21 days", color: "#F59E0B" },
];

export const weeklyVelocity = [
  { week: "W1", solved: 28 }, { week: "W2", solved: 35 },
  { week: "W3", solved: 42 }, { week: "W4", solved: 38 },
  { week: "W5", solved: 51 }, { week: "W6", solved: 47 },
  { week: "W7", solved: 55 }, { week: "W8", solved: 62 },
  { week: "W9", solved: 58 }, { week: "W10", solved: 66 },
];

export const ratingHistory = {
  LeetCode: [
    { contest: "Jan", rating: 1520 }, { contest: "Feb", rating: 1580 },
    { contest: "Mar", rating: 1610 }, { contest: "Apr", rating: 1650 },
    { contest: "May", rating: 1720 }, { contest: "Jun", rating: 1780 },
    { contest: "Jul", rating: 1842 },
  ],
  Codeforces: [
    { contest: "Jan", rating: 1100 }, { contest: "Feb", rating: 1180 },
    { contest: "Mar", rating: 1220 }, { contest: "Apr", rating: 1290 },
    { contest: "May", rating: 1380 }, { contest: "Jun", rating: 1420 },
    { contest: "Jul", rating: 1456 },
  ],
  CodeChef: [
    { contest: "Jan", rating: 1400 }, { contest: "Feb", rating: 1450 },
    { contest: "Mar", rating: 1510 }, { contest: "Apr", rating: 1550 },
    { contest: "May", rating: 1590 }, { contest: "Jun", rating: 1610 },
    { contest: "Jul", rating: 1623 },
  ],
};

export const topicRadar = [
  { topic: "Arrays",  score: 82 },
  { topic: "DP",      score: 32 },
  { topic: "Trees",   score: 68 },
  { topic: "Graphs",  score: 45 },
  { topic: "Strings", score: 71 },
  { topic: "BSearch", score: 55 },
];


export const profileData = {
  name: "Vineet Sharma",
  username: "@vineet_s",
  bio: "B.Tech CSE @ AKTU • IIT Madras BS Data Science • Competitive Programmer",
  avatarInitial: "V",
  joinedDate: "Jan 2024",
  platforms: [
    { name: "LeetCode",   handle: "@vineet_s",       rating: 1842, rank: "Knight",     color: "#F89F1B" },
    { name: "Codeforces", handle: "@vs_code",         rating: 1456, rank: "Specialist", color: "#3B82F6" },
    { name: "CodeChef",   handle: "@vineet",          rating: 1623, rank: "3★",         color: "#FCD34D" },
    { name: "HackerRank", handle: "@vineet_sharma",   rating: "5★", rank: "Gold",       color: "#00C853" },
  ],
  stats: [
    { label: "Problems",  value: "542"    },
    { label: "Streak",    value: "21d"    },
    { label: "Score",     value: "78/100" },
    { label: "Rank",      value: "#1.2K"  },
  ],
};

export const goalsData = [
  { id: 1, title: "Solve 110+ LeetCode problems", category: "problems", current: 54,   target: 110,  deadline: "Aug 2024", color: "#7C3AED" },
  { id: 2, title: "Reach 1800 LeetCode rating",   category: "rating",   current: 1780, target: 1800, deadline: "Jul 2024", color: "#F89F1B" },
  { id: 3, title: "Complete Kunal's DSA Playlist", category: "learning", current: 68,  target: 100,  deadline: "Aug 2024", color: "#3B82F6" },
  { id: 4, title: "Solve 20 Graph problems",       category: "topic",    current: 9,   target: 20,   deadline: "Jul 2024", color: "#10B981" },
  { id: 5, title: "Master Dynamic Programming",    category: "topic",    current: 32,  target: 100,  deadline: "Sep 2024", color: "#EF4444" },
];

export const contestsData = [
  { id: 1, platform: "LeetCode",   abbr: "LC", name: "Weekly Contest 452",        date: "Jun 22, 2024", time: "8:00 AM IST",  type: "Weekly",   starts: "Starts in 2 days",  color: "#F89F1B", registered: true  },
  { id: 2, platform: "Codeforces", abbr: "CF", name: "Codeforces Round 987",      date: "Jun 19, 2024", time: "8:05 PM IST",  type: "Div. 2",   starts: "Starts in 4 days",  color: "#3B82F6", registered: false },
  { id: 3, platform: "CodeChef",   abbr: "CC", name: "Starters 145",              date: "Jun 25, 2024", time: "8:00 PM IST",  type: "Starters", starts: "Starts in 6 days",  color: "#FCD34D", registered: false },
  { id: 4, platform: "LeetCode",   abbr: "LC", name: "Biweekly Contest 133",      date: "Jun 29, 2024", time: "8:00 AM IST",  type: "Biweekly", starts: "Starts in 10 days", color: "#F89F1B", registered: false },
  { id: 5, platform: "Codeforces", abbr: "CF", name: "Educational Round 165",     date: "Jul 03, 2024", time: "9:35 PM IST",  type: "Edu",      starts: "Starts in 14 days", color: "#3B82F6", registered: false },
  { id: 6, platform: "HackerRank", abbr: "HR", name: "Week of Code 47",           date: "Jul 05, 2024", time: "All day",       type: "Marathon", starts: "Starts in 16 days", color: "#00C853", registered: false },
];

export const contestHistory = [
  { platform: "LeetCode",   name: "Weekly Contest 451",    date: "Jun 15", rank: 1243, delta: "+12",  color: "#F89F1B" },
  { platform: "Codeforces", name: "Round 986",             date: "Jun 12", rank: 892,  delta: "+23",  color: "#3B82F6" },
  { platform: "LeetCode",   name: "Biweekly Contest 132",  date: "Jun 08", rank: 1876, delta: "-8",   color: "#F89F1B" },
  { platform: "CodeChef",   name: "Starters 144",          date: "Jun 05", rank: 445,  delta: "+31",  color: "#FCD34D" },
  { platform: "Codeforces", name: "Round 985",             date: "Jun 01", rank: 1102, delta: "+15",  color: "#3B82F6" },
];