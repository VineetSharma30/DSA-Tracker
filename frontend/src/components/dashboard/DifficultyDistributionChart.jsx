import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { difficultyDistribution } from '../../data/mockData'

function DifficultyDistributionChart() {
  return (
    <div className="flex items-center gap-4 h-full">
      {/* Custom legend */}
      <div className="flex flex-col gap-5 flex-1">
        {difficultyDistribution.map((entry) => (
          <div key={entry.level} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.fill }} />
            <span className="text-text-muted text-xs flex-1">{entry.level}</span>
            <span className="text-text-primary text-sm font-bold">{entry.percent}%</span>
          </div>
        ))}
      </div>

      {/* Donut */}
      <div className="shrink-0" style={{ width: 140, height: 140 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={difficultyDistribution} dataKey="percent" nameKey="level"
              innerRadius={42} outerRadius={65} paddingAngle={0}>
              {difficultyDistribution.map((entry) => (
                <Cell key={entry.level} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default DifficultyDistributionChart
