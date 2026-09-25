// Pure client-side mock Auth service (No backend required)
const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  login: async (email, password) => {
    await delay();
    const displayName = email.split('@')[0] || "User";
    const user = {
      name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
      email,
      role: "B.Tech CSE",
      avatarInitial: (displayName.charAt(0) || "U").toUpperCase()
    };
    localStorage.setItem("dsa_tracker_current_user", JSON.stringify(user));
    return { success: true, user };
  },

  register: async ({ username, email }) => {
    await delay();
    const user = {
      name: username || "New User",
      email,
      role: "B.Tech CSE",
      avatarInitial: (username ? username.charAt(0) : "N").toUpperCase()
    };
    localStorage.setItem("dsa_tracker_current_user", JSON.stringify(user));
    return { success: true, user };
  },

  logout: async () => {
    await delay();
    localStorage.removeItem("dsa_tracker_current_user");
    return { success: true };
  },

  getCurrentUser: () => {
    try {
      const saved = localStorage.getItem("dsa_tracker_current_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }
};

export default authService;
