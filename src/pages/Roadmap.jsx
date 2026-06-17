import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Map, CheckCircle, Zap, Shield, HelpCircle,
  Award, Star, Activity, Sparkles, BookOpen, AlertCircle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import useStore from '../store/useStore';
import { roadmaps } from '../data/roadmaps';
import { useToast } from '../components/ui/Toast';

export default function Roadmap() {
  const { career, completedSkills, toggleCompletedSkill } = useStore();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    document.title = "Skillovix | Roadmap";
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
            To generate your personalized interactive roadmap checklist, please complete the career assessment first.
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

  // Determine active level based on progress
  const beginnerSkills = activeRoadmap.beginner;
  const intermediateSkills = activeRoadmap.intermediate;
  const advancedSkills = activeRoadmap.advanced;

  const isBeginnerDone = beginnerSkills.every(s => completedList.includes(s));
  const isIntermediateDone = intermediateSkills.every(s => completedList.includes(s));

  // Determine active level
  let activeLevel = 'Beginner';
  if (isBeginnerDone) {
    if (isIntermediateDone) {
      activeLevel = 'Advanced';
    } else {
      activeLevel = 'Intermediate';
    }
  }

  // Calculate percentages
  const beginnerPercent = Math.round((beginnerSkills.filter(s => completedList.includes(s)).length / beginnerSkills.length) * 100);
  const intermediatePercent = Math.round((intermediateSkills.filter(s => completedList.includes(s)).length / intermediateSkills.length) * 100);
  const advancedPercent = Math.round((advancedSkills.filter(s => completedList.includes(s)).length / advancedSkills.length) * 100);

  const getSkillStatus = (skillName, levelName) => {
    const isCompleted = completedList.includes(skillName);
    if (isCompleted) return { label: 'Evolved', color: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30' };

    if (levelName === activeLevel) {
      return { label: 'In Progress', color: 'text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/30 animate-pulse' };
    }

    const levelsOrder = ['Beginner', 'Intermediate', 'Advanced'];
    if (levelsOrder.indexOf(levelName) > levelsOrder.indexOf(activeLevel)) {
      return { label: 'Locked', color: 'text-[#4B6A9B] bg-[#1E3A5F]/20 border-[#1E3A5F]/40' };
    }

    return { label: 'In Progress', color: 'text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/30' };
  };

  const handleToggle = (skillName) => {
    const wasCompleted = completedList.includes(skillName);
    toggleCompletedSkill(career, skillName);
    if (!wasCompleted) {
      toast(`⚡ Skillovix: ${skillName} marked as evolved!`, 'success');
    } else {
      toast(`⚡ Skillovix: ${skillName} reverted to in progress.`, 'warning');
    }
  };

  const progressData = [
    { name: 'Beginner', progress: beginnerPercent, fill: '#10B981' },
    { name: 'Intermediate', progress: intermediatePercent, fill: '#38BDF8' },
    { name: 'Advanced', progress: advancedPercent, fill: '#2563EB' }
  ];

  const renderSkillColumn = (title, skills, levelName, iconColor) => {
    const isLocked = (levelName === 'Intermediate' && !isBeginnerDone) || (levelName === 'Advanced' && !isIntermediateDone);

    return (
      <div className={`glass-card p-6 border border-[#1E3A5F] bg-[#0A1120] rounded-xl flex flex-col space-y-6 shadow-lg ${isLocked ? 'opacity-60' : ''}`}>
        <div className="flex justify-between items-center pb-3 border-b border-[#1E3A5F]">
          <div className="space-y-1 bg-transparent">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${iconColor}`} />
              {title}
            </h2>
            <p className="text-[10px] text-[#8BA5C7] uppercase tracking-wider">{levelName} Module</p>
          </div>
          {isLocked ? (
            <span className="text-[10px] uppercase font-bold text-[#4B6A9B] bg-[#1E3A5F]/30 px-2 py-0.5 rounded border border-[#1E3A5F]/40">Locked</span>
          ) : (
            <span className="text-xs font-bold text-[#38BDF8]">{skills.filter(s => completedList.includes(s)).length}/{skills.length}</span>
          )}
        </div>

        <div className="space-y-4 flex-1">
          {skills.map((skill) => {
            const status = getSkillStatus(skill, levelName);
            const isCompleted = completedList.includes(skill);
            return (
              <div
                key={skill}
                className={`p-4 rounded-xl border transition-all duration-300 flex items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-[#10B981]/5 border-[#10B981]/25 hover:border-[#10B981]/40'
                    : 'bg-[#162033]/30 border-[#1E3A5F] hover:border-[#38BDF8]/30'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => handleToggle(skill)}
                    disabled={status.label === 'Locked'}
                    className="w-4 h-4 rounded text-[#2563EB] bg-[#0A1120] border-[#1E3A5F] focus:ring-[#2563EB] focus:ring-offset-0 transition cursor-pointer disabled:cursor-not-allowed"
                  />
                  <span className={`text-xs font-bold truncate ${isCompleted ? 'text-[#8BA5C7] line-through' : 'text-white'}`}>
                    {skill}
                  </span>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${status.color} shrink-0`}>
                  {status.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 min-w-0 py-8 lg:py-12 space-y-8 text-left font-inter">


      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#1E3A5F] pb-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#38BDF8]">
            // PERSONALIZED LEARNING SYLLABUS
          </p>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="text-3xl">{activeRoadmap.emoji}</span>
            {career} Roadmap
          </h1>
          <p className="text-xs text-[#8BA5C7] mt-0.5">
            Milestones and technical skills needed to become a professional in this track
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-center px-4 py-2 rounded-full border border-[#1E3A5F] bg-[#0A1120] text-xs font-semibold text-white shadow-inner">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
          Active: <span className="text-[#38BDF8] font-bold">{activeLevel}</span>
        </div>
      </div>

      {/* 3-Column Checklist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {renderSkillColumn('Beginner Foundations', beginnerSkills, 'Beginner', 'bg-[#10B981]')}
        {renderSkillColumn('Intermediate Core', intermediateSkills, 'Intermediate', 'bg-[#38BDF8]')}
        {renderSkillColumn('Advanced Architecture', advancedSkills, 'Advanced', 'bg-[#2563EB]')}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-2">
        {/* Milestone Completion Bar Chart */}
        <div className="glass-card p-6 border border-[#1E3A5F] bg-[#0A1120] rounded-xl shadow-lg space-y-6">
          <div className="pb-2 border-b border-[#1E3A5F]/40">
            <h2 className="text-base font-bold text-white uppercase tracking-wider">Milestone Completion</h2>
            <p className="text-xs text-[#8BA5C7] mt-0.5">Percentage of skills completed in each phase</p>
          </div>
          <div className="relative min-w-0 overflow-hidden h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={progressData}
                layout="vertical"
                margin={{ top: 5, right: 10, left: 50, bottom: 5 }}
              >
                <XAxis type="number" domain={[0, 100]} stroke="#8BA5C7" fontSize={11} tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#8BA5C7" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A1120',
                    borderColor: '#1E3A5F',
                    borderRadius: '8px',
                    color: '#FFFFFF'
                  }}
                  formatter={(value) => [`${value}%`, 'Progress']}
                />
                <Bar dataKey="progress" radius={[0, 4, 4, 0]}>
                  {progressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Evolved Skills Tag Cloud */}
        <div className="glass-card p-6 border border-[#1E3A5F] bg-[#0A1120] rounded-xl shadow-lg space-y-6 flex flex-col justify-between min-h-[220px]">
          <div className="pb-2 border-b border-[#1E3A5F]/40">
            <h2 className="text-base font-bold text-white uppercase tracking-wider">Your Evolved Skills</h2>
            <p className="text-xs text-[#8BA5C7] mt-0.5">Verified tags added to your developer matrix</p>
          </div>
          <div className="flex-1 flex flex-wrap gap-3 pt-4 items-start content-start">
            {completedList.length > 0 ? (
              completedList.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#10B981]/30 bg-[#10B981]/5 text-sm text-[#10B981] font-bold shadow-sm"
                >
                  <Award size={12} className="text-[#10B981]" />
                  {skill}
                </span>
              ))
            ) : (
              <div className="w-full text-center py-8 text-[#4B6A9B] text-sm border border-dashed border-[#1E3A5F] rounded-xl flex flex-col items-center justify-center gap-2 min-h-[120px]">
                <Star size={20} className="text-[#4B6A9B]" />
                No skills completed yet. Select checkboxes above to evolve your skills!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
