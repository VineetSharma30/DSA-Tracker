import { Card } from '../ui/Ui'

const MonthlyReviewCard = ({ summary}) => {
  const s = summary

  // Compute month-over-month deltas — we don't have historical data so we show
  // approximate % contributions as the "delta"
  const stats = [
    { label: "Problems Solved", value: s.total_solved,              delta: `${s.active_days}/${s.active_window || 60} active days`, color: "#7C3AED", icon: "📈" },
    { label: "Accuracy",        value: `${s.acceptance_rate}%`,     delta: `Based on logged problems`,                              color: "#10B981", icon: "🎯" },
    { label: "Best Streak",     value: `${s.best_streak} days`,     delta: `Current: ${s.current_streak}d`,                        color: "#EF4444", icon: "🔥" },
    { label: "Active Days",     value: `${s.active_days}d`,         delta: `Last 60 days`,                                         color: "#F59E0B", icon: "⚡" },
  ]

  return (
    <Card className="overflow-hidden">
      {/* Gradient banner */}
      <div className="px-4 pt-4 pb-5 bg-linear-to-br from-[#1E1840] to-[#12151F] border-b border-border-subtle">
        <p className="text-text-faint text-xs uppercase tracking-widest font-medium">Monthly Review</p>
        <p className="text-white text-base font-bold mt-1">Your performance summary</p>
      </div>

      <div className="p-4 space-y-3">
        {stats.map(stat => (
          <div key={stat.label} className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
              style={{ backgroundColor: `${stat.color}15` }}
            >
              {stat.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-text-faint text-[10px]">{stat.label}</p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <p className="text-text-primary text-base font-extrabold" style={{ color: stat.color }}>
                  {stat.value}
                </p>
              </div>
              <p className="text-text-faint text-[9px]">{stat.delta}</p>
            </div>
            <div className="h-6 w-16 shrink-0">
              <div className="h-1 bg-border-subtle rounded-full overflow-hidden mt-2">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(
                      typeof stat.value === "number" ? stat.value : 70,
                      100
                    )}%`,
                    backgroundColor: stat.color,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default MonthlyReviewCard
