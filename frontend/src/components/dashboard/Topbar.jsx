import { Search, Bell, Calendar } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function Topbar() {
  const { user } = useAuth();

  return (
    <header className="min-h-16 bg-bg-sidebar border-b border-border-subtle flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center gap-2 bg-bg-card border border-border-DEFAULT rounded-pill px-3.5 py-2 w-80">
        <Search size={15} className="text-text-faint" />
        <input
          type="text"
          placeholder="Search problems, topics, contests..."
          className="bg-transparent text-sm text-text-secondary placeholder:text-text-faint outline-none w-full"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Date pill — shows today's real date */}
        <div className=" max-h-14 flex items-center gap-2 bg-bg-input border border-border-DEFAULT rounded-pill px-3 py-2 text-xs text-text-secondary">
          <Calendar size={14} />
          {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
        </div>

        {/* Notification bell */}
        <div className="relative w-9 h-9 bg-bg-input rounded-lg flex items-center justify-center">
          <Bell size={16} className="text-text-secondary" />
        </div>

        {/* User */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-accent-purple flex items-center justify-center text-white font-bold text-sm">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-text-primary text-sm font-semibold">{user?.username}</p>
            <p className="text-text-muted text-xs">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;