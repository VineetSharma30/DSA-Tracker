import { analyticsStats, topicRadar } from '../data/mockData'
import Card from '../components/ui/Card'
import {WeeklyVelocityChart, RatingHistoryChart, AnalyticsBarChart } from '../components/charts/Charts'

function Analytics() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-text-primary text-2xl font-bold">Analytics</h1>
        <p className="text-text-muted text-sm mt-0.5">
          Deep dive into your performance trends and patterns
        </p>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-4 gap-3">
        {analyticsStats.map((stat) => (
          <Card key={stat.label} className="p-4 relative overflow-hidden">
            {/* Left accent bar */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-card"
              style={{ backgroundColor: stat.color }}
            />
            <p className="text-text-muted text-xs ml-2">{stat.label}</p>
            <p className="text-text-primary text-2xl font-extrabold mt-1 ml-2">{stat.value}</p>
            <p className="text-xs mt-1 ml-2" style={{ color: stat.color }}>{stat.delta}</p>
          </Card>
        ))}
      </div>

      {/* Charts row 1 — big bar + radar */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 col-span-2">
          <h3 className="text-text-primary text-sm font-semibold mb-1">
            Problems Solved Over Time
          </h3>
          <p className="text-text-faint text-xs mb-3">Daily count • Last 30 days</p>
          <AnalyticsBarChart />
        </Card>

        <Card className="p-4">
          <h3 className="text-text-primary text-sm font-semibold mb-4">
            Topic Mastery Radar
          </h3>
          {/* Radar simulation — using strength bars as proxy since Recharts radar needs more setup */}
          <div className="flex flex-col gap-2 mt-2">
            {topicRadar.map((item) => (
              <div key={item.topic}>
                <div className="flex justify-between mb-0.5">
                  <span className="text-text-muted text-[11px]">{item.topic}</span>
                  <span className="text-text-secondary text-[11px] font-semibold">{item.score}%</span>
                </div>
                <div className="h-1.5 bg-border-subtle rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.score}%`,
                      backgroundColor: item.score >= 60 ? "#10B981" : item.score >= 40 ? "#F59E0B" : "#EF4444"
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts row 2 — rating history + velocity */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <h3 className="text-text-primary text-sm font-semibold mb-1">Rating History</h3>
          <RatingHistoryChart />
        </Card>

        <Card className="p-4">
          <h3 className="text-text-primary text-sm font-semibold mb-1">Weekly Velocity</h3>
          <p className="text-text-faint text-xs mb-3">Problems solved per week</p>
          <WeeklyVelocityChart />
        </Card>
      </div>
    </div>
  )
}

export default Analytics