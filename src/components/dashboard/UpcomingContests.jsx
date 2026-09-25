import { upcomingContests } from '../../data/mockData'

function UpcomingContests() {
  return (
    <div className="flex flex-col gap-3">
      {upcomingContests.map((contest) => (
        <div key={contest.name} className="flex items-center gap-3">
          {/* Platform badge */}
          <div className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-[11px] font-bold text-white"
            style={{ backgroundColor: contest.color }}>
            {contest.abbr}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-text-primary text-xs font-semibold truncate">{contest.name}</p>
            <p className="text-text-muted text-[10px] mt-0.5">{contest.date} · {contest.time}</p>
            <p className="text-status-easy text-[10px] mt-0.5 font-medium">{contest.startsIn}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default UpcomingContests
