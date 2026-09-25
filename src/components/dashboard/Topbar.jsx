import { Search, Bell, Calendar, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
        {/* Date pill */}
        <div className=" max-h-14 flex items-center gap-2 bg-bg-input border border-border-DEFAULT rounded-pill px-3 py-2 text-xs text-text-secondary">
          <Calendar size={14} />
          May 20 - May 27, 2024
        </div>

        {/* Notification bell */}
        <div className="relative w-9 h-9 bg-bg-input rounded-lg flex items-center justify-center cursor-pointer hover:bg-bg-card transition-colors">
          <Bell size={16} className="text-text-secondary" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-status-hard rounded-full text-[9px] text-white flex items-center justify-center font-bold">
            3
          </span>
        </div>

        {/* User */}
        <div
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => navigate('/profile')}
          title="View Profile"
        >
          <div className="w-9 h-9 rounded-full bg-accent-purple flex items-center justify-center text-white font-bold text-sm">
            {user?.avatarInitial || 'V'}
          </div>
          <div>
            <p className="text-text-primary text-sm font-semibold">{user?.name || 'Vineet'}</p>
            <p className="text-text-muted text-xs">{user?.role || 'B.Tech CSE'}</p>
          </div>
        </div>

        {/* Sign Out button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-DEFAULT bg-bg-input hover:bg-status-hard/10 hover:border-status-hard/50 hover:text-status-hard text-text-muted text-xs transition-colors cursor-pointer"
          title="Sign Out"
        >
          <LogOut size={13} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Topbar;