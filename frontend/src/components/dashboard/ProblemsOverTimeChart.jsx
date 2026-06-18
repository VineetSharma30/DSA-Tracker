import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { solvedOverTime } from '../../data/mockData'

function ProblemsOverTimeChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={solvedOverTime} margin={{ top: 30, right: 10, left: -30, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E2235" strokeOpacity={0.5} vertical={false} />
        <XAxis 
          dataKey="date" 
          tick={{ fill: "#6B7280", fontSize: 11 }} 
          axisLine={{ stroke: "#1E2235" }}
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
        <Line 
          type="monotone" 
          dataKey="solved" 
          stroke="#7C3AED" 
          strokeWidth={2}
          dot={{ fill: "#7C3AED", r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default ProblemsOverTimeChart;