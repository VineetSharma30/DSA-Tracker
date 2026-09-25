import { PieChart, Pie, Cell, Label, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ["#7C3AED","#3B82F6","#10B981","#F59E0B","#EF4444","#6B7280"]

function TopicDistributionChart({ data }) {
  if (!data || !data.length) return (
    <p className="text-text-faint text-xs text-center py-8">
      Add problems to see topic distribution.
    </p>
  )

  const chartData = data.map((d, i) => ({ topic: d.topic, count: d.count, fill: COLORS[i % 6] }))
  const total = chartData.reduce((sum, d) => sum + d.count, 0)

  return (
    <div className="flex items-center gap-4 h-full">
      {/* Donut */}
      <div className="shrink-0 hidden lg:block " style={{ width: 120, height: 120 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={chartData} 
              dataKey="count" 
              nameKey="topic"
              innerRadius={40} 
              outerRadius={60}
              stroke="none"
            >
              {chartData.map((entry) => (
                <Cell key={entry.topic} fill={entry.fill} />
              ))}
              <Label value={total} position="center" fill="#FFFFFF" fontSize={18} fontWeight="bold" />
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: "#12151F", border: "1px solid #1E2235", borderRadius: 8 }}
              itemStyle={{ color: "#FFFFFF" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom legend */}
      <div className="flex flex-col gap-2 flex-1 justify-center">
        {chartData.map((entry) => {
          const pct = ((entry.count / total) * 100).toFixed(1)
          return (
            <div key={entry.topic} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.fill }} />
                <span className="text-text-muted text-xs font-medium">{entry.topic}</span>
              </div>
              <span className="text-text-secondary text-xs font-semibold">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TopicDistributionChart
