import React from 'react'
import { overallStats, platformStats, difficultyStats } from '../data/mockData'
import Card from '../components/ui/Card'
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/dashboard/StatCard'
import ProblemsOverTimeChart from '../components/dashboard/ProblemsOverTimeChart';
import TopicDistributionChart from '../components/dashboard/TopicDistributionChart';
import DifficultyDistributionChart from '../components/dashboard/DifficultyDistributionChart';
import StrengthWeaknessChart from '../components/dashboard/StrengthWeaknessChart'
import ConsistencyHeatmap from '../components/dashboard/ConsistencyHeatmap'
import UpcomingContests from '../components/dashboard/UpcomingContests'


const Dashboard = () => {
  const { user } = useAuth();
  const statRow = [
  { label: "Problems Solved", value: overallStats.totalSolved, sub: `+23 this week`, subColor: "text-status-easy" },
  { label: "Easy",   value: difficultyStats.easy.count,   sub: `${difficultyStats.easy.percent}%`,   subColor: "text-status-easy" },
  { label: "Medium", value: difficultyStats.medium.count, sub: `${difficultyStats.medium.percent}%`, subColor: "text-status-medium" },
  { label: "Hard",   value: difficultyStats.hard.count,   sub: `${difficultyStats.hard.percent}%`,   subColor: "text-status-hard" },
  { label: "Accuracy", value: `${overallStats.accuracy}%`, sub: "+4.2%", subColor: "text-status-easy" },
  { label: "Current Streak", value: `${overallStats.streak} Days`, sub: "Best: 34 Days", subColor: "text-accent-purpleLight" },
];


  return (
    <div className="space-y-4">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-text-primary text-2xl font-bold">Dashboard</h1>
          <p className="text-text-muted text-sm mt-1">
            Welcome back, {`${user.name}`} 👋 — here's your DSA snapshot
          </p>
        </div>
      </div>

      {/* Platform stat cards */}

      <div className="grid grid-cols-5 gap-4">
        {platformStats.map((stat) => (
          <StatCard key={stat.platform} {...stat} />
        ))}
        <Card className="p-5 bg-linear-to-br from-accent-purple to-accent-blue flex flex-col justify-center">
          <p className="text-white/80 text-xs">Overall DSA Score</p>
          <p className="text-white text-3xl font-extrabold mt-1">
            {overallStats.dsaScore}<span className="text-white/70 text-sm">/100</span>
          </p>
          <p className="text-white/90 text-xs font-medium mt-1">{overallStats.scoreLabel}</p>
        </Card>
      </div>

      {/* User Stat */}
      <div className="grid grid-cols-6 gap-4">
        {statRow.map((stat) => (
          <Card key={stat.label} className="p-4">
            <p className="text-text-muted text-xs">{stat.label}</p>
            <p className="text-text-primary text-xl font-bold mt-1">{stat.value}</p>
            <p className={`text-xs mt-1 ${stat.subColor}`}>{stat.sub}</p>
          </Card>
        ))}
      </div>
      
      {/* Charts */}

      <div className="grid grid-cols-3 gap-4">

        <Card className="p-5 col-span-1 min-h-80 ">
          <h3 className="text-text-primary text-sm font-semibold pt-2 pb-4">Problems Solved Over Time</h3>
          {/* chart goes here */}
          <ProblemsOverTimeChart />
        </Card>

        <Card className="p-5 min-h-80">
          <h3 className="text-text-primary text-sm font-semibold">Topic Distribution</h3>
          {/* chart goes here */}
          <TopicDistributionChart/>
        </Card>

        <Card className="p-5 min-h-80">
          <h3 className="text-text-primary text-sm font-semibold">Difficulty Distribution</h3>
          {/* chart goes here */}
          <DifficultyDistributionChart/>
        </Card>
        
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-text-primary text-sm font-semibold">Strength vs Weakness</h3>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-easy inline-block"/>Strength</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-hard inline-block"/>Weakness</span>
            </div>
          </div>
          <StrengthWeaknessChart />
        </Card>
        <Card className="p-5">
          <h3 className="text-text-primary text-sm font-semibold mb-4">Consistency Heatmap</h3>
          <ConsistencyHeatmap />
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
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
