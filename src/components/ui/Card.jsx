import React from 'react'

const Card = ({ children, className = "" }) => {
  return (
    <div className={` bg-bg-card border border-border-subtle rounded-card ${className}`}>
      {children}
    </div>
  )
}

export default Card
