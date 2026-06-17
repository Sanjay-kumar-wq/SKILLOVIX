import React from 'react';

const variants = {
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  primary: 'bg-primary/10 text-primary dark:bg-primary/20',
  secondary: 'bg-secondary/10 text-secondary dark:bg-secondary/20',
  accent: 'bg-accent/10 text-accent dark:bg-accent/20',
  success: 'bg-success/10 text-success dark:bg-success/20',
  warning: 'bg-warning/10 text-warning dark:bg-warning/20',
  danger: 'bg-danger/10 text-danger dark:bg-danger/20',
  gradient: 'bg-gradient-to-r from-primary to-secondary text-white',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs rounded-md',
  md: 'px-3 py-1 text-xs rounded-full',
  lg: 'px-4 py-1.5 text-sm rounded-full',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  icon,
  className = '',
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-semibold
        ${variants[variant] || variants.default}
        ${sizes[size] || sizes.md}
        ${className}
      `}
    >
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
}
