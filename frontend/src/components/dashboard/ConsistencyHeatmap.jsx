import { useState } from 'react'

const WEEKS = 16
const DAYS = 7
const GREENS = ["#1E2235", "#0d4f2f", "#0a7a47", "#10B981", "#34D399"]
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""]

function generateData() {
  return Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: DAYS }, (_, d) => {
      // Simulate streaks — weekdays more active than weekends
      const isWeekend = d === 5 || d === 6
      const rand = Math.random()
      if (isWeekend) return rand > 0.6 ? Math.floor(rand * 3) : 0
      return rand > 0.25 ? Math.ceil(rand * 4) : 0
    })
  )
}

const data = generateData()

// Figure out which weeks belong to which month
const monthLabels = (() => {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const today = new Date()
  const labels = []
  let lastMonth = -1
  for (let w = 0; w < WEEKS; w++) {
    const d = new Date(today)
    d.setDate(d.getDate() - (WEEKS - w) * 7)
    const m = d.getMonth()
    labels.push(m !== lastMonth ? months[m] : "")
    lastMonth = m
  }
  return labels
})()

function ConsistencyHeatmap() {
  const [tooltip, setTooltip] = useState(null)

  return (
    <div className="relative">
      {/* Tooltip */}
      {tooltip && (
        <div className="absolute z-10 -top-8 px-2 py-1 bg-bg-input border border-border-DEFAULT rounded text-[10px] text-text-primary whitespace-nowrap pointer-events-none"
          style={{ left: tooltip.x, transform: "translateX(-50%)" }}>
          {tooltip.count === 0 ? "No activity" : `${tooltip.count} problem${tooltip.count > 1 ? "s" : ""}`}
        </div>
      )}

      {/* Month labels */}
      <div className="flex ml-7 mb-1">
        {monthLabels.map((label, w) => (
          <div key={w} className="text-text-faint text-[10px] w-3.5 mr-0.5 shrink-0">
            {label}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex gap-0">
        {/* Day labels */}
        <div className="flex flex-col gap-0.5 mr-1">
          {DAY_LABELS.map((label, d) => (
            <div key={d} className="h-3.5 text-text-faint text-[10px] leading-3.5 w-6 text-right pr-1">
              {label}
            </div>
          ))}
        </div>

        {/* Week columns */}
        {data.map((week, w) => (
          <div key={w} className="flex flex-col gap-0.5 mr-0.5">
            {week.map((count, d) => (
              <div
                key={d}
                className="w-3.5 h-3.5 rounded-[3px] cursor-pointer transition-opacity hover:opacity-80"
                style={{ backgroundColor: GREENS[count] }}
                onMouseEnter={(e) => setTooltip({ count, x: e.currentTarget.offsetLeft + 7 })}
                onMouseLeave={() => setTooltip(null)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1 mt-2 justify-end">
        <span className="text-text-faint text-[10px]">Less</span>
        {GREENS.map((color, i) => (
          <div key={i} className="w-2.75 h-2.75 rounded-xs" style={{ backgroundColor: color }} />
        ))}
        <span className="text-text-faint text-[10px]">More</span>
      </div>
    </div>
  )
}

export default ConsistencyHeatmap
