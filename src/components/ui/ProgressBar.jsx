import React from 'react';

export default function ProgressBar({
  value = 0,
  max = 100,
  label,
  showValue = true,
  color = 'primary',
  size = 'md',
  animated = true,
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const fillColors = {
    primary:   '#10B981',
    secondary: '#2563EB',
    success:   '#10B981',
    warning:   '#F59E0B',
    danger:    '#EF4444',
    accent:    '#38BDF8',
    gradient:  null, // handled below
  };

  const heights = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const fillBg =
    color === 'gradient'
      ? 'linear-gradient(90deg, #2563EB, #38BDF8)'
      : fillColors[color] || fillColors.primary;

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span
              className="text-sm font-medium"
              style={{ color: '#8BA5C7', fontFamily: 'Inter, sans-serif' }}
            >
              {label}
            </span>
          )}
          {showValue && (
            <span
              className="text-xs font-semibold"
              style={{ color: '#4B6A9B', fontFamily: 'Inter, sans-serif' }}
            >
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      {/* Track */}
      <div
        className={`w-full rounded-full overflow-hidden ${heights[size] || heights.md}`}
        style={{ background: '#1E3A5F' }}
      >
        {/* Fill */}
        <div
          className={`${heights[size] || heights.md} rounded-full ${animated ? 'transition-all duration-700 ease-out' : ''}`}
          style={{
            width: `${percentage}%`,
            background: fillBg,
            boxShadow: color === 'success' || color === 'primary'
              ? '0 0 8px rgba(16,185,129,0.4)'
              : color === 'accent'
              ? '0 0 8px rgba(56,189,248,0.4)'
              : undefined,
          }}
        />
      </div>
    </div>
  );
}
