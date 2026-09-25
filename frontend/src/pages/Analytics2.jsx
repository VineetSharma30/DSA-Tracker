import { useState, useEffect } from 'react'
import { LoadingSpinner } from '../components/ui/Ui'
import api from '../services/api'

import TimelineChart              from '../components/charts/TimelineChart'
import RatingHistoryChart2        from '../components/charts/RatingHistoryChart2'
import DifficultyProgressionChart from '../components/charts/DifficultyProgressionChart'
import { TopicImprovementTable, NeedsAttentionCard } from '../components/charts/TopicCards'
import MonthlyReviewCard          from '../components/charts/MonthlyReviewCard'
import AiCoachCard                from '../components/charts/AiCoachCard'

const Analytics2 = () => {
  const [analytics,  setAnalytics]  = useState(null)
  const [stats,      setStats]      = useState(null)
  const [ratingData, setRatingData] = useState({})
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [aRes, sRes] = await Promise.all([
          api.get('/dashboard/analytics'),
          api.get('/dashboard/stats'),
        ])
        setAnalytics(aRes.data)
        setStats(sRes.data)

        // Fetch all platform rating histories in parallel — each is optional
        const toSeries = (history = []) =>
          history.map(c => ({
            contest: new Date(c.date * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            rating:  c.new_rating,
          }))

        const [cfRes, lcRes] = await Promise.allSettled([
          api.get('/platforms/codeforces/rating-history'),
          api.get('/platforms/leetcode/rating-history'),
        ])

        const built = {}
        if (cfRes.status === 'fulfilled') {
          const s = toSeries(cfRes.value.data.history)
          if (s.length) built.Codeforces = s
        }
        if (lcRes.status === 'fulfilled') {
          const s = toSeries(lcRes.value.data.history)
          if (s.length) built.LeetCode = s
        }
        if (Object.keys(built).length) setRatingData(built)
      } catch (err) {
        console.error("Analytics load failed:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading || !analytics) return <LoadingSpinner message="Loading analytics..." />

  // Merge hard_solved from /dashboard/stats into summary so components can use it
  const summary = {
    ...analytics.summary,
    hard_solved:   stats?.hard_solved   ?? 0,
    easy_solved:   stats?.easy_solved   ?? 0,
    medium_solved: stats?.medium_solved ?? 0,
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-text-primary text-2xl font-bold">Analytics</h1>
        <p className="text-text-muted text-sm mt-0.5">Track your growth. Improve every day.</p>
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-[5fr_7fr] gap-3">
        <TimelineChart summary={summary} dailyCounts={analytics.daily_counts} />
        <RatingHistoryChart2 ratingData={ratingData} platformStats={stats?.platform_stats || []} />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-2 gap-3">
        <TopicImprovementTable topicRadar={analytics.topic_radar} />
        <DifficultyProgressionChart
          dailyCounts={analytics.daily_counts}
          easySolved={summary.easy_solved}
          medSolved={summary.medium_solved}
          hardSolved={summary.hard_solved}
        />
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-3 gap-3">
        <MonthlyReviewCard summary={summary} />
        <NeedsAttentionCard topicRadar={analytics.topic_radar} />
        <AiCoachCard topicRadar={analytics.topic_radar} />
      </div>
    </div>
  )
}

export default Analytics2
