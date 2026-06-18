import React from 'react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'

function StatCard({ platform, rating, rank, color, ratingChange }) {
  const isPositive = ratingChange > 0;
  const isNegative = ratingChange < 0;

  return (
    <Card className="pt-4 px-4 pb-4">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-xl" style={{ backgroundColor: color }}></div>
        <div>
          <p className="text-text-muted text-xs mb-1">{platform}</p>
          <div className="flex items-center gap-2">
            <p className="font-bold" style={{ color }}>{rating}</p>
            {rank && <Badge color="muted" variant="outlined" className="text-[10px]">{rank}</Badge>}
          </div>
        </div>
      </div>

      <p className={`text-xs mt-3 font-medium ${
        isPositive ? "text-status-easy" : isNegative ? "text-status-hard" : "text-text-muted"
      }`}>
        {isPositive && "↑ "}
        {isNegative && "↓ "}
        {ratingChange !== 0 ? Math.abs(ratingChange) : "No change"} this week
      </p>
    </Card>
  );
}

export default StatCard;