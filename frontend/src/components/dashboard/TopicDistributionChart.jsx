import { PieChart, Pie, Cell, Label, ResponsiveContainer } from 'recharts'
import { topicDistribution } from '../../data/mockData'

function TopicDistributionChart() {
  const total = topicDistribution.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="flex items-center gap-4 h-full">
      {/* Donut */}
      <div className="shrink-0" style={{ width: 155, height: 155 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={topicDistribution} dataKey="count" nameKey="topic"
              innerRadius={50} outerRadius={72} paddingAngle={0}>
              {topicDistribution.map((entry) => (
                <Cell key={entry.topic} fill={entry.fill} />
              ))}
              <Label value={total} position="center" fill="#FFFFFF" fontSize={22} fontWeight="bold" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom legend */}
      <div className="flex flex-col gap-2.5 flex-1">
        {topicDistribution.map((entry) => {
          const pct = ((entry.count / total) * 100).toFixed(1)
          return (
            <div key={entry.topic} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.fill }} />
                <span className="text-text-muted text-xs">{entry.topic}</span>
              </div>
              <span className="text-text-secondary text-xs">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TopicDistributionChart
