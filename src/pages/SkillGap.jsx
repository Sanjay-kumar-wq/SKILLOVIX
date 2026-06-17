import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, CheckCircle, HelpCircle, AlertTriangle, ExternalLink,
  BookOpen, Compass, Award, Star, Zap, AlertCircle
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import useStore from '../store/useStore';
import { roadmaps } from '../data/roadmaps';

export default function SkillGap() {
  const { career, currentSkills, completedSkills } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Skillovix | Skill Gap";
  }, []);

  const activeRoadmap = career ? roadmaps[career] : null;

  if (!career) {
    return (
      <div className="p-6 lg:p-8 flex flex-col items-center justify-center min-h-[80vh] text-center max-w-2xl mx-auto space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#1E3A5F]/40 flex items-center justify-center border border-[#38BDF8]/20 shadow-[0_0_20px_rgba(56,189,248,0.1)]">
          <AlertCircle size={40} className="text-[#38BDF8]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">No Active Career Path</h1>
          <p className="text-base text-[#8BA5C7]">
            Please complete the career assessment first to check your skill gaps.
          </p>
        </div>
        <button
          onClick={() => navigate('/assessment')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-[#2563EB]/90 active:scale-95 transition-all text-white font-semibold rounded-xl shadow-[0_4px_12px_rgba(37,99,235,0.2)] cursor-pointer"
        >
          <Zap size={18} fill="white" />
          Start Career Assessment
        </button>
      </div>
    );
  }

  const completedList = completedSkills[career] || [];

  // Extract all skills from current career roadmap
  const beginnerSkills = activeRoadmap.beginner;
  const intermediateSkills = activeRoadmap.intermediate;
  const advancedSkills = activeRoadmap.advanced;
  const totalRoadmapSkills = [...beginnerSkills, ...intermediateSkills, ...advancedSkills];

  // Evolved skills are those in either assessment profile (currentSkills) OR completed lists
  const evolvedSkills = totalRoadmapSkills.filter(skill =>
    currentSkills.includes(skill) || completedList.includes(skill)
  );

  const missingSkills = totalRoadmapSkills.filter(skill =>
    !evolvedSkills.includes(skill)
  );

  const readinessScore = totalRoadmapSkills.length > 0
    ? Math.round((evolvedSkills.length / totalRoadmapSkills.length) * 100)
    : 0;

  // Recharts doughnut data
  const doughnutData = [
    { name: 'Evolved Skills', value: evolvedSkills.length, fill: '#10B981' },
    { name: 'Missing Skills', value: missingSkills.length, fill: '#1E3A5F' }
  ];

  const handleSearchResource = (skill) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent('learn ' + skill + ' ' + career)}`, '_blank');
  };

  // Recommended sequence: missing skills in order of roadmap difficulty
  const recommendedSequence = [];
  const sequenceLevels = [
    { name: 'Beginner', skills: beginnerSkills },
    { name: 'Intermediate', skills: intermediateSkills },
    { name: 'Advanced', skills: advancedSkills }
  ];

  for (const lvl of sequenceLevels) {
    for (const skill of lvl.skills) {
      if (missingSkills.includes(skill)) {
        recommendedSequence.push({ name: skill, level: lvl.name });
      }
    }
  }

  // SVGs for Gauge
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (readinessScore / 100) * circumference;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 min-w-0 py-8 lg:py-12 space-y-8 text-left font-inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#1E3A5F] pb-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#38BDF8]">
            // COMPETENCY DEFICIT TRACKER
          </p>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="text-3xl">🔍</span>
            Skill Gap Analysis
          </h1>
          <p className="text-xs text-[#8BA5C7] mt-0.5">
            Compare your current skillset with the {career} requirements to find out what to study next.
          </p>
        </div>
      </div>

      {/* Top Split: Dial & Doughnut */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-0">
        {/* Job Readiness Dial */}
        <div className="glass-card p-8 border border-[#1E3A5F] bg-[#0A1120] rounded-xl flex flex-col items-center justify-center space-y-6 shadow-lg min-h-[350px]">
          <div className="text-center pb-2 border-b border-[#1E3A5F]/40 w-full">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Job Readiness Dial</h2>
            <p className="text-[10px] text-[#8BA5C7] mt-0.5">Roadmap completion ratio</p>
          </div>

          <div className="relative flex items-center justify-center w-36 h-36">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle className="text-[#1E3A5F]" strokeWidth={stroke} stroke="currentColor" fill="transparent" r={normalizedRadius} cx={60} cy={60} />
              <circle className="text-[#38BDF8] transition-all duration-1000 ease-out" strokeWidth={stroke} strokeDasharray={circumference + ' ' + circumference} style={{ strokeDashoffset }} strokeLinecap="round" stroke="currentColor" fill="transparent" r={normalizedRadius} cx={60} cy={60} />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white">{readinessScore}%</span>
              <span className="text-[9px] uppercase font-bold text-[#8BA5C7] tracking-widest mt-0.5">Ready</span>
            </div>
          </div>

          <div className="text-center px-4">
            <p className="text-xs text-[#8BA5C7]">
              You know <span className="text-white font-bold">{evolvedSkills.length}</span> out of{' '}
              <span className="text-white font-bold">{totalRoadmapSkills.length}</span> total skills required for{' '}
              <span className="text-[#38BDF8] font-bold">{career}</span>.
            </p>
          </div>
        </div>

        {/* Skill Ratio Analysis Doughnut */}
        <div className="glass-card p-8 border border-[#1E3A5F] bg-[#0A1120] rounded-xl flex flex-col items-center justify-center space-y-6 shadow-lg overflow-hidden min-h-[350px]">
          <div className="text-center w-full pb-2 border-b border-[#1E3A5F]/40">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Skill Ratio Analysis</h2>
            <p className="text-[10px] text-[#8BA5C7] mt-0.5">Evolved capabilities vs gap metrics</p>
          </div>
          <div className="relative min-w-0 overflow-hidden h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={doughnutData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {doughnutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0A1120', borderColor: '#1E3A5F', color: '#FFF' }} />
                <Legend verticalAlign="bottom" height={24} iconType="circle" formatter={(v) => <span className="text-xs text-[#8BA5C7] font-semibold">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Layout Split: Credentials, Gaps & Sequence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Left Side: Evolved Credentials & Skill Gaps list */}
        <div className="space-y-8 min-w-0">
          {/* Evolved Credentials */}
          <div className="glass-card p-8 border border-[#1E3A5F] bg-[#0A1120] rounded-xl shadow-lg space-y-6">
            <div className="pb-2 border-b border-[#1E3A5F]/40">
              <h2 className="text-sm font-bold text-[#10B981] flex items-center gap-2">
                <CheckCircle size={16} />
                Evolved Credentials ({evolvedSkills.length})
              </h2>
              <p className="text-[10px] text-[#8BA5C7] mt-0.5">Skills you have marked complete or certified from assessment</p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2 max-h-48 overflow-y-auto pr-1">
              {evolvedSkills.length > 0 ? (
                evolvedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#10B981]/30 bg-[#10B981]/5 text-sm text-[#10B981] font-bold shadow-sm"
                  >
                    <Award size={10} />
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-[#4B6A9B] italic">No skills completed yet.</p>
              )}
            </div>
          </div>

          {/* Skill Gaps buttons list */}
          <div className="glass-card p-8 border border-[#1E3A5F] bg-[#0A1120] rounded-xl shadow-lg space-y-6">
            <div className="pb-2 border-b border-[#1E3A5F]/40">
              <h2 className="text-sm font-bold text-[#38BDF8] flex items-center gap-2">
                <Search size={16} />
                Skill Gaps ({missingSkills.length})
              </h2>
              <p className="text-[10px] text-[#8BA5C7] mt-0.5">Select a missing skill to search for tutorial resources on Google</p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2 max-h-48 overflow-y-auto pr-1">
              {missingSkills.length > 0 ? (
                missingSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => handleSearchResource(skill)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#1E3A5F] bg-[#162033]/40 text-sm text-white hover:text-[#38BDF8] hover:border-[#38BDF8]/60 transition-all cursor-pointer shadow-sm"
                  >
                    {skill}
                    <ExternalLink size={10} className="text-[#4B6A9B]" />
                  </button>
                ))
              ) : (
                <div className="w-full text-center py-6 border border-dashed border-[#1E3A5F] rounded-xl">
                  <p className="text-xs text-[#10B981] font-bold">✓ All gaps resolved! You are job ready.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Sequence sequence */}
        <div className="glass-card p-8 border border-[#1E3A5F] bg-[#0A1120] rounded-xl shadow-lg space-y-6 flex flex-col min-w-0">
          <div className="pb-2 border-b border-[#1E3A5F]/40">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen size={16} className="text-[#38BDF8]" />
              Recommended Learning Path Sequence
            </h2>
            <p className="text-xs text-[#8BA5C7] mt-0.5">Skillovix step-by-step roadmap to eliminate deficits</p>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[420px] pr-1 space-y-3 pt-2">
            {recommendedSequence.length > 0 ? (
              recommendedSequence.map((skill, index) => {
                const diffColors = {
                  Beginner: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/25',
                  Intermediate: 'text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/25',
                  Advanced: 'text-[#2563EB] bg-[#2563EB]/10 border-[#2563EB]/25'
                };

                return (
                  <button
                    key={skill.name}
                    onClick={() => handleSearchResource(skill.name)}
                    className="w-full flex items-center justify-between p-4 rounded-lg border border-[#1E3A5F] bg-[#162033]/40 text-sm text-white hover:border-[#38BDF8]/40 transition-colors text-left cursor-pointer group shadow-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-[#1E3A5F] text-[#38BDF8] font-bold flex items-center justify-center text-[10px] shrink-0">
                        {index + 1}
                      </span>
                      <span className="font-bold truncate">{skill.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${diffColors[skill.level]}`}>
                        {skill.level}
                      </span>
                      <ExternalLink size={11} className="text-[#4B6A9B] group-hover:text-white transition-colors" />
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="text-center py-12 border border-dashed border-[#1E3A5F] rounded-xl text-[#8BA5C7] text-xs">
                🎉 No deficits remaining! Your learning sequence is completed.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
