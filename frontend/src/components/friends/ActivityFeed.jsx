import { useState } from 'react'
import { Send } from 'lucide-react'
import { Card } from '../ui/Ui'
import { Avatar } from './FriendAvatar'

const ActivityFeed = ({ items }) => {
  const [msg, setMsg] = useState("")
  const [sent, setSent] = useState(false)

  const handleSend = () => {
    if (!msg.trim()) return
    setSent(true)
    setMsg("")
    setTimeout(() => setSent(false), 2000)
  }

  return (
    <Card className="p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-text-primary text-sm font-semibold">Friend Activity</h3>
        <button className="text-accent-purple text-xs hover:underline">View All</button>
      </div>

      {/* Feed */}
      <div className="space-y-3 flex-1">
        {items.map(a => (
          <div key={a.id} className="flex items-start gap-2.5">
            <Avatar letter={a.avatar} color={a.color} size="w-7 h-7" />
            <div className="flex-1 min-w-0">
              <p className="text-text-secondary text-xs leading-snug">
                <span className="text-text-primary font-semibold">{a.name}</span>{" "}
                {a.action}{" "}
                <span className="text-text-primary font-medium">{a.detail}</span>
              </p>
              {a.tag && (
                <span
                  className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full mt-0.5 inline-block"
                  style={{ backgroundColor: `${a.tagColor}22`, color: a.tagColor }}
                >
                  {a.tag}
                </span>
              )}
              <p className="text-text-faint text-[10px] mt-0.5">{a.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Message box */}
      <div className="pt-3 border-t border-border-subtle flex items-center gap-2">
        <input
          value={msg}
          onChange={e => setMsg(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder={sent ? "Sent! 🎉" : "Share something with friends..."}
          className="flex-1 bg-bg-input rounded-lg px-3 py-2 text-xs text-text-primary placeholder:text-text-faint outline-none border border-border-subtle focus:border-accent-purple/50 transition-colors"
        />
        <button
          onClick={handleSend}
          className="text-accent-purple hover:opacity-70 transition-opacity p-1"
        >
          <Send size={14} />
        </button>
      </div>
    </Card>
  )
}

export default ActivityFeed
