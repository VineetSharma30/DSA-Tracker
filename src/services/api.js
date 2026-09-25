// Pure client-side mock API service (No backend required)
import { mockProblems, overallStats, platformStats, goalsData, contestsData } from '../data/mockData';

const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  // Problems
  getProblems: async () => {
    await delay();
    try {
      const saved = localStorage.getItem("dsa_tracker_problems");
      return saved ? JSON.parse(saved) : mockProblems;
    } catch {
      return mockProblems;
    }
  },

  createProblem: async (problem) => {
    await delay();
    const current = await api.getProblems();
    const updated = [problem, ...current];
    localStorage.setItem("dsa_tracker_problems", JSON.stringify(updated));
    return problem;
  },

  // Stats
  getStats: async () => {
    await delay();
    return {
      overall: overallStats,
      platforms: platformStats,
    };
  },

  // Goals
  getGoals: async () => {
    await delay();
    try {
      const saved = localStorage.getItem("dsa_tracker_goals");
      return saved ? JSON.parse(saved) : goalsData;
    } catch {
      return goalsData;
    }
  },

  // Contests
  getContests: async () => {
    await delay();
    try {
      const saved = localStorage.getItem("dsa_tracker_contests");
      return saved ? JSON.parse(saved) : contestsData;
    } catch {
      return contestsData;
    }
  }
};

export default api;
