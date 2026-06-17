import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, FileText, Zap, CheckCircle, XCircle, RotateCcw, Eye, EyeOff } from 'lucide-react';
import useStore from '../store/useStore';
import { roadmaps } from '../data/roadmaps';

const SKILL_KEYWORDS = {
  'Full Stack Developer': ['html', 'css', 'javascript', 'react', 'node', 'express', 'mongodb', 'sql', 'typescript', 'git', 'rest api', 'docker'],
  'Frontend Developer': ['html', 'css', 'javascript', 'react', 'typescript', 'tailwind', 'redux', 'next.js', 'vue', 'angular', 'figma'],
  'Backend Developer': ['python', 'node.js', 'express', 'sql', 'postgresql', 'mongodb', 'redis', 'docker', 'rest api', 'authentication', 'microservices'],
  'Data Scientist': ['python', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'sql', 'machine learning', 'deep learning', 'data visualization', 'nlp'],
  'AI/ML Engineer': ['python', 'tensorflow', 'pytorch', 'scikit-learn', 'nlp', 'deep learning', 'computer vision', 'mlops', 'aws', 'model deployment'],
  'Cybersecurity Analyst': ['linux', 'python', 'networking', 'penetration testing', 'ethical hacking', 'wireshark', 'owasp', 'cryptography', 'siem', 'incident response'],
  'Cloud Engineer': ['aws', 'azure', 'gcp', 'kubernetes', 'docker', 'terraform', 'linux', 'python', 'networking', 's3', 'ec2', 'lambda'],
  'DevOps Engineer': ['docker', 'kubernetes', 'ci/cd', 'jenkins', 'github actions', 'terraform', 'aws', 'linux', 'python', 'bash', 'prometheus'],
  'Mobile App Developer': ['react native', 'flutter', 'dart', 'swift', 'kotlin', 'javascript', 'firebase', 'rest api', 'sqlite', 'android', 'ios'],
};

function getRequiredSkills(career) {
  return SKILL_KEYWORDS[career] || ['javascript', 'python', 'git', 'sql', 'react', 'node.js'];
}

function calcAtsScore(text, career) {
  const t = text.toLowerCase();
  const checks = {
    hasSummary: /(summary|objective|profile|about)/i.test(t) ? 10 : 0,
    hasExperience: /(experience|work history|employment|intern)/i.test(t) ? 15 : 0,
    hasEducation: /(education|degree|university|college|b\.tech|btech|bachelor)/i.test(t) ? 15 : 0,
    hasProjects: /(project|portfolio|built|developed|created)/i.test(t) ? 15 : 0,
    hasSkills: /(skills|technologies|tech stack|proficient)/i.test(t) ? 10 : 0,
    hasGithub: /github/i.test(t) ? 5 : 0,
    hasLinkedin: /linkedin/i.test(t) ? 5 : 0,
  };
  const required = getRequiredSkills(career);
  const found = required.filter((s) => t.includes(s.toLowerCase()));
  const keywordScore = Math.round((found.length / required.length) * 25);
  const total = Object.values(checks).reduce((a, b) => a + b, 0) + keywordScore;
  return { total: Math.min(total, 100), checks, keywordScore, foundSkills: found, missingSkills: required.filter((s) => !t.includes(s.toLowerCase())) };
}

async function parsePdf(file) {
  // Dynamic import of pdf.js
  try {
    const pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
    // fallback: just read as text
  } catch {}
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsText(file);
  });
}

