import React, { useState, useEffect } from 'react';
import { Zap, Plus, Trash2, Award, Briefcase, TrendingUp, Target } from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import useStore from '../store/useStore';
import { roadmaps } from '../data/roadmaps';
import { useToast } from '../components/ui/Toast';

const READINESS_LEVELS = [
  { max: 30, color: '#EF4444', emoji: '🔴', label: 'Just Starting Your Evolution' },
  { max: 50, color: '#F97316', emoji: '🟠', label: 'Evolution in Progress' },
  { max: 70, color: '#EAB308', emoji: '🟡', label: 'Evolving Fast!' },
  { max: 85, color: '#3B82F6', emoji: '🔵', label: 'Almost Evolved!' },
  { max: 100, color: '#22C55E', emoji: '🟢', label: 'Fully Evolved — Apply Now! ⚡' },
];

function getLevel(score) {
  return READINESS_LEVELS.find((l) => score <= l.max) || READINESS_LEVELS[4];
}

function ScoreCircle({ score, label, color, size = 200 }) {
  const radius = (size - 20) / 2;
  const circ = 2 * Math.PI * radius;
  const progress = Math.min(score, 100) / 100;
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(progress), 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1E3A5F"
            strokeWidth="12"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - animated)}
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-white">{Math.round(score)}</span>
          <span className="text-sm text-slate-400">/100</span>
        </div>
      </div>
      <p className="text-base font-semibold text-slate-300 text-center max-w-[160px] mt-2">{label}</p>
    </div>
  );
}

