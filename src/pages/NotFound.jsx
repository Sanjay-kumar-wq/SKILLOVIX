import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Home } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Skillovix | 404 — Page Not Found';
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-8 p-8 text-center"
      style={{ background: '#070E1A' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #2563EB, #38BDF8)',
            boxShadow: '0 0 20px rgba(37,99,235,0.5)',
          }}
        >
          <Zap size={24} className="text-white" fill="white" />
        </div>
        <span className="text-2xl font-bold text-white">Skillovix</span>
      </div>

      {/* Big 404 */}
      <div>
        <p
          className="text-8xl font-black"
          style={{
            background: 'linear-gradient(135deg, #2563EB, #38BDF8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </p>
        <h1 className="text-2xl font-bold text-white mt-4">
          ⚡ Oops! This page hasn't evolved yet.
        </h1>
        <p className="text-slate-400 mt-2 max-w-md mx-auto">
          The page you're looking for doesn't exist in the Skillovix universe. Let's get you back on track!
        </p>
      </div>

      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white transition-all hover:scale-105"
        style={{
          background: 'linear-gradient(135deg, #2563EB, #38BDF8)',
          boxShadow: '0 0 24px rgba(37,99,235,0.4)',
        }}
      >
        <Home size={18} />
        Back to Skillovix Dashboard
      </button>

      <p className="text-xs text-slate-600">
        POWERED BY SKILLOVIX AI ⚡
      </p>
    </div>
  );
}
