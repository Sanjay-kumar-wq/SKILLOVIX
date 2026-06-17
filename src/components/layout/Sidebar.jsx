import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Zap,
  LayoutDashboard,
  Map,
  Search,
  Briefcase,
  Bot,
  BarChart3,
  FileText,
  Scale,
  LogOut,
  ChevronRight,
  User,
} from 'lucide-react';
import useStore from '../../store/useStore';

const NAV_ITEMS = [
  { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { to: '/roadmap',   icon: <Map size={20} />,             label: 'Roadmap'   },
  { to: '/skill-gap', icon: <Search size={20} />,          label: 'Skill Gap' },
  { to: '/projects',  icon: <Briefcase size={20} />,       label: 'Projects'  },
  { to: '/mentor',    icon: <Bot size={20} />,              label: 'AI Mentor' },
  { to: '/readiness', icon: <BarChart3 size={20} />,        label: 'Readiness' },
  { to: '/resume',    icon: <FileText size={20} />,         label: 'Resume'    },
  { to: '/compare',   icon: <Scale size={20} />,            label: 'Compare'   },
  { to: '/profile',   icon: <User size={20} />,             label: 'Profile'   },
];

export default function Sidebar() {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <aside
      className="hidden lg:flex flex-col w-72 shrink-0 h-screen overflow-y-auto z-30"
      style={{
        background: '#0A1120',
        borderRight: '1px solid #1E3A5F',
        boxShadow: '1px 0 12px rgba(37,99,235,0.08)',
      }}
    >
      {/* Logo */}
      <div
        className="flex flex-col gap-1 px-6 py-6"
        style={{ borderBottom: '1px solid #1E3A5F' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #2563EB, #38BDF8)',
              boxShadow: '0 0 14px rgba(37,99,235,0.4)',
            }}
          >
            <Zap size={20} className="text-white" fill="white" />
          </div>
          <span
            className="font-bold text-xl tracking-wide text-white"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Skillovix
          </span>
        </div>
        <span
          className="text-[9px] font-semibold tracking-widest mt-1.5"
          style={{ color: '#38BDF8', fontFamily: 'Inter, sans-serif' }}
        >
          SKILL EVOLUTION INTELLIGENCE
        </span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group border-l-2
               ${isActive
                 ? 'border-l-[#2563EB] text-white'
                 : 'border-l-transparent hover:border-l-[#1E3A5F]'
               }`
            }
            style={({ isActive }) => ({
              background: isActive ? '#1E3A5F' : 'transparent',
              color: isActive ? '#ffffff' : '#8BA5C7',
            })}
          >
            {({ isActive }) => (
              <>
                <span
                  className="transition-transform duration-200 group-hover:scale-110"
                  style={{ color: isActive ? '#38BDF8' : '#4B6A9B' }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {isActive && (
                  <ChevronRight size={14} className="ml-auto" style={{ color: '#38BDF8' }} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div
        className="p-4 space-y-4"
        style={{ borderTop: '1px solid #1E3A5F' }}
      >
        {/* User Info */}
        <div
          className="p-3 flex items-center gap-3 rounded-xl"
          style={{ background: '#162033', border: '1px solid #1E3A5F' }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{
              background: 'linear-gradient(135deg, #2563EB, #38BDF8)',
              boxShadow: '0 0 8px rgba(37,99,235,0.4)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user.name || 'Skillovix User'}
            </p>
            <p className="text-[10px] truncate" style={{ color: '#38BDF8' }}>
              {user.email || ''}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="shrink-0 p-1.5 rounded-lg transition-all hover:bg-red-500/10 hover:text-red-400"
            style={{ color: '#4B6A9B' }}
          >
            <LogOut size={16} />
          </button>
        </div>

        {/* Powered by */}
        <div className="text-center">
          <span className="text-[9px] font-semibold tracking-widest" style={{ color: '#2563EB' }}>
            POWERED BY SKILLOVIX AI ⚡
          </span>
        </div>
      </div>
    </aside>
  );
}
