import { MoreHorizontal } from 'lucide-react'
import { Avatar, StatusBadge, statusColors } from './FriendAvatar'

const FriendRow = ({ friend, selected, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
      selected ? "bg-accent-purple/10 border border-accent-purple/30" : "hover:bg-bg-input"
    }`}
  >
    {/* Avatar with online dot */}
    <div className="relative shrink-0">
      <Avatar letter={friend.avatar} color={friend.color} />
      <div
        className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-bg-card"
        style={{ backgroundColor: statusColors[friend.status] }}
      />
    </div>

    {/* Name + handle + activity */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className="text-text-primary text-sm font-semibold truncate">{friend.name}</p>
        <span className="text-text-faint text-[10px] shrink-0">🔥 {friend.streak}d</span>
      </div>
      <p className="text-text-faint text-[10px]">{friend.handle}</p>
      <p className="text-accent-purple text-[10px] mt-0.5 truncate">{friend.activity}</p>
    </div>

    {/* Stats + status badge */}
    <div className="text-right shrink-0 space-y-0.5">
      <p className="text-text-secondary text-xs font-semibold">{friend.solved} solved</p>
      <p className="text-text-faint text-[10px]">{friend.acc}% acc</p>
      <StatusBadge status={friend.status} statusLabel={friend.statusLabel} />
    </div>

    <button
      className="text-text-faint hover:text-text-secondary p-1 shrink-0"
      onClick={e => e.stopPropagation()}
    >
      <MoreHorizontal size={14} />
    </button>
  </div>
)

export default FriendRow
