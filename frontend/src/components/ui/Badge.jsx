import React from 'react'

const styles = {
    outlined: {
        easy: "text-status-easy border-status-easy",
        medium: "text-status-medium border-status-medium",
        hard: "text-status-hard border-status-hard",
        muted: "text-text-muted border-text-muted",
    },
    filled: {
        easy: "text-status-easy bg-green-950",
        medium: "text-status-medium bg-orange-950",
        hard: "text-status-hard bg-red-950",
    },
};

const Badge = ({children, variant= "outlined", color = "easy", className = ""}) => {

  return (
    <div className={`rounded-pill inline-flex items-center border px-2.5 py-1 text-xs font-medium ${styles[variant][color]} ${className}`}>
      {children}
    </div>
  )
}

export default Badge
