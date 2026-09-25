import { useState, useEffect } from 'react'
import api from '../../services/api'

const PLATFORM_META = {
  LeetCode:   { abbr: "LC", color: "#F89F1B" },
  Codeforces: { abbr: "CF", color: "#3B82F6" },
  CodeChef:   { abbr: "CC", color: "#FCD34D" },
}

const fmtDate = unix =>
  new Date(unix * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" })

const fmtTime = unix =>
  new Date(unix * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })

const startsIn = unix => {
  const mins = Math.floor((unix * 1000 - Date.now()) / 60000)
  if (mins <= 0) return "Live now"
  const days  = Math.floor(mins / 1440)
  const hours = Math.floor((mins % 1440) / 60)
  if (days > 0)  return `In ${days}d ${hours}h`
  if (hours > 0) return `In ${hours}h ${mins % 60}m`
  return `In ${mins}m`
}

const UpcomingContests = () => {
  const [contests, setContests] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/platforms/contests/upcoming')
        setContests(res.data.contests || [])
      } catch {
        setContests([])
      }
    }
    load()
  }, [])

  if (!contests.length) return (
    <p className="text-text-faint text-xs text-center py-4">
      No upcoming contests. Add platform handles in Settings.
    </p>
  )

  return (
    <div className="flex flex-col gap-3">
      {contests.slice(0, 4).map(c => {
        const meta = PLATFORM_META[c.platform] || { abbr: "?", color: "#6B7280" }
        return (
          <div key={c.id || c.name} className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-[11px] font-bold"
              style={{ backgroundColor: `${meta.color}25`, color: meta.color }}
            >
              {meta.abbr}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-text-primary text-xs font-semibold truncate">{c.name}</p>
              <p className="text-text-muted text-[10px] mt-0.5">
                {c.start_time ? `${fmtDate(c.start_time)} · ${fmtTime(c.start_time)}` : c.date}
              </p>
              <p className="text-status-easy text-[10px] mt-0.5 font-medium">
                {c.start_time ? startsIn(c.start_time) : c.startsIn}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default UpcomingContests
