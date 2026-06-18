import { strengthWeakness } from '../../data/mockData'

function StrengthWeaknessChart() {
  return (
    <div className="flex flex-col gap-3">
      {strengthWeakness.map((item) => {
        const isStrong = item.score >= 60
        const barColor = isStrong ? "#10B981" : item.score >= 40 ? "#F59E0B" : "#EF4444"

        return (
          <div key={item.topic}>
            <div className="flex justify-between mb-1">
              <span className="text-text-muted text-xs">{item.topic}</span>
              <span className="text-text-secondary text-xs font-medium">{item.score}%</span>
            </div>
            <div className="h-1.5 bg-border-subtle rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${item.score}%`, backgroundColor: barColor }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StrengthWeaknessChart
