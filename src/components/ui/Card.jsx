import React from 'react';

export default function Card({
  children,
  className = '',
  hover = false,
  glass = false,
  padding = true,
}) {
  return (
    <div
      className={`
        rounded-2xl transition-all duration-200
        ${hover ? 'cursor-pointer hover:-translate-y-1' : ''}
        ${padding ? 'p-6' : ''}
        ${className}
      `}
      style={{
        background: '#0A1120',
        border: '1px solid #1E3A5F',
        ...(hover
          ? {
              ':hover': {
                borderColor: 'rgba(37,99,235,0.45)',
                boxShadow: '0 0 16px rgba(37,99,235,0.1)',
              },
            }
          : {}),
      }}
    >
      {children}
    </div>
  );
}
