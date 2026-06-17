import React from 'react'

const variants = {
  primary: "bg-accent-purple text-white hover:bg-accent-purpleLight",
  secondary: "bg-bg-input border border-border-DEFAULT text-text-secondary hover:border-accent-purple",
  ghost: "bg-transparent text-text-muted hover:text-text-primary",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

const Button = ({ children, variant = "primary", size = "md", onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-pill font-medium transition-colors duration-150 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;