export default function Readiness() {
  const {
    career,
    currentSkills,
    completedSkills,
    projectsBuilt,
    certifications,
    addProject,
    removeProject,
    addCertification,
    removeCertification,
  } = useStore();
  const toast = useToast();

  const [projectInput, setProjectInput] = useState('');
  const [certName, setCertName] = useState('');
  const [certIssuer, setCertIssuer] = useState('');

  useEffect(() => {
    document.title = 'Skillovix | Readiness Score';
  }, []);

  const roadmap = roadmaps[career] || {};
  const allRequired = [
    ...(roadmap.beginner || []),
    ...(roadmap.intermediate || []),
    ...(roadmap.advanced || []),
  ];
  const completed = completedSkills[career] || [];

  const skillScore = allRequired.length > 0 ? Math.round((completed.length / allRequired.length) * 40) : 0;
  const projectScore = Math.min(projectsBuilt.length * 8, 25);
  const roadmapPercent = allRequired.length > 0 ? Math.round((completed.length / allRequired.length) * 100) : 0;
  const roadmapScore = Math.round((roadmapPercent / 100) * 20);
  const certScore = Math.min(certifications.length * 5, 15);
  const skillovixScore = skillScore + projectScore + roadmapScore + certScore;
  const placementScore = Math.round(skillovixScore * 0.85);

  const level = getLevel(skillovixScore);

  const scores = [
    { name: 'Skills Evolved', value: Math.round((skillScore / 40) * 100), pts: skillScore, max: 40 },
    { name: 'Projects Built', value: Math.round((projectScore / 25) * 100), pts: projectScore, max: 25 },
    { name: 'Certifications', value: Math.round((certScore / 15) * 100), pts: certScore, max: 15 },
    { name: 'Roadmap Progress', value: Math.round((roadmapScore / 20) * 100), pts: roadmapScore, max: 20 },
    { name: 'Overall', value: skillovixScore, pts: skillovixScore, max: 100 },
  ];

  const radarData = [
    { subject: 'Skills', A: Math.round((skillScore / 40) * 100) },
    { subject: 'Projects', A: Math.round((projectScore / 25) * 100) },
    { subject: 'Certs', A: Math.round((certScore / 15) * 100) },
    { subject: 'Roadmap', A: roadmapPercent },
    { subject: 'Overall', A: skillovixScore },
  ];

  // Tips
  const tipsData = [
    { area: 'Skills', value: skillScore / 40, tip: 'Mark more skills as evolved in your Skillovix Roadmap page.' },
    { area: 'Projects', value: projectScore / 25, tip: 'Add projects to your Skillovix Lab to boost your score by 8 pts each.' },
    { area: 'Certifications', value: certScore / 15, tip: 'Add certifications (AWS, Google, etc.) to increase your Skillovix score.' },
    { area: 'Roadmap', value: roadmapScore / 20, tip: 'Complete more roadmap skills in the Skillovix Roadmap page.' },
  ];
  const weakest = [...tipsData].sort((a, b) => a.value - b.value).slice(0, 2);

  const handleAddProject = () => {
    if (!projectInput.trim()) return;
    addProject(projectInput.trim());
    setProjectInput('');
    toast('⚡ Skillovix: Project added to your lab!', 'success');
  };

  const handleAddCert = () => {
    if (!certName.trim()) return;
    addCertification({ name: certName.trim(), issuer: certIssuer.trim() || 'Self' });
    setCertName('');
    setCertIssuer('');
    toast('⚡ Skillovix: Certification saved!', 'success');
  };

  const cardStyle = {
    background: '#0D1B2E',
    border: '1px solid #1E3A5F',
    borderRadius: '16px',
  };

  return (
    <div className="p-8 space-y-8 bg-[#070E1A] min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Zap className="text-yellow-400" size={32} fill="currentColor" />
          Skillovix Readiness Score
        </h1>
        <p className="text-slate-400 text-base">See how ready you are to enter the tech industry</p>
      </div>

      {/* Level badge */}
      <div
        className="flex items-center gap-6 p-6 rounded-2xl"
        style={{ background: `${level.color}15`, border: `1px solid ${level.color}40` }}
      >
        <span className="text-4xl">{level.emoji}</span>
        <div className="flex flex-col gap-1">
          <p className="text-sm text-slate-400 font-medium">Your Evolution Status</p>
          <p className="text-2xl font-bold text-white">{level.label}</p>
        </div>
        <div className="ml-auto text-right hidden sm:block">
          <p className="text-sm text-slate-400 mb-1">Skillovix Score</p>
          <p className="text-5xl font-bold" style={{ color: level.color }}>{skillovixScore}</p>
        </div>
      </div>

      {/* Two Score Circles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          className="flex flex-col items-center justify-center gap-6 p-8 rounded-2xl"
          style={cardStyle}
        >
          <p className="text-sm font-semibold text-sky-400 tracking-wider uppercase mb-2">Skillovix Internship Score</p>
          <ScoreCircle score={skillovixScore} label="Internship Readiness" color={level.color} size={200} />
          <p className="text-xs text-slate-500 text-center mt-2">Based on your skills, projects, certifications & roadmap progress</p>
        </div>
        <div
          className="flex flex-col items-center justify-center gap-6 p-8 rounded-2xl"
          style={cardStyle}
        >
          <p className="text-sm font-semibold text-purple-400 tracking-wider uppercase mb-2">Skillovix Placement Score</p>
          <ScoreCircle score={placementScore} label="Full Placement Readiness" color="#A855F7" size={200} />
          <p className="text-xs text-slate-500 text-center mt-2">Placement score accounts for industry-level benchmarks</p>
        </div>
      </div>

      {/* Breakdown Card */}
      <div className="p-6 rounded-2xl" style={cardStyle}>
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
          <Target size={20} className="text-sky-400" /> Your Skillovix Evolution Breakdown
        </h2>
        <div className="space-y-1">
          {[
            { label: 'Skills Evolved', pts: skillScore, max: 40, color: '#38BDF8' },
            { label: 'Projects Built', pts: projectScore, max: 25, color: '#A855F7' },
            { label: 'Roadmap Progress', pts: roadmapScore, max: 20, color: '#22C55E' },
            { label: 'Certifications', pts: certScore, max: 15, color: '#F59E0B' },
          ].map((row, idx, arr) => (
            <div key={row.label}>
              <div className="py-4">
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-slate-300 font-semibold text-base">{row.label}</span>
                  <span className="font-bold text-base" style={{ color: row.color }}>
                    {row.pts}/{row.max} pts
                  </span>
                </div>
                <div className="h-3 rounded-full bg-slate-800">
                  <div
                    className="h-3 rounded-full transition-all duration-700"
                    style={{ width: `${(row.pts / row.max) * 100}%`, background: row.color }}
                  />
                </div>
              </div>
              {idx < arr.length - 1 && (
                <div style={{ height: '1px', background: '#1E3A5F' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Projects + Certs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Projects */}
        <div className="p-6 rounded-2xl space-y-5" style={cardStyle}>
          <h2 className="text-base font-bold text-white flex items-center gap-2 mb-6">
            <Briefcase size={18} className="text-purple-400" />
            Add Projects to Your Skillovix Lab
          </h2>
          <div className="flex gap-3">
            <input
              value={projectInput}
              onChange={(e) => setProjectInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddProject()}
              placeholder="e.g. E-commerce App"
              className="flex-1 px-3 py-3 rounded-lg text-sm text-white placeholder-slate-500 outline-none w-full"
              style={{ background: '#162033', border: '1px solid #1E3A5F' }}
            />
            <button
              onClick={handleAddProject}
              className="px-6 py-3 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105 flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}
            >
              <Plus size={16} /> Add to Lab
            </button>
          </div>
          <div className="space-y-3">
            {projectsBuilt.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-3">No projects added yet. Start building! 🛠️</p>
            )}
            {projectsBuilt.map((p, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 py-3 rounded-lg"
                style={{ background: '#162033', border: '1px solid #1E3A5F' }}
              >
                <span className="text-sm text-slate-200 flex items-center gap-2">
                  <Briefcase size={14} className="text-purple-400" /> {p}
                </span>
                <button
                  onClick={() => { removeProject(i); toast('Project removed', 'warning'); }}
                  className="text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="p-6 rounded-2xl space-y-5" style={cardStyle}>
          <h2 className="text-base font-bold text-white flex items-center gap-2 mb-6">
            <Award size={18} className="text-amber-400" />
            Add Certifications to Skillovix
          </h2>
          <div className="space-y-3">
            <input
              value={certName}
              onChange={(e) => setCertName(e.target.value)}
              placeholder="e.g. AWS Cloud Practitioner"
              className="w-full px-3 py-3 rounded-lg text-sm text-white placeholder-slate-500 outline-none"
              style={{ background: '#162033', border: '1px solid #1E3A5F' }}
            />
            <div className="flex gap-3">
              <input
                value={certIssuer}
                onChange={(e) => setCertIssuer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCert()}
                placeholder="Issuer (e.g. Amazon)"
                className="flex-1 px-3 py-3 rounded-lg text-sm text-white placeholder-slate-500 outline-none"
                style={{ background: '#162033', border: '1px solid #1E3A5F' }}
              />
              <button
                onClick={handleAddCert}
                className="px-6 py-3 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105 flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #D97706, #F59E0B)' }}
              >
                <Plus size={16} /> Add
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {certifications.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-3">No certifications yet. Get certified! 🏆</p>
            )}
            {certifications.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 py-3 rounded-lg"
                style={{ background: '#162033', border: '1px solid #1E3A5F' }}
              >
                <div>
                  <p className="text-sm text-slate-200 font-medium flex items-center gap-2">
                    <Award size={14} className="text-amber-400" /> {c.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{c.issuer}</p>
                </div>
                <button
                  onClick={() => { removeCertification(i); toast('Certification removed', 'warning'); }}
                  className="text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div
        className="p-6 rounded-2xl space-y-4"
        style={{ ...cardStyle, border: '1px solid #1E3A5F', background: 'linear-gradient(135deg, #0D1B2E, #101f35)' }}
      >
        <h2 className="text-base font-bold text-white flex items-center gap-2 mb-6">
          <Zap size={18} className="text-yellow-400" fill="currentColor" />
          ⚡ Skillovix Tips to Evolve Faster
        </h2>
        <div className="space-y-3">
          {weakest.map((w) => (
            <div
              key={w.area}
              className="flex items-start gap-3 p-4 rounded-xl"
              style={{ background: '#162033', border: '1px solid #1E3A5F' }}
            >
              <TrendingUp size={16} className="text-sky-400 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300">{w.tip}</p>
            </div>
          ))}
          {skillovixScore >= 85 && (
            <div
              className="flex items-start gap-3 p-4 rounded-xl"
              style={{ background: '#14281f', border: '1px solid #22C55E40' }}
            >
              <Zap size={16} className="text-emerald-400 shrink-0 mt-0.5" fill="currentColor" />
              <p className="text-sm text-emerald-300 font-medium">
                You're fully evolved! Start applying to jobs and internships now. Your Skillovix score is impressive! 🚀
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Radar Chart */}
      <div className="p-6 rounded-2xl" style={cardStyle}>
        <h2 className="text-base font-bold text-white flex items-center gap-2 mb-6">
          <Target size={18} className="text-sky-400" />
          Your Skillovix Evolution Radar
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#1E3A5F" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#8BA5C7', fontSize: 12 }} />
            <Radar
              name="Readiness"
              dataKey="A"
              stroke="#38BDF8"
              fill="#38BDF8"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
