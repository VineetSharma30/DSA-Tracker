import React from 'react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'

const initials = {
  LeetCode: "LC",
  Codeforces: "CF",
  CodeChef: "CC",
  HackerRank: "HR",
}

function StatCard({ platform, rating, rank, color, ratingChange }) {
  const isPositive = ratingChange > 0;
  const isNegative = ratingChange < 0;

  return (
    <Card className="p-4 flex flex-col justify-between h-25">
      {/* Icon + Platform name */}
      <div className="flex items-center gap-2 mb-2.5">
        <div
          className={`w-10 h-10 rounded-lg shrink-0 text-xs font-bold flex items-center justify-center`}
          style={{ backgroundColor: `${color}1e`, color : `${color}` }}
        >
          {initials[platform]}
        </div>
        <div className="items-center gap-2 ">
          <p className="text-text-muted text-xs font-medium ">{platform}</p>
          <div className="flex flex-wrap gap-2 p-0.5">
            <p className="text-xl font-bold leading-none" style={{ color }}>{rating}</p>
            {rank && (
              <Badge color="muted" variant="outlined" className="text-[10px] py-0 px-1.5 leading-normal">
                {rank}
              </Badge>
            )}

          </div>
        </div>
      </div>

      {/* Rating + Badge inline */}
      <div>
        
        {/* Trend */}
        <p className={`text-xs font-medium mt-0.5 ${
          isPositive ? "text-status-easy" : isNegative ? "text-status-hard" : "text-text-muted"
        }`}>
          {isPositive && "↑ "}
          {isNegative && "↓ "}
          {ratingChange !== 0 ? Math.abs(ratingChange) : "No change"} this week       
           </p>
      </div>
    </Card>
  )
}

export default StatCard
