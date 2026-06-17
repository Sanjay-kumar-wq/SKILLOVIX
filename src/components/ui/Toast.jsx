import React, { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { X, Zap, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const icons = {
    success: <CheckCircle size={16} className="text-emerald-400 shrink-0" />,
    warning: <AlertTriangle size={16} className="text-amber-400 shrink-0" />,
    error: <XCircle size={16} className="text-red-400 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/30',
    warning: 'border-amber-500/30',
    error: 'border-red-500/30',
  };

  return (
    <div
      className="pointer-events-auto"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(40px)',
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${borders[toast.type]}`}
        style={{
          background: 'linear-gradient(135deg, #0D1B2E, #162033)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(37,99,235,0.15)',
          minWidth: '280px',
          maxWidth: '380px',
        }}
      >
        <Zap size={14} className="text-blue-400 shrink-0" fill="currentColor" />
        {icons[toast.type]}
        <p className="text-sm text-white flex-1 font-medium">{toast.message}</p>
        <button
          onClick={() => onRemove(toast.id)}
          className="shrink-0 text-slate-400 hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx.addToast;
}
