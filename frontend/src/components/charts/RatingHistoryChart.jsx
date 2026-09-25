import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = { LeetCode: "#F89F1B", Codeforces: "#3B82F6", CodeChef: "#FCD34D" }

// data: { Codeforces: [{ contest: "Jun 12", rating: 1456 }, ...], ... }
function RatingHistoryChart({ data = {} }) {
  const platforms = Object.keys(data).filter(p => data[p] && data[p].length > 0)
  const [active, setActive] = useState(null)

  if (platforms.length === 0) {
    return (
      <div className="h-45 flex items-center justify-center text-text-faint text-xs">
        No contest rating history yet.
      </div>
    )
  }

  // Fall back to the first available platform (handles async-loaded data too).
  const current = active && platforms.includes(active) ? active : platforms[0]
  const series = data[current]

  return (
    <div>
      {/* Platform tabs */}
      <div className="flex gap-2 mb-4">
        {platforms.map((p) => (
          <button
            key={p}
            onClick={() => setActive(p)}
            className={`px-3 py-1 rounded-pill text-xs font-medium transition-colors ${
              current === p ? "bg-accent-purple text-white" : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={series} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E2235" strokeOpacity={0.5} vertical={false} />
          <XAxis
            dataKey="contest"
            tick={{ fill: "#6B7280", fontSize: 11 }}
            axisLine={{ stroke: "#1E2235" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#6B7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            domain={["auto", "auto"]}
          />
          <Tooltip
            cursor={false}
            contentStyle={{ backgroundColor: "#12151F", border: "1px solid #1E2235", borderRadius: 8 }}
            labelStyle={{ color: "#9CA3AF" }}
          />
          <Line
            type="monotone"
            dataKey="rating"
            stroke={COLORS[current] || "#7C3AED"}
            strokeWidth={2}
            dot={{ fill: COLORS[current] || "#7C3AED", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RatingHistoryChart
