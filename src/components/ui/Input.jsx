import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(function Input(
  {
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    icon,
    className = '',
    required,
    disabled,
    hint,
    id,
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold tracking-wider uppercase"
          style={{ color: '#38BDF8', fontFamily: 'Inter, sans-serif' }}
        >
          {label}
          {required && <span className="ml-1" style={{ color: '#EF4444' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {/* Left icon — pinned 14px from left, vertically centred */}
        {icon && (
          <span
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4B6A9B',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            {icon}
          </span>
        )}

        <input
          id={id}
          ref={ref}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className="w-full rounded-xl text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: '#0A1120',
            border: error ? '1px solid #EF4444' : '1px solid #1E3A5F',
            color: '#FFFFFF',
            fontFamily: 'Inter, sans-serif',
            outline: 'none',
            boxShadow: 'none',
            paddingTop: '12px',
            paddingBottom: '12px',
            // push text clear of the left icon (icon at 14px, icon is 16px wide → ends at 30px; +10px gap = 40px)
            paddingLeft: icon ? '44px' : '16px',
            // push text clear of the right eye button
            paddingRight: isPassword ? '44px' : '16px',
          }}
          onFocus={(e) => {
            e.target.style.border = error ? '1px solid #EF4444' : '1px solid #2563EB';
            e.target.style.boxShadow = error
              ? '0 0 0 3px rgba(239,68,68,0.15)'
              : '0 0 0 3px rgba(37,99,235,0.2)';
          }}
          onBlur={(e) => {
            e.target.style.border = error ? '1px solid #EF4444' : '1px solid #1E3A5F';
            e.target.style.boxShadow = 'none';
          }}
        />

        {/* Eye toggle — pinned 14px from right, vertically centred */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4B6A9B',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#38BDF8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#4B6A9B')}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && (
        <p
          className="text-xs font-medium mt-1 animate-slide-down"
          style={{ color: '#EF4444', fontFamily: 'Inter, sans-serif' }}
        >
          {error}
        </p>
      )}
      {hint && !error && (
        <p
          className="text-[10px]"
          style={{ color: '#4B6A9B', fontFamily: 'Inter, sans-serif' }}
        >
          {hint}
        </p>
      )}
    </div>
  );
});

export default Input;
