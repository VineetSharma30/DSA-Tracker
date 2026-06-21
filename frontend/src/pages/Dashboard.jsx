import React from 'react'
import { overallStats, platformStats, difficultyStats } from '../data/mockData'
import Card from '../components/ui/Card'
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/dashboard/StatCard'
import {ConsistencyHeatmap, DifficultyDistributionChart, ProblemsOverTimeChart, StrengthWeaknessChart, TopicDistributionChart} from '../components/charts/Charts'
import UpcomingContests from '../components/dashboard/UpcomingContests'

const statRow = [
  { label: "Problems Solved", value: "542", valueColor: "text-text-primary", sub: "↑ 23 this week", subColor: "text-status-easy" },
  { label: "Easy", value: "198", valueColor: "text-status-easy", sub: "36%", subColor: "text-status-easy" },
  { label: "Medium", value: "275", valueColor: "text-status-medium", sub: "51%", subColor: "text-status-medium" },
  { label: "Hard", value: "69", valueColor: "text-status-hard", sub: "13%", subColor: "text-status-hard" },
  { label: "Accuracy", value: "78.6%", valueColor: "text-text-primary", sub: "↑ 4.2%", subColor: "text-status-easy" },
  { label: "Current Streak", value: "21 Days", valueColor: "text-accent-purpleLight", sub: "Best: 45 Days", subColor: "text-text-muted" },
]

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <div className="space-y-4">

      {/* Header row */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-text-primary text-2xl font-bold">Dashboard</h1>
          <p className="text-text-muted text-sm mt-0.5">
            Welcome back, {user.name} 👋 — here's your DSA snapshot
          </p>
        </div>
      </div>

      {/* Platform cards & overall score — 5 columns */}
      <div className="grid grid-cols-5 gap-3">
        {platformStats.map((stat) => (
          <StatCard key={stat.platform} {...stat} />
        ))}
        <Card className="px-4 py-1 h-25 bg-linear-to-br from-accent-purple to-accent-blue flex flex-col justify-center">
          <div>
            <p className="text-white/80 text-[11px]">Overall DSA Score</p>
            <p className="text-white text-3xl font-extrabold leading-tight mt-0.5">
              {overallStats.dsaScore}
              <span className="text-white/70 text-xs font-normal">/100</span>
            </p>
            <p className="text-white/95 text-[11px] font-medium mt-0.5">{overallStats.scoreLabel}</p>
          </div>
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${overallStats.dsaScore}%`, backgroundColor: "white" }}
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

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4">
          <h3 className="text-text-primary text-sm font-semibold mb-2">Problems Solved Over Time</h3>
          <ProblemsOverTimeChart />
        </Card>
        <Card className="p-4">
          <h3 className="text-text-primary text-sm font-semibold mb-2">Topic Distribution</h3>
          <TopicDistributionChart />
        </Card>
        <Card className="p-4">
          <h3 className="text-text-primary text-sm font-semibold mb-2">Difficulty Distribution</h3>
          <DifficultyDistributionChart />
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
          <StrengthWeaknessChart />
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
