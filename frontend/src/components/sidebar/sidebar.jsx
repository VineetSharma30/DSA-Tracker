import { NavLink } from 'react-router-dom'
import { Home, List, BarChart3, Flag, Target, Users, Trophy, Sparkles, Settings } from 'lucide-react'

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/problems", label: "Problems", icon: List },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/contests", label: "Contests", icon: Flag },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/friends", label: "Friends", icon: Users },
  { to: "/leaderboards", label: "Leaderboards", icon: Trophy },
  { to: "/ai-insights", label: "AI Insights", icon: Sparkles },
  { to: "/settings", label: "Settings", icon: Settings },
];

function Sidebar() {
  return (
    <aside className="w-55 h-screen bg-bg-sidebar border-r border-border-subtle flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="w-9 h-9 rounded-lg bg-linear-to-br from-accent-purple to-accent-blue flex items-center justify-center text-white font-bold text-xs">
          {"<>"}
        </div>
        <span className="text-text-primary font-extrabold text-sm">DSA Tracker</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-pill text-sm transition-colors ${
                isActive
                  ? "bg-[#1E1840] text-white font-semibold border border-accent-purple/50"
                  : "text-text-muted hover:text-text-secondary"
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Streak card */}
      <div className="m-3 p-4 rounded-card bg-[#1A1A2E] border border-accent-purple/30">
        <p className="text-text-primary text-sm font-semibold">🔥 21 Day Streak!</p>
        <p className="text-text-muted text-xs mt-1">Keep grinding. Consistency wins.</p>
      </div>
    </aside>
  );
}

export default Sidebar;