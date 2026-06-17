import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, User, Mail, Target, Edit3, RotateCcw, LogOut } from 'lucide-react';
import useStore from '../store/useStore';

export default function Profile() {
  const { user, career, logout, setAssessmentData } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Skillovix | My Profile';
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleReset = () => {
    if (window.confirm('Reset all Skillovix progress? This cannot be undone.')) {
      setAssessmentData({ career: '', currentSkills: [], experienceLevel: '', studyHours: 10 });
      navigate('/assessment');
    }
  };

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const cardStyle = {
    background: '#0D1B2E',
    border: '1px solid #1E3A5F',
    borderRadius: '16px',
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6 bg-[#070E1A] min-h-screen">
      <h1 className="text-3xl font-bold text-white flex items-center gap-3">
        <User size={28} className="text-sky-400" />
        My Skillovix Profile
      </h1>

      {/* Avatar card */}
      <div className="p-8 rounded-2xl flex flex-col items-center gap-4 text-center" style={cardStyle}>
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black text-white"
          style={{
            background: 'linear-gradient(135deg, #2563EB, #38BDF8)',
            boxShadow: '0 0 30px rgba(37,99,235,0.5)',
          }}
        >
          {initials}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{user.name || 'Skillovix User'}</h2>
          <p className="text-slate-400 text-sm mt-1 flex items-center justify-center gap-2">
            <Mail size={14} /> {user.email || 'No email set'}
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Zap size={14} className="text-yellow-400" fill="currentColor" />
            <span className="text-sm font-semibold text-sky-400">
              {career ? `Career: ${career}` : 'No career set yet'}
            </span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-6 rounded-2xl space-y-4" style={cardStyle}>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Profile Details</h3>
        {[
          { icon: <User size={16} />, label: 'Name', value: user.name || '—' },
          { icon: <Mail size={16} />, label: 'Email', value: user.email || '—' },
          { icon: <Target size={16} />, label: 'Career Goal', value: career || 'Not set' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#162033' }}>
            <span className="text-sky-400">{item.icon}</span>
            <span className="text-slate-400 text-sm w-24">{item.label}</span>
            <span className="text-white text-sm font-medium flex-1">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={() => navigate('/assessment')}
          className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-semibold text-white transition-all hover:scale-[1.02]"
          style={{ background: 'linear-gradient(135deg, #2563EB, #38BDF8)', boxShadow: '0 0 20px rgba(37,99,235,0.3)' }}
        >
          <Edit3 size={18} /> Edit Career Goal
        </button>


        <button
          onClick={handleReset}
          className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-semibold text-amber-400 transition-all hover:scale-[1.02]"
          style={{ background: '#2a1f0a', border: '1px solid #F59E0B40' }}
        >
          <RotateCcw size={18} /> Reset Skillovix Progress
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-semibold text-red-400 transition-all hover:scale-[1.02]"
          style={{ background: '#2a1010', border: '1px solid #EF444440' }}
        >
          <LogOut size={18} /> Logout from Skillovix
        </button>
      </div>

      {/* Footer branding */}
      <div className="text-center pt-4">
        <p className="text-xs text-slate-600 flex items-center justify-center gap-1">
          <Zap size={10} className="text-blue-600" fill="currentColor" />
          Powered by Skillovix AI ⚡
        </p>
      </div>
    </div>
  );
}
