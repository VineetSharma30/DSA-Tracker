import { useState, useEffect } from 'react'
// import { overallStats, platformStats, difficultyStats } from '../data/mockData'
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card'
import StatCard from '../components/dashboard/StatCard'
import {ConsistencyHeatmap, DifficultyDistributionChart, ProblemsOverTimeChart, StrengthWeaknessChart, TopicDistributionChart} from '../components/charts/Charts'
import UpcomingContests from '../components/dashboard/UpcomingContests'
import AICoach from '../components/dashboard/AICoach'
import api from '../services/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'


const PLATFORM_CONFIG = {
  LeetCode:   { color: "#F89F1B" },
  Codeforces: { color: "#3B82F6" },
  CodeChef:   { color: "#FCD34D" },
  HackerRank: { color: "#00C853" },
}


const Dashboard = () => {

  const { user } = useAuth()
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats')
        setStats(response.data)
      } catch (err) {
        setError("Failed to load dashboard stats")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statRow = [
    { label: "Problems Solved", value: stats.total_solved, sub: `+${stats.total_solved} total`, valueColor: "text-text-primary", subColor: "text-status-easy" },
    { label: "Easy",   value: stats.easy_solved,   sub: stats.total_solved ? `${Math.round(stats.easy_solved/stats.total_solved*100)}%`   : "0%", valueColor: "text-status-easy", subColor: "text-status-easy" },
    { label: "Medium", value: stats.medium_solved, sub: stats.total_solved ? `${Math.round(stats.medium_solved/stats.total_solved*100)}%` : "0%", valueColor: "text-status-medium", subColor: "text-status-medium" },
    { label: "Hard",   value: stats.hard_solved,   sub: stats.total_solved ? `${Math.round(stats.hard_solved/stats.total_solved*100)}%`   : "0%", valueColor: "text-status-hard", subColor: "text-status-hard" },
    { label: "Accuracy",       value: `${stats.accuracy}%`,        sub: "overall",                     valueColor: "text-text-primary",       subColor: "text-status-easy" },
    { label: "Current Streak", value: `${stats.current_streak}d`,  sub: `Best: ${stats.best_streak}d`, valueColor: "text-accent-purpleLight", subColor: "text-accent-purpleLight" },
  ]

  const dsaScore = Math.min(
    Math.round(
      (stats.total_solved / 5) * 0.4 +        // problems solved (max 200 = 40pts)
      (stats.accuracy) * 0.3 +                  // accuracy (30pts)
      (Math.min(stats.current_streak, 30) / 30) * 100 * 0.2 + // streak (20pts)
      (stats.hard_solved / Math.max(stats.total_solved, 1)) * 100 * 0.1 // hard ratio (10pts)
    ),
    100
  )
  const scoreLabel = dsaScore >= 80 ? "Excellent" : dsaScore >= 60 ? "Good" : dsaScore >= 40 ? "Fair" : "Keep going!"

  if (loading) return <LoadingSpinner message="Loading dashboard..." />
  if (error) return <div className="text-status-hard text-sm p-8">{error}</div>

  return (
    <div className="space-y-4">

      {/* Header row */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-text-primary text-2xl font-bold">Dashboard</h1>
          <p className="text-text-muted text-sm mt-0.5">
            Welcome back, {user?.username} 👋 — here's your DSA snapshot
          </p>
        </div>
      </div>

      {/* Platform cards & overall score — 5 columns */}
      <div className="grid grid-cols-5 gap-3">
        {stats.platform_stats.length > 0 ? (
          stats.platform_stats.map((ps) => (
            <StatCard
              key={ps.platform}
              platform={ps.platform}
              rating={ps.rating || "—"}
              rank={ps.rank}
              color={PLATFORM_CONFIG[ps.platform]?.color || "#6B7280"}
              ratingChange={0}
            />
          ))
        ) : (
          // Show empty platform cards if no handles synced yet
          Object.entries(PLATFORM_CONFIG).map(([name, config]) => (
            <StatCard
              key={name}
              platform={name}
              rating="—"
              rank={null}
              color={config.color}
              ratingChange={0}
            />
          ))
        )}
        <Card className="px-4 py-1 h-25 bg-linear-to-br from-accent-purple to-accent-blue flex flex-col justify-center">
          <div>
            <p className="text-white/80 text-[11px]">Overall DSA Score</p>
            <p className="text-white text-3xl font-extrabold leading-tight mt-0.5">
              {dsaScore}
              <span className="text-white/70 text-xs font-normal">/100</span>
            </p>
            <p className="text-white/95 text-[11px] font-medium mt-0.5">{scoreLabel}</p>
          </div>
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${dsaScore}%`, backgroundColor: "white" }}
              />
            </div>
        </Card>
      </div>

      {/* Stat row — single card */}
      <Card className="grid grid-cols-6 h-22">
        {statRow.map((stat) => (
          <div key={stat.label} className="px-4 py-2">
            <p className="text-text-muted text-[11px]">{stat.label}</p>
            <p className={`text-lg font-bold mt-0.5 ${stat.valueColor}`}>{stat.value}</p>
            <p className={`text-[11px] mt-0.5 ${stat.subColor}`}>{stat.sub}</p>
          </div>
        ))}
      </Card>

      {/* AI Coach — insight banner + report/recommend/roast */}
      <AICoach />

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4">
          <h3 className="text-text-primary text-sm font-semibold mb-2">Problems Solved Over Time</h3>
          <ProblemsOverTimeChart data={stats.problems_over_time} />
        </Card>
        <Card className="p-4">
          <h3 className="text-text-primary text-sm font-semibold mb-2">Topic Distribution</h3>
          {stats.topic_distribution.length > 0 ? (
            <TopicDistributionChart data={stats.topic_distribution} />
          ) : (
            <p className="text-text-faint text-xs py-8 text-center">Add problems to see topic distribution</p>
          )}
        </Card>
        <Card className="p-4">
          <h3 className="text-text-primary text-sm font-semibold mb-2">Difficulty Distribution</h3>
          <DifficultyDistributionChart easy={stats.easy_solved} medium={stats.medium_solved} hard={stats.hard_solved} />
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-text-primary text-sm font-semibold">Strength vs Weakness</h3>
            <div className="flex gap-3 text-xs text-text-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-status-easy inline-block" />Strength
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-status-hard inline-block" />Weakness
              </span>
            </div>
          </div>
          {stats.strength_weakness?.length > 0 ? (
            <StrengthWeaknessChart data={stats.strength_weakness} />
          ) : (
            <p className="text-text-faint text-xs py-8 text-center">Add problems to see topic strength</p>
          )}
        </Card>

        <Card className="p-4">
          <h3 className="text-text-primary text-sm font-semibold mb-2">Consistency Heatmap</h3>
          <ConsistencyHeatmap />
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-text-primary text-sm font-semibold">Upcoming Contests</h3>
            <span className="text-accent-purple text-xs cursor-pointer hover:underline">View All →</span>
          </div>
          <UpcomingContests />
        </Card>
      </div>

    </div>
  )
}

export default Dashboard
