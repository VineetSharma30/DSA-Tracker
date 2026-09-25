import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

// data: [{ week: "Jun 02", solved: 12 }, ...]
function WeeklyVelocityChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="h-45 flex items-center justify-center text-text-faint text-xs">
        No weekly data yet.
      </div>
    )
  }

  const maxVal = Math.max(...data.map(d => d.solved), 1)

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -30, bottom: 0 }} barSize={20}>
        <XAxis
          dataKey="week"
          tick={{ fill: "#6B7280", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
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
        <Bar dataKey="solved" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.solved === maxVal ? "#7C3AED" : "#1E3A5F"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default WeeklyVelocityChart
