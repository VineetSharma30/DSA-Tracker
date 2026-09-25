import { useState, useEffect } from 'react'
import { Card, LoadingSpinner } from '../components/ui/Ui'
import { WeeklyVelocityChart, RatingHistoryChart, AnalyticsBarChart } from '../components/charts/Charts'
import api from '../services/api'

const Analytics = () => {
  const [data, setData]           = useState(null)
  const [ratingData, setRatingData] = useState({})
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/dashboard/analytics')
        setData(res.data)
        try {
          const cf = await api.get('/platforms/codeforces/rating-history')
          const history = (cf.data.history || []).map(c => ({
            contest: new Date(c.date * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            rating:  c.new_rating,
          }))
          if (history.length) setRatingData({ Codeforces: history })
        } catch {
          // no CF handle — chart shows its empty state
        }
      } catch (err) {
        console.error("Failed to load analytics:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading || !data) return <LoadingSpinner message="Loading analytics..." />

  const s           = data.summary
  const consistency = s.active_window ? Math.round((s.active_days / s.active_window) * 100) : 0

  const cards = [
    { label: "Total Solved",    value: s.total_solved,                       delta: "across all platforms",            color: "#7C3AED" },
    { label: "Acceptance Rate", value: `${s.acceptance_rate}%`,              delta: "of tracked problems",             color: "#10B981" },
    { label: "Active Days",     value: `${s.active_days}/${s.active_window}`, delta: `${consistency}% consistency`,   color: "#3B82F6" },
    { label: "Best Streak",     value: `${s.best_streak} Days`,              delta: `Current: ${s.current_streak} days`, color: "#F59E0B" },
  ]

  const barColor = (score) => score >= 60 ? "#10B981" : score >= 40 ? "#F59E0B" : "#EF4444"

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-text-primary text-2xl font-bold">Analytics</h1>
        <p className="text-text-muted text-sm mt-0.5">Deep dive into your performance trends and patterns</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {cards.map(c => (
          <Card key={c.label} className="p-4 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-card" style={{ backgroundColor: c.color }} />
            <p className="text-text-muted text-xs ml-2">{c.label}</p>
            <p className="text-text-primary text-2xl font-extrabold mt-1 ml-2">{c.value}</p>
            <p className="text-xs mt-1 ml-2" style={{ color: c.color }}>{c.delta}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 col-span-2">
          <h3 className="text-text-primary text-sm font-semibold mb-1">Problems Solved Over Time</h3>
          <p className="text-text-faint text-xs mb-3">Daily count • Last 30 days</p>
          <AnalyticsBarChart data={data.daily_counts} />
        </Card>

        <Card className="p-4">
          <h3 className="text-text-primary text-sm font-semibold mb-4">Topic Mastery</h3>
          {data.topic_radar.length === 0 ? (
            <p className="text-text-faint text-xs">No topic data yet.</p>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              {data.topic_radar.map(item => (
                <div key={item.topic}>
                  <div className="flex justify-between mb-0.5">
                    <span className="text-text-muted text-[11px]">{item.topic}</span>
                    <span className="text-text-secondary text-[11px] font-semibold">{item.score}%</span>
                  </div>
                  <div className="h-1.5 bg-border-subtle rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${item.score}%`, backgroundColor: barColor(item.score) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <h3 className="text-text-primary text-sm font-semibold mb-1">Rating History</h3>
          <RatingHistoryChart data={ratingData} />
        </Card>
        <Card className="p-4">
          <h3 className="text-text-primary text-sm font-semibold mb-1">Weekly Velocity</h3>
          <p className="text-text-faint text-xs mb-3">Problems solved per week</p>
          <WeeklyVelocityChart data={data.weekly_velocity} />
        </Card>
      </div>
    </div>
  )
}

export default Analytics
