import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { difficultyDistribution } from '../../data/mockData'

function DifficultyDistributionChart() {
  return (
    <div className="flex items-center gap-4 h-full ">
      {/* Custom legend */}
      <div className="flex flex-col gap-3 flex-1 justify-center mx-8">
        {difficultyDistribution.map((entry) => (
          <div key={entry.level} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.fill }} />
            <span className="text-text-muted text-xs font-medium flex-1">{entry.level}</span>
            <span className="text-text-primary text-xs font-bold ">{entry.percent}</span>
          </div>
        ))}
      </div>

      {/* Donut */}
      <div className="shrink-0 mx-5 hidden lg:block " style={{ width: 110, height: 110 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={difficultyDistribution} 
              dataKey="percent" 
              nameKey="level"
              innerRadius={32} 
              outerRadius={52}
              stroke="none"
            >
              {difficultyDistribution.map((entry) => (
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
