import React, { useEffect } from 'react';
import { Zap } from 'lucide-react';

// Generic coming soon page for Mission 2 features with cyberpunk styling
export default function ComingSoon({ title, icon, desc }) {
  
  useEffect(() => {
    document.title = `SKILLOVIX ⚡ | ${title ? title.toUpperCase() : 'COMING SOON'}`;
  }, [title]);

  return (
    <div className="flex items-center justify-center min-h-[70vh] p-6 relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-neon-purple/5 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-neon-cyan/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1.5s' }} />

      <div className="glass-card max-w-md w-full p-8 border-neon-purple/30 text-center space-y-6 shadow-[0_0_25px_rgba(168,85,247,0.15)] relative z-10">
        <div className="w-20 h-20 rounded-2xl bg-cyber-surface/60 border border-cyber-border shadow-inner flex items-center justify-center mx-auto text-4xl shadow-[0_0_15px_rgba(0,255,240,0.1)]">
          {icon || '🚀'}
        </div>

        <div className="space-y-2">
          <h1 className="font-cyber font-black text-xl text-white uppercase tracking-wider leading-snug drop-shadow-[0_0_5px_rgba(255,255,255,0.15)]">
            {title}
          </h1>
          <p className="text-xs font-cyber text-neon-cyan tracking-widest uppercase">// STAGE_PENDING_UPGRADE</p>
        </div>

        <p className="text-sm font-rajdhani font-semibold text-slate-300 leading-relaxed uppercase tracking-wider border-t border-cyber-border/40 pt-4">
          {desc || 'This sub-matrix module is scheduled for connection in the next epoch. Please standby.'}
        </p>

        <div className="pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neon-purple/40 bg-neon-purple/5 text-neon-purple text-xs font-cyber tracking-widest shadow-[0_0_10px_rgba(168,85,247,0.15)] animate-pulse mx-auto">
            <Zap size={12} fill="currentColor" />
            MISSION_02_PROTOCOL
          </div>
        </div>
      </div>
    </div>
  );
}