export default function Resume() {
  const { career } = useStore();
  const [dragOver, setDragOver] = useState(false);
  const [mode, setMode] = useState('upload'); // 'upload' | 'paste'
  const [pasteText, setPasteText] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.title = 'Skillovix | Resume Analyzer';
  }, []);

  const processFile = async (file) => {
    setLoading(true);
    setFileName(file.name);
    try {
      let text = '';
      if (file.type === 'application/pdf') {
        // Try to read PDF as text (basic extraction)
        text = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            // Extract readable text from PDF binary
            const binary = e.target.result;
            // Basic text extraction from PDF
            const matches = binary.match(/\(([^)]+)\)/g) || [];
            const extracted = matches
              .map((m) => m.slice(1, -1))
              .filter((s) => /[a-zA-Z]/.test(s) && s.length > 2)
              .join(' ');
            resolve(extracted || binary.replace(/[^\x20-\x7E\n]/g, ' '));
          };
          reader.readAsBinaryString(file);
        });
      } else {
        text = await file.text();
      }
      setResumeText(text);
      setResult(calcAtsScore(text, career));
    } catch {
      setResumeText('');
      setResult(null);
    }
    setLoading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handlePasteAnalyze = () => {
    if (!pasteText.trim()) return;
    setResumeText(pasteText);
    setResult(calcAtsScore(pasteText, career));
  };

  const reset = () => {
    setResult(null);
    setResumeText('');
    setFileName('');
    setPasteText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const cardStyle = {
    background: '#0D1B2E',
    border: '1px solid #1E3A5F',
    borderRadius: '16px',
  };

  const atsLevel = !result
    ? null
    : result.total >= 80
    ? { label: 'Excellent', color: '#22C55E' }
    : result.total >= 60
    ? { label: 'Good', color: '#38BDF8' }
    : result.total >= 40
    ? { label: 'Fair', color: '#F59E0B' }
    : { label: 'Needs Work', color: '#EF4444' };

  const suggestions = result
    ? [
        !result.checks.hasSummary && 'Skillovix detected no Summary/Objective section — add it! (+10 pts)',
        !result.checks.hasExperience && 'Skillovix tip: Add an Experience or Internship section. (+15 pts)',
        !result.checks.hasGithub && 'Skillovix tip: Add your GitHub link to boost ATS score by 5 points.',
        !result.checks.hasLinkedin && 'Skillovix tip: Add your LinkedIn profile for better recruiter visibility. (+5 pts)',
        !result.checks.hasProjects && 'Skillovix detected no Projects section — add it! (+15 pts)',
        result.missingSkills.length > 0 &&
          `Skillovix recommends: Add these evolved skills to your resume: ${result.missingSkills.slice(0, 4).join(', ')}.`,
      ].filter(Boolean)
    : [];

  const wordCount = resumeText.split(/\s+/).filter(Boolean).length;
  const density = result
    ? Math.round((result.foundSkills.length / Math.max(result.missingSkills.length + result.foundSkills.length, 1)) * 100)
    : 0;

  return (
    <div className="p-6 md:p-8 space-y-8 bg-[#070E1A] min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <FileText size={32} className="text-sky-400" />
          📄 Skillovix Resume Analyzer
        </h1>
        <p className="text-slate-400 mt-1">Upload your resume and Skillovix will analyze it instantly</p>
      </div>

      {!result ? (
        <div className="space-y-6">
          {/* Toggle */}
          <div className="flex gap-2">
            {['upload', 'paste'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize"
                style={
                  mode === m
                    ? { background: 'linear-gradient(135deg, #2563EB, #38BDF8)', color: '#fff' }
                    : { background: '#1E3A5F', color: '#8BA5C7' }
                }
              >
                {m === 'upload' ? '📁 Upload File' : '📝 Paste Text'}
              </button>
            ))}
          </div>

          {mode === 'upload' ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className="flex flex-col items-center justify-center gap-4 p-16 rounded-2xl cursor-pointer transition-all"
              style={{
                background: dragOver ? '#1E3A5F50' : '#0D1B2E',
                border: `2px dashed ${dragOver ? '#38BDF8' : '#1E3A5F'}`,
                borderRadius: '20px',
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #2563EB20, #38BDF820)' }}
              >
                <Upload size={32} className="text-sky-400" />
              </div>
              <div className="text-center">
                <p className="text-white font-semibold text-lg">Drop your resume here or click to upload</p>
                <p className="text-slate-400 text-sm mt-1">Skillovix supports .txt and .pdf files</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder="Paste your resume text here..."
                rows={14}
                className="w-full px-5 py-4 rounded-2xl text-sm text-slate-200 placeholder-slate-500 outline-none resize-none"
                style={{ background: '#0D1B2E', border: '1px solid #1E3A5F' }}
              />
              <button
                onClick={handlePasteAnalyze}
                disabled={!pasteText.trim()}
                className="px-6 py-3 rounded-xl font-semibold text-white flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #2563EB, #38BDF8)' }}
              >
                <Zap size={16} fill="currentColor" /> Analyze with Skillovix ⚡
              </button>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center gap-3 py-8">
              <div
                className="w-6 h-6 rounded-full border-2 border-sky-400 border-t-transparent"
                style={{ animation: 'spin 0.8s linear infinite' }}
              />
              <span className="text-sky-400 font-semibold">Skillovix is analyzing your resume... ⚡</span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* ATS Score */}
          <div
            className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-2xl"
            style={cardStyle}
          >
            {/* Circle */}
            <div className="relative shrink-0" style={{ width: 140, height: 140 }}>
              <svg width={140} height={140} className="-rotate-90">
                <circle cx={70} cy={70} r={58} fill="none" stroke="#1E3A5F" strokeWidth="10" />
                <circle
                  cx={70}
                  cy={70}
                  r={58}
                  fill="none"
                  stroke={atsLevel.color}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 58}
                  strokeDashoffset={2 * Math.PI * 58 * (1 - result.total / 100)}
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{result.total}</span>
                <span className="text-xs text-slate-400">/100</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-sky-400 font-semibold tracking-wider uppercase mb-1">Skillovix ATS Score</p>
              <h2 className="text-2xl font-bold text-white mb-2">
                Skillovix Resume Analysis Complete ⚡
              </h2>
              <div className="flex items-center gap-2">
                <span
                  className="px-3 py-1 rounded-full text-sm font-bold"
                  style={{ background: `${atsLevel.color}20`, color: atsLevel.color }}
                >
                  {atsLevel.label}
                </span>
                {fileName && <span className="text-xs text-slate-500">{fileName}</span>}
              </div>
            </div>
          </div>

          {/* 4 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Found Skills */}
            <div className="p-5 rounded-2xl space-y-3" style={cardStyle}>
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <Zap size={16} fill="currentColor" /> ⚡ Evolved Keywords Found
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.foundSkills.length === 0 && (
                  <p className="text-xs text-slate-500">No matching keywords detected.</p>
                )}
                {result.foundSkills.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: '#14281f', color: '#4ADE80', border: '1px solid #22C55E40' }}
                  >
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="p-5 rounded-2xl space-y-3" style={cardStyle}>
              <h3 className="text-sm font-bold text-red-400 flex items-center gap-2">
                🎯 Keywords to Add
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills.length === 0 && (
                  <p className="text-xs text-emerald-400">All keywords present! Great job! ⚡</p>
                )}
                {result.missingSkills.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: '#2a1010', color: '#F87171', border: '1px solid #EF444440' }}
                  >
                    + {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Sections */}
            <div className="p-5 rounded-2xl space-y-2" style={cardStyle}>
              <h3 className="text-sm font-bold text-sky-400 flex items-center gap-2">
                📋 Resume Sections Detected
              </h3>
              {[
                { label: 'Summary / Objective', ok: result.checks.hasSummary > 0 },
                { label: 'Work Experience', ok: result.checks.hasExperience > 0 },
                { label: 'Education', ok: result.checks.hasEducation > 0 },
                { label: 'Projects', ok: result.checks.hasProjects > 0 },
                { label: 'Skills / Technologies', ok: result.checks.hasSkills > 0 },
                { label: 'GitHub Link', ok: result.checks.hasGithub > 0 },
                { label: 'LinkedIn Profile', ok: result.checks.hasLinkedin > 0 },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm">
                  {item.ok ? (
                    <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle size={14} className="text-red-400 shrink-0" />
                  )}
                  <span className={item.ok ? 'text-slate-200' : 'text-slate-500'}>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="p-5 rounded-2xl space-y-4" style={cardStyle}>
              <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2">
                📊 Skillovix Resume Stats
              </h3>
              {[
                { label: 'Word Count', value: wordCount },
                { label: 'Keyword Density', value: `${density}%` },
                { label: 'Skills Found', value: `${result.foundSkills.length}/${result.foundSkills.length + result.missingSkills.length}` },
                { label: 'ATS Score', value: `${result.total}/100` },
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">{stat.label}</span>
                  <span className="text-sm font-bold text-white">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-6 rounded-2xl space-y-3" style={{ ...cardStyle, border: '1px solid #2563EB40' }}>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap size={18} className="text-yellow-400" fill="currentColor" />
                ⚡ Skillovix Recommendations
              </h3>
              <div className="space-y-2">
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: '#162033', border: '1px solid #1E3A5F' }}
                  >
                    <Zap size={14} className="text-sky-400 shrink-0 mt-0.5" fill="currentColor" />
                    <p className="text-sm text-slate-300">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reset */}
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105"
            style={{ background: '#1E3A5F', border: '1px solid #2563EB40' }}
          >
            <RotateCcw size={16} /> Analyze Another Resume
          </button>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
