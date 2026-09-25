import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card } from '../ui/Ui'

const platformColors = { LeetCode: "#F89F1B", Codeforces: "#3B82F6", CodeChef: "#FCD34D" }
const gridStroke     = "#1E2235"
const tickStyle      = { fill: "#6B7280", fontSize: 11 }
const tooltipStyle   = { backgroundColor: "#12151F", border: "1px solid #1E2235", borderRadius: 8 }

// ratingData: { LeetCode: [{contest, rating}], Codeforces: [...] }
// platformStats: [{platform, rating, rank, ...}] from /dashboard/stats
const RatingHistoryChart2 = ({ ratingData, platformStats = [] }) => {
  const platforms      = Object.keys(ratingData)
  const [active, setActive] = useState(platforms[0] || null)

  const activePlatform = active && platforms.includes(active) ? active : platforms[0]
  const series         = activePlatform ? ratingData[activePlatform] : []
  const latestRating   = series?.at(-1)?.rating ?? "—"
  const highestRating  = series?.length ? Math.max(...series.map(r => r.rating)) : "—"

  // Pull rank info from real platform_stats
  const pStat = platformStats.find(p => p.platform === activePlatform)
  const rank   = pStat?.rank        || "—"
  const gRank  = pStat?.global_rank ? `#${pStat.global_rank.toLocaleString()}` : "—"

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-text-primary text-sm font-semibold">Rating History</h3>
        <button className="text-accent-purple text-xs hover:underline">View Details</button>
      </div>

      {/* Platform tabs — only show tabs that have data */}
      <div className="flex gap-1 mb-3">
        {["LeetCode", "Codeforces", "CodeChef"].map(p => (
          <button
            key={p}
            onClick={() => setActive(p)}
            disabled={!ratingData[p]?.length}
            className={`px-3 py-1 rounded-pill text-xs font-medium transition-colors disabled:opacity-30 ${
              activePlatform === p
                ? "bg-accent-purple text-white"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {series && series.length > 0 ? (
        <>
          <div className="h-36 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="contest" tick={tickStyle} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={tickStyle} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#9CA3AF" }} />
                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke={platformColors[activePlatform] || "#7C3AED"}
                  strokeWidth={2.5}
                  dot={{ fill: platformColors[activePlatform] || "#7C3AED", r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-border-subtle">
            {[
              { label: "Current",    value: latestRating },
              { label: "Highest",    value: highestRating },
              { label: "Rank",       value: rank,  color: "#F59E0B" },
              { label: "Global Rank",value: gRank, color: "#7C3AED" },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-text-faint text-[10px]">{stat.label}</p>
                <p className="text-text-primary text-sm font-extrabold mt-0.5" style={stat.color ? { color: stat.color } : {}}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="h-40 flex items-center justify-center text-text-faint text-xs">
          No rating history yet. Add handles in Settings.
        </div>
      )}
    </Card>
  )
}

export default RatingHistoryChart2