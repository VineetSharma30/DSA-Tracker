function StrengthWeaknessChart({ data = [] }) {
  if (!data.length) {
    return <p className="text-text-faint text-xs py-8 text-center">No topic data yet.</p>
  }

  // Show the strongest few and weakest few so the card reads as "strength vs weakness".
  const sorted = [...data].sort((a, b) => (b.accuracy_pct ?? 0) - (a.accuracy_pct ?? 0))
  const shown = sorted.length > 7
    ? [...sorted.slice(0, 4), ...sorted.slice(-3)]
    : sorted

  return (
    <div className="flex flex-col gap-1.5">
      {shown.map((item) => {
        const score = Math.round(item.accuracy_pct ?? 0)
        const barColor = score >= 60 ? "#10B981" : score >= 40 ? "#F59E0B" : "#EF4444"

        return (
          <div key={item.topic}>
            <div className="flex justify-between mb-0.5">
              <span className="text-text-muted text-[11px] font-medium">{item.topic}</span>
              <span className="text-text-secondary text-[11px] font-semibold">{score}%</span>
            </div>
            <div className="h-1 bg-border-subtle rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${score}%`, backgroundColor: barColor }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StrengthWeaknessChart
