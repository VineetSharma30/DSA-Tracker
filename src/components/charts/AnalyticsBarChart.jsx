import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { solvedOverTime } from '../../data/mockData'

// Extend data with more points for a richer 30-day view
const barData = [
  { date: "Jun 1",  solved: 4  }, { date: "Jun 3",  solved: 7  },
  { date: "Jun 5",  solved: 3  }, { date: "Jun 7",  solved: 8  },
  { date: "Jun 9",  solved: 12 }, { date: "Jun 11", solved: 6  },
  { date: "Jun 13", solved: 9  }, { date: "Jun 15", solved: 5  },
  { date: "Jun 17", solved: 11 }, { date: "Jun 19", solved: 14 },
  { date: "Jun 21", solved: 8  }, { date: "Jun 23", solved: 10 },
  { date: "Jun 25", solved: 6  }, { date: "Jun 27", solved: 13 },
  { date: "Jun 29", solved: 9  }, { date: "Jul 1",  solved: 7  },
  { date: "Jul 3",  solved: 11 }, { date: "Jul 5",  solved: 15 },
  { date: "Jul 7",  solved: 8  }, { date: "Jul 9",  solved: 12 },
  { date: "Jul 11", solved: 10 }, { date: "Jul 13", solved: 16 },
  { date: "Jul 15", solved: 9  }, { date: "Jul 17", solved: 13 },
  { date: "Jul 19", solved: 7  }, { date: "Jul 21", solved: 14 },
  { date: "Jul 23", solved: 11 }, { date: "Jul 25", solved: 18 },
  { date: "Jul 27", solved: 12 }, { date: "Jul 29", solved: 15 },
];

const maxSolved = Math.max(...barData.map(d => d.solved));

function AnalyticsBarChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={barData} margin={{ top: 5, right: 10, left: -30, bottom: 0 }} barSize={14}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E2235" strokeOpacity={0.5} vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: "#6B7280", fontSize: 10 }}
          axisLine={{ stroke: "#1E2235" }}
          tickLine={false}
          interval={4}
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
          {barData.map((entry, index) => (
            <Cell
              key={index}
              fill={entry.solved === maxSolved ? "#7C3AED" : "#3B82F6"}
              fillOpacity={0.7 + (entry.solved / maxSolved) * 0.3}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default AnalyticsBarChart