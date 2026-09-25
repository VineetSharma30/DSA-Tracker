import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card } from '../ui/Ui'
import { ArrowUpRight } from 'lucide-react'

// ── Helpers ────────────────────────────────────────────────────────

const weekStart = dateStr => {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + (d.getDay() === 0 ? -6 : 1 - d.getDay()))
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export const buildTimeline = (dailyCounts, baseScore) => {
  const buckets = {}
  ;(dailyCounts || []).forEach(d => {
    const key = weekStart(d.date)
    buckets[key] = (buckets[key] || 0) + (d.count || 0)
  })
  const keys = Object.keys(buckets).slice(-8)
  if (!keys.length) return [{ week: "Now", score: baseScore }]

  const scores = []
  let score = baseScore
  for (let i = keys.length - 1; i >= 0; i--) {
    scores.unshift({ week: keys[i], score: Math.max(Math.round(score), 0) })
    score -= Math.round(buckets[keys[i]] * 0.4 + 0.5)
  }
  return scores
}

export const calcDsaScore = s => Math.min(Math.round(
  Math.min((s.total_solved || 0) / 300, 1)      * 40 +
  ((s.acceptance_rate || 0) / 100)               * 30 +
  (Math.min(s.current_streak || 0, 30) / 30)    * 20 +
  (s.hard_ratio || 0)                            * 10
), 100)

export const scoreLabel = n =>
  n >= 80 ? "Excellent" : n >= 60 ? "Good" : n >= 40 ? "Fair" : "Keep going!"

// ── Chart styles ───────────────────────────────────────────────────

const gridStroke   = "#1E2235"
const tickStyle    = { fill: "#6B7280", fontSize: 11 }
const tooltipStyle = { backgroundColor: "#12151F", border: "1px solid #1E2235", borderRadius: 8 }

// ── Component ──────────────────────────────────────────────────────

const TimelineChart = ({ summary, dailyCounts }) => {
  const hardRatio = (summary.hard_solved || 0) / Math.max(summary.total_solved || 0, 1)
  const dsaScore  = calcDsaScore({ ...summary, hard_ratio: hardRatio })
  const label     = scoreLabel(dsaScore)
  const timeline  = buildTimeline(dailyCounts, dsaScore)

  return (
    <Card className="p-4">
      <h3 className="text-text-primary text-sm font-semibold">DSA Score Timeline</h3>
      <p className="text-text-faint text-[11px] mt-0.5">Overall DSA Score</p>

      <div className="grid grid-cols-[1fr_auto] gap-4 mt-3 items-center">
        <div className="h-40 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeline} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="week" tick={tickStyle} axisLine={false} tickLine={false} />
              <YAxis tick={tickStyle} axisLine={false} tickLine={false} domain={['auto', 100]} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#9CA3AF" }} itemStyle={{ color: "#A78BFA" }} />
              <Line type="monotone" dataKey="score" stroke="#7C3AED" strokeWidth={2.5}
                dot={{ fill: "#7C3AED", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#7C3AED" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="text-right pr-2">
          <p className="text-5xl font-extrabold text-text-primary leading-none">{dsaScore}</p>
          <p className="text-text-faint text-sm">/100</p>
          <p className="text-status-easy text-sm font-semibold mt-1">{label}</p>
          <p className="text-text-faint text-[10px] mt-1 flex items-center gap-0.5 justify-end">
            <ArrowUpRight size={10} className="text-status-easy" /> vs last month
          </p>
        </div>
      </div>
    </Card>
  )
}

export default TimelineChart