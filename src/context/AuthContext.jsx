import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null);

const DEFAULT_USER = {
  name: "Vineet",
  email: "vineet@example.com",
  role: "B.Tech CSE",
  avatarInitial: "V",
  bio: "Pre-final year CS student passionate about algorithms, systems, and full-stack development.",
  leetcode_handle: "vineet_code",
  codeforces_handle: "vineet_cf",
  codechef_handle: "vineet_cc"
};

const STORAGE_KEY = "dsa_tracker_current_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem(STORAGE_KEY));
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error("Failed to sync user to localStorage", e);
    }
  }, [user]);

  const login = (email, password) => {
    const displayName = email && email.includes("@") ? email.split("@")[0] : (user?.name || "Vineet");
    const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
    const updatedUser = {
      ...(user || DEFAULT_USER),
      email: email || "user@example.com",
      name: formattedName,
      avatarInitial: formattedName.charAt(0).toUpperCase() || "U",
    };
    setUser(updatedUser);
    setIsAuthenticated(true);
    return updatedUser;
  };

  const register = ({ username, email }) => {
    const updatedUser = {
      ...DEFAULT_USER,
      name: username || "New Programmer",
      email: email || "coder@example.com",
      avatarInitial: (username ? username.charAt(0) : "N").toUpperCase(),
    };
    setUser(updatedUser);
    setIsAuthenticated(true);
    return updatedUser;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateUser = (fields) => {
    setUser(prev => {
      const updated = { ...prev, ...fields };
      if (fields.name) {
        updated.avatarInitial = fields.name.charAt(0).toUpperCase();
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}