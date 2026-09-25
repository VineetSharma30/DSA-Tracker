import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { weeklyVelocity } from '../../data/mockData'

const maxVal = Math.max(...weeklyVelocity.map(d => d.solved));

function WeeklyVelocityChart() {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={weeklyVelocity} margin={{ top: 5, right: 10, left: -30, bottom: 0 }} barSize={20}>
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
        />
        <Tooltip
          cursor={false}
          contentStyle={{ backgroundColor: "#12151F", border: "1px solid #1E2235", borderRadius: 8 }}
          labelStyle={{ color: "#9CA3AF" }}
        />
        <Bar dataKey="solved" radius={[4, 4, 0, 0]}>
          {weeklyVelocity.map((entry, index) => (
            <Cell
              key={index}
              fill={entry.solved === maxVal ? "#7C3AED" : "#1E3A5F"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default WeeklyVelocityChart
