import { useState } from 'react'
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { contestsData, contestHistory } from '../data/mockData'

const PLATFORM_FILTERS = ["All", "LeetCode", "Codeforces", "CodeChef", "HackerRank"];

function ContestCard({ contest }) {
  return (
    <Card className="p-4 relative overflow-hidden">
      {/* Top color bar */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ backgroundColor: contest.color }}
      />

      <div className="flex items-start gap-3 mt-1">
        {/* Platform badge */}
        <div
          className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: `${contest.color}30`, color: contest.color }}
        >
          {contest.abbr}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded"
              style={{ backgroundColor: `${contest.color}20`, color: contest.color }}
            >
              {contest.type}
            </span>
          </div>
          <p className="text-text-primary text-sm font-semibold truncate">{contest.name}</p>
          <p className="text-text-muted text-[10px] mt-0.5">{contest.date} · {contest.time}</p>
          <p className="text-status-easy text-[10px] mt-1 font-medium">{contest.starts}</p>
        </div>

        <Button
          variant={contest.registered ? "primary" : "secondary"}
          size="sm"
          className="shrink-0 text-[11px]"
        >
          {contest.registered ? "Registered" : "Register"}
        </Button>
      </div>
    </Card>
  )
}

function Contests() {
  const [filter, setFilter] = useState("All");

  const filtered = contestsData.filter(
    (c) => filter === "All" || c.platform === filter
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-text-primary text-2xl font-bold">Contests</h1>
        <p className="text-text-muted text-sm mt-0.5">Upcoming contests and your participation history</p>
      </div>

      {/* Platform filter */}
      <div className="flex gap-2 flex-wrap">
        {PLATFORM_FILTERS.map((p) => (
          <Button
            key={p}
            variant={filter === p ? "primary" : "secondary"}
            size="sm"
            onClick={() => setFilter(p)}
          >
            {p}
          </Button>
        ))}
      </div>

      {/* Upcoming contests grid */}
      <div>
        <h2 className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-3">
          Upcoming — {filtered.length} contest{filtered.length !== 1 ? "s" : ""}
        </h2>
        {filtered.length === 0 ? (
          <Card className="p-8 text-center text-text-muted text-sm">
            No upcoming contests for this platform.
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((contest) => (
              <ContestCard key={contest.id} contest={contest} />
            ))}
          </div>
        )}
      </div>

      {/* Contest history */}
      <div>
        <h2 className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-3">
          Recent Participation
        </h2>
        <Card className="overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_130px_100px_80px] px-4 py-2.5 border-b border-border-subtle bg-bg-base">
            {["Contest", "Platform", "Rank", "Rating Δ"].map((h) => (
              <span key={h} className="text-text-faint text-[11px] font-medium uppercase tracking-wide">
                {h}
              </span>
            ))}
          </div>

          {contestHistory.map((c, i) => {
            const isPositive = c.delta.startsWith("+");
            return (
              <div
                key={i}
                className="grid grid-cols-[1fr_130px_100px_80px] px-4 py-3 items-center border-b border-border-subtle last:border-0 hover:bg-bg-input transition-colors"
              >
                <div>
                  <p className="text-text-primary text-xs font-medium">{c.name}</p>
                  <p className="text-text-faint text-[10px] mt-0.5">{c.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="text-text-muted text-xs">{c.platform}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Trophy size={11} className="text-text-faint" />
                  <span className="text-text-secondary text-xs font-medium">#{c.rank}</span>
                </div>
                <div className="flex items-center gap-1">
                  {isPositive
                    ? <TrendingUp size={12} className="text-status-easy" />
                    : <TrendingDown size={12} className="text-status-hard" />
                  }
                  <span className={`text-xs font-semibold ${isPositive ? "text-status-easy" : "text-status-hard"}`}>
                    {c.delta}
                  </span>
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  )
}

export default Contests