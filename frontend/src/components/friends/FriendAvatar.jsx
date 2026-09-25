export const statusColors = {
  online:  "#10B981",
  contest: "#EF4444",
  solving: "#F59E0B",
  away:    "#6B7280",
}

export const Avatar = ({ letter, color, size = "w-9 h-9" }) => (
  <div
    className={`${size} rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0`}
    style={{ backgroundColor: color }}
  >
    {letter}
  </div>
)

export const StatusBadge = ({ statusLabel, status }) => (
  <span
    className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full inline-block"
    style={{ backgroundColor: `${statusColors[status]}20`, color: statusColors[status] }}
  >
    {statusLabel}
  </span>
)
