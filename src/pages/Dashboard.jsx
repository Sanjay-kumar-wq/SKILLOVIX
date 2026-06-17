import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap, Briefcase, CheckCircle, Map, Search, Bot,
  ArrowRight, Clock, TrendingUp, Calendar, AlertCircle,
  Flame, Gauge, Award, ShieldAlert, Sparkles, BookOpen, CheckCircle2
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import useStore from '../store/useStore';
import { roadmaps } from '../data/roadmaps';
import { careerData } from '../data/careerData';
import { useToast } from '../components/ui/Toast';

export default function Dashboard() {
  const { user, career, currentSkills, completedSkills, toggleCompletedSkill } = useStore();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    document.title = "Skillovix | Dashboard";
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const activeRoadmap = career ? roadmaps[career] : null;
  const activeStats = career ? careerData[career] : null;

  if (!career) {
    return (
      <div className="p-6 lg:p-8 flex flex-col items-center justify-center min-h-[80vh] text-center max-w-2xl mx-auto space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#1E3A5F]/40 flex items-center justify-center border border-[#38BDF8]/20 shadow-[0_0_20px_rgba(56,189,248,0.1)]">
          <AlertCircle size={40} className="text-[#38BDF8]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">Initialize Your Skillovix Profile</h1>
          <p className="text-base text-[#8BA5C7]">
            Welcome to <span className="font-bold text-white">Skillovix</span>! To generate your personalized learning roadmap, gap analysis, and tailored dashboard, you first need to complete the career assessment.
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

  // Calculate statistics
  const totalSkills = activeRoadmap
    ? activeRoadmap.beginner.length + activeRoadmap.intermediate.length + activeRoadmap.advanced.length
    : 0;

  const completedList = completedSkills[career] || [];
  const completedCount = completedList.length;
  const remainingCount = Math.max(0, totalSkills - completedCount);
  const progressPercent = totalSkills > 0 ? Math.round((completedCount / totalSkills) * 100) : 0;

  // Calculate progress by level
  const beginnerCount = activeRoadmap ? activeRoadmap.beginner.length : 0;
  const intermediateCount = activeRoadmap ? activeRoadmap.intermediate.length : 0;
  const advancedCount = activeRoadmap ? activeRoadmap.advanced.length : 0;

  const beginnerCompleted = activeRoadmap
    ? activeRoadmap.beginner.filter(s => completedList.includes(s)).length
    : 0;
  const intermediateCompleted = activeRoadmap
    ? activeRoadmap.intermediate.filter(s => completedList.includes(s)).length
    : 0;
  const advancedCompleted = activeRoadmap
    ? activeRoadmap.advanced.filter(s => completedList.includes(s)).length
    : 0;

  const beginnerPercent = beginnerCount > 0 ? Math.round((beginnerCompleted / beginnerCount) * 100) : 0;
  const intermediatePercent = intermediateCount > 0 ? Math.round((intermediateCompleted / intermediateCount) * 100) : 0;
  const advancedPercent = advancedCount > 0 ? Math.round((advancedCompleted / advancedCount) * 100) : 0;

  // Calculate next 3 uncompleted skills
  const nextSkills = [];
  const levels = [
    { name: 'Beginner', skills: activeRoadmap.beginner },
    { name: 'Intermediate', skills: activeRoadmap.intermediate },
    { name: 'Advanced', skills: activeRoadmap.advanced }
  ];

  for (const lvl of levels) {
    for (const skill of lvl.skills) {
      if (!completedList.includes(skill)) {
        nextSkills.push({ name: skill, level: lvl.name });
        if (nextSkills.length >= 3) break;
      }
    }
    if (nextSkills.length >= 3) break;
  }

  // Job readiness score
  const allSkills = [...activeRoadmap.beginner, ...activeRoadmap.intermediate, ...activeRoadmap.advanced];
  const evolvedSkills = allSkills.filter(skill =>
    currentSkills.includes(skill) || completedList.includes(skill)
  );
  const readinessScore = allSkills.length > 0
    ? Math.round((evolvedSkills.length / allSkills.length) * 100)
    : 0;

  // Study hours total (mon-sun)
  const weeklyData = [
    { day: 'Mon', hours: 2 },
    { day: 'Tue', hours: 1 },
    { day: 'Wed', hours: 3 },
    { day: 'Thu', hours: 0 },
    { day: 'Fri', hours: 2 },
    { day: 'Sat', hours: 4 },
    { day: 'Sun', hours: 1 },
  ];
  const totalWeeklyHours = weeklyData.reduce((acc, curr) => acc + curr.hours, 0);

  const handleCompleteSkill = (skillName) => {
    toggleCompletedSkill(career, skillName);
    toast(`⚡ Skillovix: ${skillName} marked as evolved!`, 'success');
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 min-w-0 py-8 lg:py-12 space-y-8 text-left font-inter">


      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#1E3A5F] pb-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#38BDF8]">
            // NETWORK NODE ACTIVE
          </p>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            {getGreeting()}, {user.name || 'Demo Student'}! ⚡
          </h1>
          <p className="text-xs text-[#8BA5C7] flex items-center gap-1.5 mt-0.5">
            <Calendar size={13} className="text-[#38BDF8]" />
            {currentDate}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-center px-4 py-2 rounded-full border border-[#1E3A5F] bg-[#0A1120] text-xs font-semibold text-white shadow-inner">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          Target: <span className="text-[#38BDF8] font-bold">{career}</span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Target Career */}
        <div className="glass-card p-6 min-h-[130px] border border-[#1E3A5F] bg-[#0A1120] rounded-xl flex items-center justify-between shadow-lg">
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] font-bold uppercase text-[#4B6A9B]">Target Career</span>
            <p className="text-base font-black text-white truncate">{career}</p>
            <span className="text-[10px] text-[#8BA5C7] block truncate">{activeStats?.demand || 'Very High'}</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/25 flex items-center justify-center text-[#2563EB] shrink-0">
            <Briefcase size={20} />
          </div>
        </div>

        {/* Roadmap Evolved */}
        <div className="glass-card p-6 min-h-[130px] border border-[#1E3A5F] bg-[#0A1120] rounded-xl flex items-center justify-between shadow-lg">
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] font-bold uppercase text-[#4B6A9B]">Roadmap Evolved</span>
            <p className="text-2xl font-black text-[#38BDF8]">{progressPercent}%</p>
            <span className="text-[10px] text-[#8BA5C7] block">{completedCount} of {totalSkills} skills</span>
          </div>
          <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" stroke="#1E3A5F" strokeWidth="3.5" fill="none" />
              <circle cx="18" cy="18" r="16" stroke="#38BDF8" strokeWidth="3.5" strokeDasharray={`${progressPercent}, 100`} fill="none" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Evolved Skills */}
        <div className="glass-card p-6 min-h-[130px] border border-[#1E3A5F] bg-[#0A1120] rounded-xl flex items-center justify-between shadow-lg">
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] font-bold uppercase text-[#4B6A9B]">Evolved Skills</span>
            <p className="text-2xl font-black text-white">{completedCount}</p>
            <span className="text-[10px] text-[#8BA5C7] block">Added to credentials</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 border border-[#10B981]/25 flex items-center justify-center text-[#10B981] shrink-0">
            <CheckCircle2 size={20} />
          </div>
        </div>

        {/* Remaining Skills */}
        <div className="glass-card p-6 min-h-[130px] border border-[#1E3A5F] bg-[#0A1120] rounded-xl flex items-center justify-between shadow-lg">
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] font-bold uppercase text-[#4B6A9B]">Remaining Skills</span>
            <p className="text-2xl font-black text-white">{remainingCount}</p>
            <span className="text-[10px] text-[#8BA5C7] block">Left to complete roadmap</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/25 flex items-center justify-center text-[#38BDF8] shrink-0">
            <Zap size={20} />
          </div>
        </div>
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column (Milestones & Weekly Activity) */}
        <div className="xl:col-span-2 space-y-8 min-w-0">
          {/* Progress by Milestone */}
          <div className="glass-card p-6 border border-[#1E3A5F] bg-[#0A1120] rounded-xl shadow-lg space-y-6">
            <div className="pb-2 border-b border-[#1E3A5F]/40">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Progress by Milestone</h3>
              <p className="text-[10px] text-[#8BA5C7] mt-0.5">Tracking career transition readiness levels</p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#8BA5C7]">
                  <span>Beginner Foundations</span>
                  <span className="text-white">{beginnerPercent}%</span>
                </div>
                <div className="w-full h-[10px] rounded-full bg-[#1E3A5F] overflow-hidden">
                  <div className="h-full bg-[#10B981] rounded-full transition-all duration-500" style={{ width: `${beginnerPercent}%` }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#8BA5C7]">
                  <span>Intermediate Competencies</span>
                  <span className="text-white">{intermediatePercent}%</span>
                </div>
                <div className="w-full h-[10px] rounded-full bg-[#1E3A5F] overflow-hidden">
                  <div className="h-full bg-[#10B981] rounded-full transition-all duration-500" style={{ width: `${intermediatePercent}%` }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#8BA5C7]">
                  <span>Advanced Architecture</span>
                  <span className="text-white">{advancedPercent}%</span>
                </div>
                <div className="w-full h-[10px] rounded-full bg-[#1E3A5F] overflow-hidden">
                  <div className="h-full bg-[#10B981] rounded-full transition-all duration-500" style={{ width: `${advancedPercent}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Activity */}
          <div className="glass-card p-6 border border-[#1E3A5F] bg-[#0A1120] rounded-xl shadow-lg space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Weekly Activity</h3>
                <p className="text-[10px] text-[#8BA5C7] mt-0.5 font-medium">Gained XP / study hours per day</p>
              </div>
              <span className="px-2.5 py-1 bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 rounded-lg text-[10px] font-bold flex items-center gap-1">
                <Clock size={11} /> {totalWeeklyHours} Hours Total
              </span>
            </div>

            <div className="relative min-w-0 overflow-hidden h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 5, left: -25, bottom: 5 }}>
                  <XAxis dataKey="day" stroke="#4B6A9B" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#4B6A9B" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0A1120', borderColor: '#1E3A5F', color: '#FFF' }} />
                  <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                    {weeklyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.hours > 0 ? '#2563EB' : '#1E3A5F'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column (Checklist, Readiness score, Quick Actions) */}
        <div className="space-y-8 min-w-0">
          {/* Next Up in Roadmap */}
          <div className="glass-card p-6 border border-[#1E3A5F] bg-[#0A1120] rounded-xl shadow-lg space-y-6">
            <div className="pb-2 border-b border-[#1E3A5F]/40">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Next Up in Roadmap</h3>
              <p className="text-[10px] text-[#8BA5C7] mt-0.5">Evolve these skills to bridge gaps</p>
            </div>

            <div className="space-y-4">
              {nextSkills.length > 0 ? (
                nextSkills.map((skill) => (
                  <div
                    key={skill.name}
                    className="p-4 rounded-xl border border-[#1E3A5F] bg-[#162033]/50 flex items-center justify-between gap-4 hover:border-[#38BDF8]/40 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{skill.name}</p>
                      <span className="inline-block text-[9px] font-semibold text-[#8BA5C7] mt-0.5">
                        {skill.level}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCompleteSkill(skill.name)}
                      className="px-3.5 py-1.5 bg-[#2563EB] hover:bg-[#2563EB]/90 transition-colors text-white text-[10px] font-bold rounded-lg cursor-pointer shrink-0 shadow-md"
                    >
                      Complete
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 border border-dashed border-[#1E3A5F] rounded-xl">
                  <p className="text-xs text-[#10B981] font-bold">✓ Path Fully Completed</p>
                  <p className="text-[10px] text-[#8BA5C7] mt-1">Excellent work! You are job ready.</p>
                </div>
              )}
            </div>
          </div>

          {/* Job Readiness Indicator */}
          <div className="glass-card p-6 border border-[#1E3A5F] bg-[#0A1120] rounded-xl shadow-lg space-y-6">
            <div className="pb-2 border-b border-[#1E3A5F]/40">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Job Readiness Indicator</h3>
              <p className="text-[10px] text-[#8BA5C7] mt-0.5">Skillovix AI-guided career suitability score</p>
            </div>

            <div className="flex items-center gap-6 py-2">
              <div className="relative flex items-center justify-center w-20 h-20 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#1E3A5F" strokeWidth="8.5" fill="none" />
                  <circle cx="50" cy="50" r="40" stroke="#10B981" strokeWidth="8.5" strokeDasharray={`${2 * Math.PI * 40}`} strokeDashoffset={`${2 * Math.PI * 40 * (1 - readinessScore / 100)}`} strokeLinecap="round" fill="none" className="transition-all duration-1000" />
                </svg>
                <span className="absolute text-base font-black text-white">{readinessScore}%</span>
              </div>

              <p className="text-xs text-[#8BA5C7] leading-relaxed">
                {readinessScore < 30
                  ? "Keep going! Start evolving basic skills in your roadmap to unlock interview readiness."
                  : readinessScore < 70
                    ? "Great progress! Your technical foundations are solidifying. Focus on intermediate topics."
                    : "Outstanding! You have strong roadmap evidence. You are highly ready for recruiter screens."}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-6 border border-[#1E3A5F] bg-[#0A1120] rounded-xl shadow-lg space-y-4">
            <div className="pb-1 border-b border-[#1E3A5F]/40">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-1">Quick Actions</h3>
            </div>

            <button
              onClick={() => navigate('/roadmap')}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-[#1E3A5F] bg-[#162033]/40 text-xs text-[#8BA5C7] hover:text-white hover:border-[#38BDF8]/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Map size={14} className="text-[#38BDF8]" />
                <span className="font-bold">Explore Roadmap</span>
              </div>
              <ArrowRight size={13} className="text-[#4B6A9B] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/skill-gap')}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-[#1E3A5F] bg-[#162033]/40 text-xs text-[#8BA5C7] hover:text-white hover:border-[#38BDF8]/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Search size={14} className="text-[#38BDF8]" />
                <span className="font-bold">Skill Gap Analysis</span>
              </div>
              <ArrowRight size={13} className="text-[#4B6A9B] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/projects')}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-[#1E3A5F] bg-[#162033]/40 text-xs text-[#8BA5C7] hover:text-white hover:border-[#38BDF8]/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Briefcase size={14} className="text-[#38BDF8]" />
                <span className="font-bold">Project Recs</span>
              </div>
              <ArrowRight size={13} className="text-[#4B6A9B] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
