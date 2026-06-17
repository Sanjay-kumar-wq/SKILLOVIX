import React from 'react';

const BASE =
  'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 active:scale-95 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer';

const variants = {
  primary:   'cyber-btn',
  secondary: 'text-white hover:brightness-110',
  outline:   'cyber-btn-outline',
  ghost:     'border border-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white transition-all',
  danger:    'text-white bg-red-600 hover:bg-red-700',
  success:   'text-white bg-[#10B981] hover:bg-[#059669]',
};

const variantStyle = {
  secondary: { background: '#162033', border: '1px solid #1E3A5F', color: '#8BA5C7' },
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3 rounded-xl',
  xl: 'px-10 py-4 text-base rounded-2xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconRight,
  className = '',
  onClick,
  type = 'button',
  fullWidth = false,
  style = {},
}) {
  const inlineStyle = variantStyle[variant] ? { ...variantStyle[variant], ...style } : style;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={inlineStyle}
      className={`
        ${BASE}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading ? (
        <span
          className="spinner"
          style={{ borderColor: 'rgba(255,255,255,0.25)', borderTopColor: '#fff' }}
        />
      ) : icon ? (
        <span className="shrink-0" style={{ color: '#38BDF8' }}>{icon}</span>
      ) : null}
      {children}
      {iconRight && !loading && (
        <span className="shrink-0" style={{ color: '#38BDF8' }}>{iconRight}</span>
      )}
    </button>
  );
}
