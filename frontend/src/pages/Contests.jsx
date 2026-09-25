import { useState, useEffect, useMemo } from 'react'
import { Trophy, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react'
import { Card, Button, LoadingSpinner } from '../components/ui/Ui'
import api from '../services/api'

const platformMeta = {
  LeetCode:   { abbr: "LC", color: "#F89F1B" },
  Codeforces: { abbr: "CF", color: "#3B82F6" },
  CodeChef:   { abbr: "CC", color: "#FCD34D" },
  HackerRank: { abbr: "HR", color: "#00C853" },
}

const fmtDate = (unix) =>
  new Date(unix * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

const fmtTime = (unix) =>
  new Date(unix * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })

const startsIn = (unix) => {
  const mins = Math.floor((unix * 1000 - Date.now()) / 60000)
  if (mins <= 0) return "Live now"
  const days  = Math.floor(mins / 1440)
  const hours = Math.floor((mins % 1440) / 60)
  if (days > 0)  return `Starts in ${days}d ${hours}h`
  if (hours > 0) return `Starts in ${hours}h ${mins % 60}m`
  return `Starts in ${mins}m`
}

const contestType = (platform, name = "") => {
  if (platform === "LeetCode") return /biweekly/i.test(name) ? "Biweekly" : "Weekly"
  const match = name.match(/Div\.?\s*\d/i)
  if (match) return match[0].replace(/\s+/, ". ")
  if (/educational/i.test(name)) return "Edu"
  return "Round"
}

const ContestCard = ({ contest }) => {
  const meta = platformMeta[contest.platform] || { abbr: "?", color: "#6B7280" }
  return (
    <Card className="p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: meta.color }} />
      <div className="flex items-start gap-3 mt-1">
        <div
          className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold"
          style={{ backgroundColor: `${meta.color}30`, color: meta.color }}
        >
          {meta.abbr}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded"
              style={{ backgroundColor: `${meta.color}20`, color: meta.color }}
            >
              {contestType(contest.platform, contest.name)}
            </span>
          </div>
          <p className="text-text-primary text-sm font-semibold truncate">{contest.name}</p>
          <p className="text-text-muted text-[10px] mt-0.5">{fmtDate(contest.start_time)} · {fmtTime(contest.start_time)}</p>
          <p className="text-status-easy text-[10px] mt-1 font-medium">{startsIn(contest.start_time)}</p>
        </div>

        <a href={contest.url} target="_blank" rel="noreferrer" className="shrink-0">
          <Button variant="secondary" size="sm" className="text-[11px] flex items-center gap-1">
            View <ExternalLink size={11} />
          </Button>
        </a>
      </div>
    </Card>
  )
}

const Contests = () => {
  const [filter, setFilter]   = useState("All")
  const [upcoming, setUpcoming] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [up, hist] = await Promise.all([
          api.get('/platforms/contests/upcoming'),
          api.get('/platforms/contests/history'),
        ])
        setUpcoming(up.data.contests || [])
        setHistory(hist.data.history || [])
      } catch (err) {
        console.error("Failed to load contests:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filters  = useMemo(() => ["All", ...new Set(upcoming.map(c => c.platform))], [upcoming])
  const filtered = upcoming.filter(c => filter === "All" || c.platform === filter)

  if (loading) return <LoadingSpinner message="Loading contests..." />

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-text-primary text-2xl font-bold">Contests</h1>
        <p className="text-text-muted text-sm mt-0.5">Upcoming contests and your participation history</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {filters.map(p => (
          <Button key={p} variant={filter === p ? "primary" : "secondary"} size="sm" onClick={() => setFilter(p)}>
            {p}
          </Button>
        ))}
      </div>

      <div>
        <h2 className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-3">
          Upcoming — {filtered.length} contest{filtered.length !== 1 ? "s" : ""}
        </h2>
        {filtered.length === 0 ? (
          <Card className="p-8 text-center text-text-muted text-sm">No upcoming contests found.</Card>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(c => <ContestCard key={c.id} contest={c} />)}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-3">Recent Participation</h2>
        {history.length === 0 ? (
          <Card className="p-8 text-center text-text-muted text-sm">
            No contest history yet. Add a Codeforces handle in Settings to see your rated contests.
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="grid grid-cols-[1fr_130px_100px_80px] px-4 py-2.5 border-b border-border-subtle bg-bg-base">
              {["Contest", "Platform", "Rank", "Rating Δ"].map(h => (
                <span key={h} className="text-text-faint text-[11px] font-medium uppercase tracking-wide">{h}</span>
              ))}
            </div>

            {history.map((c, i) => {
              const up   = c.delta >= 0
              const meta = platformMeta[c.platform] || { color: "#6B7280" }
              return (
                <div key={i} className="grid grid-cols-[1fr_130px_100px_80px] px-4 py-3 items-center border-b border-border-subtle last:border-0 hover:bg-bg-input transition-colors">
                  <div>
                    <p className="text-text-primary text-xs font-medium">{c.name}</p>
                    <p className="text-text-faint text-[10px] mt-0.5">{fmtDate(c.date)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
                    <span className="text-text-muted text-xs">{c.platform}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Trophy size={11} className="text-text-faint" />
                    <span className="text-text-secondary text-xs font-medium">#{c.rank}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {up ? <TrendingUp size={12} className="text-status-easy" /> : <TrendingDown size={12} className="text-status-hard" />}
                    <span className={`text-xs font-semibold ${up ? "text-status-easy" : "text-status-hard"}`}>
                      {up ? "+" : ""}{c.delta}
                    </span>
                  </div>
                </div>
              )
            })}
          </Card>
        )}
      </div>
    </div>
  )
}

export default Contests
