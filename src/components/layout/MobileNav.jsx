import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Bot, BarChart3, User } from 'lucide-react';

const MOBILE_NAV = [
  { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Home' },
  { to: '/roadmap',   icon: <Map size={20} />,             label: 'Roadmap' },
  { to: '/mentor',    icon: <Bot size={20} />,              label: 'Mentor' },
  { to: '/readiness', icon: <BarChart3 size={20} />,        label: 'Readiness' },
  { to: '/resume',    icon: <User size={20} />,             label: 'Profile' },
];

export default function MobileNav() {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-2 py-2 safe-area-inset-bottom"
      style={{
        background: 'rgba(10,17,32,0.97)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid #1E3A5F',
        boxShadow: '0 -4px 16px rgba(37,99,235,0.08)',
      }}
    >
      <div className="flex items-center justify-around">
        {MOBILE_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200"
          >
            {({ isActive }) => (
              <>
                <span
                  className="transition-all duration-200"
                  style={{
                    color: isActive ? '#38BDF8' : '#4B6A9B',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  {item.icon}
                </span>
                <span
                  className="text-[10px] font-medium"
                  style={{ color: isActive ? '#38BDF8' : '#4B6A9B' }}
                >
                  {item.label}
                </span>
                {isActive && (
                  <span
                    className="absolute bottom-0 w-1.5 h-1.5 rounded-full"
                    style={{
                      background: '#38BDF8',
                      boxShadow: '0 0 6px #38BDF8',
                    }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
