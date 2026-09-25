import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function ProblemsOverTimeChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="h-[155px] flex items-center justify-center text-text-faint text-xs">
        Not enough activity yet — sync or add problems.
      </div>
    )
  }
  return (
    <ResponsiveContainer width="100%" height={155} >
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -30, bottom: 0 }}>
        <defs>
          <linearGradient id="colorSolved" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
          </linearGradient>
        </defs>
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
        <Area 
          type="monotone" 
          dataKey="solved" 
          stroke="#7C3AED" 
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorSolved)"
          dot={{ fill: "#7C3AED", r: 4 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default ProblemsOverTimeChart;