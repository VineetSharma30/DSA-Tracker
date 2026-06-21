import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ratingHistory } from '../../data/mockData'

const PLATFORMS = ["LeetCode", "Codeforces", "CodeChef"];
const COLORS = { LeetCode: "#F89F1B", Codeforces: "#3B82F6", CodeChef: "#FCD34D" };

function RatingHistoryChart() {
  const [activePlatform, setActivePlatform] = useState("LeetCode");
  const data = ratingHistory[activePlatform];

  return (
    <div>
      {/* Platform tabs */}
      <div className="flex gap-2 mb-4">
        {PLATFORMS.map((p) => (
          <button
            key={p}
            onClick={() => setActivePlatform(p)}
            className={`px-3 py-1 rounded-pill text-xs font-medium transition-colors ${
              activePlatform === p
                ? "bg-accent-purple text-white"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
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
            stroke={COLORS[activePlatform]}
            strokeWidth={2}
            dot={{ fill: COLORS[activePlatform], r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RatingHistoryChart