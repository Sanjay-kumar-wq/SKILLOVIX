import React from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

export default function Navbar({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0F1929] text-white">
      <Sidebar />

      <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden pb-20 lg:pb-0">
        {children}
      </main>

      <MobileNav />
    </div>
  );
}
