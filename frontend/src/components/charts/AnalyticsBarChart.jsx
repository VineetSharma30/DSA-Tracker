import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

// data: [{ date: "Jun 12", count: 4 }, ...] — daily solved counts
function AnalyticsBarChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="h-50 flex items-center justify-center text-text-faint text-xs">
        No activity in this window yet.
      </div>
    )
  }

  const maxSolved = Math.max(...data.map(d => d.count), 1)

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -30, bottom: 0 }} barSize={14}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E2235" strokeOpacity={0.5} vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: "#6B7280", fontSize: 10 }}
          axisLine={{ stroke: "#1E2235" }}
          tickLine={false}
          interval={4}
        />
        <YAxis
          tick={{ fill: "#6B7280", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          cursor={false}
          contentStyle={{ backgroundColor: "#12151F", border: "1px solid #1E2235", borderRadius: 8 }}
          labelStyle={{ color: "#9CA3AF" }}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={entry.count === maxSolved ? "#7C3AED" : "#3B82F6"}
              fillOpacity={0.7 + (entry.count / maxSolved) * 0.3}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default AnalyticsBarChart
