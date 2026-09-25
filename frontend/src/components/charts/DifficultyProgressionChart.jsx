import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card } from '../ui/Ui'

const gridStroke   = "#1E2235"
const tickStyle    = { fill: "#6B7280", fontSize: 11 }
const tooltipStyle = { backgroundColor: "#12151F", border: "1px solid #1E2235", borderRadius: 8 }

const LEGEND = [["Easy", "#10B981"], ["Medium", "#F59E0B"], ["Hard", "#EF4444"]]

// Builds 6 monthly buckets from real daily_counts
const buildProgression = (dailyCounts = [], easySolved = 0, medSolved = 0, hardSolved = 0) => {
  // Group activity by month
  const buckets = {}
  ;(dailyCounts || []).forEach(d => {
    if (!d.count) return
    // The backend sends dates as "Jun 26" format — parse with current year
    const parsed = new Date(`${d.date} ${new Date().getFullYear()}`)
    const key = isNaN(parsed)
      ? d.date.slice(0, 6)
      : parsed.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
    buckets[key] = (buckets[key] || 0) + d.count
  })

  const keys = Object.keys(buckets).slice(-6)
  if (!keys.length) {
    // No activity data — build static from totals
    return [
      { month: "Now", Easy: easySolved, Medium: medSolved, Hard: hardSolved },
    ]
  }

  const total = Object.values(buckets).reduce((a, b) => a + b, 0) || 1
  const eRatio = easySolved / (easySolved + medSolved + hardSolved || 1)
  const mRatio = medSolved  / (easySolved + medSolved + hardSolved || 1)
  const hRatio = hardSolved / (easySolved + medSolved + hardSolved || 1)

  return keys.map(k => ({
    month:  k,
    Easy:   Math.round(buckets[k] * eRatio),
    Medium: Math.round(buckets[k] * mRatio),
    Hard:   Math.round(buckets[k] * hRatio),
  }))
}

const DifficultyProgressionChart = ({ dailyCounts, easySolved, medSolved, hardSolved }) => {
  const data = buildProgression(dailyCounts, easySolved, medSolved, hardSolved)

  return (
    <Card className="p-4">
      <h3 className="text-text-primary text-sm font-semibold">Difficulty Progression</h3>
      <p className="text-text-faint text-[11px] mt-0.5">How your problem solving difficulty has evolved</p>

      <div className="h-44 min-w-0 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }} barSize={18}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
            <XAxis dataKey="month" tick={tickStyle} axisLine={false} tickLine={false} />
            <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="Easy"   stackId="a" fill="#10B981" />
            <Bar dataKey="Medium" stackId="a" fill="#F59E0B" />
            <Bar dataKey="Hard"   stackId="a" fill="#EF4444" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-3 mt-2">
        {LEGEND.map(([label, color]) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: color }} />
            <span className="text-text-faint text-[10px]">{label}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default DifficultyProgressionChart
