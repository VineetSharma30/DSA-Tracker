import { useState, useEffect, useMemo } from 'react'
import api from '../../services/api'

const weeks = 16
const days  = 7

const months    = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""]
const colors    = ["#1E2235", "#0d4f2f", "#0a7a47", "#10B981", "#34D399"]

function getColor(count) {
  if (count === 0) return colors[0]
  if (count === 1) return colors[1]
  if (count <= 3)  return colors[2]
  if (count <= 6)  return colors[3]
  return colors[4]
}

// LeetCode stores activity as UTC unix timestamps (seconds)
function toTimestamp(date) {
  return Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 1000
  ).toString()
}

function buildGrid(data) {
  const today = new Date()
  const grid  = []

  for (let w = weeks - 1; w >= 0; w--) {
    const week = []
    for (let d = 0; d < days; d++) {
      const date = new Date(today)
      date.setDate(today.getDate() - w * 7 - (6 - d))
      date.setHours(0, 0, 0, 0)
      week.push({ date, count: Number(data[toTimestamp(date)] || 0) })
    }
    grid.push(week)
  }

  return grid
}

function getLabels() {
  const today  = new Date()
  const labels = []
  let lastMonth = -1

  for (let w = 0; w < weeks; w++) {
    const date  = new Date(today)
    date.setDate(today.getDate() - (weeks - w) * 7)
    const month = date.getMonth()

    if (month !== lastMonth) {
      labels.push({ text: months[month], col: w })
      lastMonth = month
    }
  }

  return labels.filter((l, i) => !labels[i + 1] || labels[i + 1].col - l.col >= 3)
}

function ConsistencyHeatmap() {
  const [data, setData]       = useState({})
  const [tooltip, setTooltip] = useState(null)

  useEffect(() => {
    api.get('/platforms/leetcode/calendar')
      .then(res => setData(res.data.calendar || {}))
      .catch(err => console.error("Calendar fetch failed:", err))
  }, [])

  const grid   = useMemo(() => buildGrid(data), [data])
  const labels = useMemo(() => getLabels(), [])

  function showTooltip(e, count, date) {
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltip({
      count,
      date: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      x: rect.left + rect.width / 2,
      y: rect.top,
    })
  }

  return (
    <div className="relative overflow-x-scroll lg:overflow-hidden">

      {tooltip && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y - 10, transform: "translate(-50%, -100%)" }}
        >
          <div className="bg-[#12151F] border border-[#1E2235] rounded-lg px-3.5 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.6)] whitespace-nowrap">
            <div className="text-[11px] text-white font-semibold mb-0.5 tracking-wide">
              {tooltip.date}
            </div>
            <div className="text-[12px] text-status-easy font-medium">
              {tooltip.count === 0 ? "No submissions" : `solved : ${tooltip.count}`}
            </div>
          </div>
          <div className="w-0 h-0 mx-auto border-x-[6px] border-x-transparent border-t-[6px] border-t-[#1E2235]" />
        </div>
      )}

      <div className="pl-3.5">
        <div className="relative w-fit">

          <div className="relative h-4 mb-1">
            {labels.map((l, i) => (
              <div
                key={i}
                className="absolute text-text-faint text-[10px] whitespace-nowrap font-medium"
                style={{ left: `${28 + l.col * 18}px` }}
              >
                {l.text}
              </div>
            ))}
          </div>

          <div className="flex gap-0">

            <div className="flex flex-col gap-1 mr-1">
              {dayLabels.map((label, i) => (
                <div key={i} className="h-3.5 text-text-faint text-[10px] leading-3.5 w-6 text-right pr-1">
                  {label}
                </div>
              ))}
            </div>

            {grid.map((week, w) => (
              <div key={w} className="flex flex-col gap-1 mr-1">
                {week.map(({ date, count }, d) => (
                  <div
                    key={`${w}-${d}`}
                    className="w-3.5 h-3.5 rounded-[3px] cursor-pointer transition-all duration-150 hover:scale-125 hover:ring-1 hover:ring-indigo-400/40"
                    style={{ backgroundColor: getColor(count) }}
                    onMouseEnter={(e) => showTooltip(e, count, date)}
                    onMouseLeave={() => setTooltip(null)}
                  />
                ))}
              </div>
            ))}

          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-3 justify-center w-full">
        <span className="text-text-faint text-[10px]">Less</span>
        {colors.map((color, i) => (
          <div key={i} className="w-2.75 h-2.75 rounded-xs" style={{ backgroundColor: color }} />
        ))}
        <span className="text-text-faint text-[10px]">More</span>
      </div>

    </div>
  )
}

export default ConsistencyHeatmap
