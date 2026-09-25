import { PieChart, Pie, Cell, Label, Tooltip, ResponsiveContainer } from 'recharts'
import { topicDistribution } from '../../data/mockData'

function TopicDistributionChart() {
  const total = topicDistribution.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="flex items-center gap-4 h-full">
      {/* Donut */}
      <div className="shrink-0 hidden lg:block " style={{ width: 120, height: 120 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={topicDistribution} 
              dataKey="count" 
              nameKey="topic"
              innerRadius={40} 
              outerRadius={60}
              stroke="none"
            >
              {topicDistribution.map((entry) => (
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
        {topicDistribution.map((entry) => {
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
