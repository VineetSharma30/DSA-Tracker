import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

function DifficultyDistributionChart({ easy = 0, medium = 0, hard = 0 }) {
  const total = easy + medium + hard

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-full text-text-faint text-xs py-8">
        No problems yet.
      </div>
    )
  }

  const data = [
    { level: "Easy",   count: easy,   percent: Math.round((easy / total) * 100),   fill: "#10B981" },
    { level: "Medium", count: medium, percent: Math.round((medium / total) * 100), fill: "#F59E0B" },
    { level: "Hard",   count: hard,   percent: Math.round((hard / total) * 100),   fill: "#EF4444" },
  ]

  return (
    <div className="flex items-center gap-4 h-full ">
      {/* Custom legend */}
      <div className="flex flex-col gap-3 flex-1 justify-center mx-8">
        {data.map((entry) => (
          <div key={entry.level} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.fill }} />
            <span className="text-text-muted text-xs font-medium flex-1">{entry.level}</span>
            <span className="text-text-primary text-xs font-bold ">{entry.count} ({entry.percent}%)</span>
          </div>
        ))}
      </div>

      {/* Donut */}
      <div className="shrink-0 mx-5 hidden lg:block " style={{ width: 110, height: 110 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="level"
              innerRadius={32}
              outerRadius={52}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.level} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: "#12151F", border: "1px solid #1E2235", borderRadius: 8 }}
              itemStyle={{ color: "#FFFFFF" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default DifficultyDistributionChart
