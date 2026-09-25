import { Trophy } from 'lucide-react'
import { Card, Button } from '../ui/Ui'
import { Avatar } from './FriendAvatar'

const rankIcon = r => r === 1 ? "🥇" : r === 2 ? "🥈" : r === 3 ? "🥉" : r

export const JamsPanel = ({ jams }) => (
  <Card className="p-4">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-text-primary text-sm font-semibold">Upcoming Jams</h3>
      <button className="text-accent-purple text-xs hover:underline">View All</button>
    </div>

    <div className="space-y-3">
      {jams.map(jam => (
        <div key={jam.id} className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${jam.color}22` }}
          >
            <Trophy size={14} style={{ color: jam.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-text-primary text-xs font-semibold truncate">{jam.title}</p>
            <p className="text-text-faint text-[10px] truncate">{jam.members}</p>
            <p className="text-text-faint text-[10px]">📅 {jam.time}</p>
          </div>
          <Button variant="primary" size="sm" className="text-[10px] px-2.5 py-1 shrink-0">
            Join
          </Button>
        </div>
      ))}
    </div>

    <button className="mt-4 text-accent-purple text-xs hover:underline w-full text-center">
      + Create Jam Session
    </button>
  </Card>
)

export const Leaderboard = ({ entries, me }) => (
  <Card className="p-4">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-text-primary text-sm font-semibold">Weekly Leaderboard</h3>
      <span className="text-text-faint text-[10px]">This Week</span>
    </div>

    <div className="space-y-2">
      {entries.map(p => (
        <div key={p.rank} className="flex items-center gap-2">
          <span className="text-sm w-5 text-center shrink-0">{rankIcon(p.rank)}</span>
          <Avatar letter={p.avatar} color={p.color} size="w-6 h-6" />
          <p className="text-text-secondary text-xs flex-1 truncate">{p.name}</p>
          <p className="text-sm font-bold shrink-0" style={{ color: p.color }}>{p.score}</p>
        </div>
      ))}

      {/* Current user row */}
      {me && (
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border-subtle">
          <span className="text-xs text-text-faint w-5 text-center shrink-0">You</span>
          <Avatar letter={me.avatar} color={me.color} size="w-6 h-6" />
          <p className="text-text-secondary text-xs flex-1 truncate">{me.name}</p>
          <p className="text-sm font-bold text-accent-purple shrink-0">{me.score}</p>
        </div>
      )}
    </div>
  </Card>
)
