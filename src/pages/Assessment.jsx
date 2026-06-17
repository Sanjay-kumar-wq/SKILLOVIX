import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, CheckCircle, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import useStore from '../store/useStore';
import { CAREERS, EDUCATION_LEVELS, EXPERIENCE_LEVELS, ALL_SKILLS } from '../data/careers';
import ProgressBar from '../components/ui/ProgressBar';

// ── Step 1: Career Goal ──────────────────────────────────────────────────────
function StepCareer({ selected, onSelect }) {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-cyber font-black text-white uppercase tracking-wider">
          CHOOSE YOUR CAREER MATRIX
        </h2>
        <p className="text-slate-400 font-rajdhani text-sm uppercase tracking-wider">
          // SELECT_TARGET_ROLE_TO_INITIALIZE_ROADMAP
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CAREERS.map((career) => {
          const isSelected = selected === career.name;
          return (
            <button
              key={career.id}
              onClick={() => onSelect(career.name)}
              className={`
                relative flex flex-col items-center gap-3 p-5 rounded-2xl border text-center
                transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,255,240,0.2)] hover:border-neon-cyan/60 cursor-pointer
                ${isSelected
                  ? 'glass-card border-neon-purple bg-neon-purple/10 shadow-[0_0_25px_rgba(168,85,247,0.35)]'
                  : 'glass-card border-cyber-border bg-cyber-card/60'
                }
              `}
            >
              {/* Check icon */}
              {isSelected && (
                <span className="absolute top-3 right-3 text-neon-purple drop-shadow-[0_0_5px_#A855F7] animate-pulse">
                  <Zap size={18} fill="currentColor" />
                </span>
              )}

              <div className="w-14 h-14 rounded-full bg-cyber-surface/60 flex items-center justify-center border border-cyber-border shadow-inner text-3xl">
                {career.emoji}
              </div>
              <div>
                <p className="font-rajdhani font-bold text-base uppercase tracking-wider text-white">
                  {career.name}
                </p>
                <p className="text-xs text-slate-400 font-rajdhani tracking-widest mt-1 uppercase leading-snug">{career.tagline}</p>
              </div>

              {isSelected && (
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${career.color} opacity-[0.03]`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 2: Profile ──────────────────────────────────────────────────────────
function StepProfile({
  selectedSkills, toggleSkill,
  education, setEducation,
  experience, setExperience,
  studyHours, setStudyHours,
}) {
  const getSliderColor = (h) => {
    if (h < 10) return '#FF006E'; // Neon Pink (Low)
    if (h <= 20) return '#FFE600'; // Neon Yellow (Mod)
    return '#00FF88'; // Neon Green (High)
  };

  const getSliderLabel = (h) => {
    if (h < 10) return 'LOW_INTENSITY';
    if (h <= 20) return 'MID_INTENSITY';
    return 'HIGH_INTENSITY';
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-cyber font-black text-white uppercase tracking-wider">
          SYNC YOUR METRICS
        </h2>
        <p className="text-slate-400 font-rajdhani text-sm uppercase tracking-wider">
          // INGESTING_STUDENT_PARAMETERS
        </p>
      </div>

      {/* Section A: Skills */}
      <div className="glass-card p-6 border-neon-purple/20 space-y-4">
        <div>
          <h3 className="font-rajdhani font-bold text-base uppercase tracking-wider text-white">CURRENT_KNOWN_SKILLS</h3>
          <p className="text-[10px] font-cyber text-neon-cyan tracking-wider mt-0.5 uppercase">// SELECT_ALL_THAT_APPLY</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_SKILLS.map((skill) => {
            const isSelected = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-1.5 rounded-full border text-xs font-rajdhani font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer
                  ${isSelected
                    ? 'bg-neon-purple text-white border-neon-purple shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                    : 'bg-cyber-surface/40 border-cyber-border text-slate-400 hover:border-neon-purple/50'
                  }`}
              >
                {isSelected && (
                  <CheckCircle size={10} className="inline mr-1 text-white" />
                )}
                {skill}
              </button>
            );
          })}
        </div>
        {selectedSkills.length > 0 && (
          <p className="text-xs text-neon-cyan font-rajdhani uppercase tracking-wider font-semibold">{selectedSkills.length} SKILLS LOADED</p>
        )}
      </div>

      {/* Section B: Education */}
      <div className="glass-card p-6 border-neon-purple/20 space-y-4">
        <h3 className="font-rajdhani font-bold text-base uppercase tracking-wider text-white">EDUCATION_PROTOCOLS</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {EDUCATION_LEVELS.map((level) => {
            const isSelected = education === level;
            return (
              <button
                key={level}
                onClick={() => setEducation(level)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-all duration-300 font-rajdhani font-semibold uppercase tracking-wider cursor-pointer
                  ${isSelected
                    ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-[0_0_15px_rgba(0,255,240,0.2)]'
                    : 'border-cyber-border bg-cyber-card/40 text-slate-400 hover:border-neon-cyan/50'
                  }
                `}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-neon-cyan' : 'border-slate-600'}`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_5px_#00FFF0]" />}
                </div>
                {level}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section C: Experience */}
      <div className="glass-card p-6 border-neon-purple/20 space-y-4">
        <h3 className="font-rajdhani font-bold text-base uppercase tracking-wider text-white">EXPERIENCE_PROTOCOLS</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {EXPERIENCE_LEVELS.map((level) => {
            const isSelected = experience === level.id;
            // Border color mapping for left border based on level
            const borderColors = {
              beginner: 'border-l-neon-green hover:shadow-[0_0_12px_rgba(0,255,136,0.15)]',
              some: 'border-l-neon-blue hover:shadow-[0_0_12px_rgba(0,102,255,0.15)]',
              intermediate: 'border-l-neon-purple hover:shadow-[0_0_12px_rgba(168,85,247,0.15)]',
              advanced: 'border-l-neon-pink hover:shadow-[0_0_12px_rgba(255,0,110,0.15)]',
            };
            return (
              <button
                key={level.id}
                onClick={() => setExperience(level.id)}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-2xl border border-l-4 text-center transition-all duration-300 cursor-pointer
                  ${isSelected
                    ? 'border-neon-purple bg-neon-purple/10 shadow-[0_0_15px_rgba(168,85,247,0.25)] border-l-neon-purple'
                    : `border-cyber-border bg-cyber-card/60 ${borderColors[level.id] || ''}`
                  }
                `}
              >
                <span className="text-2xl">{level.emoji}</span>
                <p className="text-xs font-rajdhani font-bold uppercase tracking-wider text-white">
                  {level.label}
                </p>
                <p className="text-[10px] text-slate-400 font-rajdhani tracking-wide uppercase leading-snug">{level.desc}</p>
                {isSelected && <Zap size={14} className="text-neon-purple drop-shadow-[0_0_3px_#A855F7] animate-pulse mt-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section D: Study Hours */}
      <div className="glass-card p-6 border-neon-purple/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-rajdhani font-bold text-base uppercase tracking-wider text-white">ALLOCATE_TEMPORAL_UNITS</h3>
            <p className="text-[10px] font-cyber text-neon-cyan tracking-wider mt-0.5 uppercase">// HOURS_PER_WEEK_TO_EVOLVE</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-2xl font-cyber font-black drop-shadow-[0_0_6px_rgba(0,0,0,0.5)]"
              style={{ color: getSliderColor(studyHours) }}
            >
              {studyHours}
            </span>
            <span className="text-xs text-slate-400 font-rajdhani uppercase tracking-widest">hours</span>
            <span
              className="px-2 py-0.5 rounded-full text-[9px] font-cyber font-bold tracking-wider"
              style={{
                backgroundColor: getSliderColor(studyHours) + '22',
                color: getSliderColor(studyHours),
                border: `1px solid ${getSliderColor(studyHours)}44`,
              }}
            >
              {getSliderLabel(studyHours)}
            </span>
          </div>
        </div>
        <div className="relative px-1 pt-3">
          <input
            type="range"
            min={1}
            max={40}
            step={1}
            value={studyHours}
            onChange={(e) => setStudyHours(Number(e.target.value))}
            className="w-full cursor-pointer accent-neon-purple"
            style={{
              background: `linear-gradient(to right, ${getSliderColor(studyHours)} 0%, ${getSliderColor(studyHours)} ${((studyHours - 1) / 39) * 100}%, var(--color-cyber-border) ${((studyHours - 1) / 39) * 100}%, var(--color-cyber-border) 100%)`,
            }}
          />
          <div className="flex justify-between mt-2 text-[10px] font-cyber text-slate-500">
            <span>01_HR</span>
            <span>20_HRS</span>
            <span>40_HRS</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step 3: Review ────────────────────────────────────────────────────────────
function StepReview({ career, skills, education, experience, studyHours, onGenerate, loading }) {
  const expLabel = EXPERIENCE_LEVELS.find((e) => e.id === experience)?.label || experience;
  const expEmoji = EXPERIENCE_LEVELS.find((e) => e.id === experience)?.emoji || '';
  const careerData = CAREERS.find((c) => c.name === career);

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-cyber font-black text-white uppercase tracking-wider">
          VERIFY MATRIX PROTOCOLS
        </h2>
        <p className="text-slate-400 font-rajdhani text-sm uppercase tracking-wider">
          // CONFIRM_YOUR_DETAILS_BEFORE_INITIALIZATION
        </p>
      </div>

      {/* Summary Card */}
      <div className="glass-card p-6 border-neon-purple/20 space-y-5">
        {/* Career Goal */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-neon-purple/10 border border-neon-purple/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
          <span className="text-4xl">{careerData?.emoji}</span>
          <div>
            <p className="text-[10px] font-cyber font-bold text-neon-cyan uppercase tracking-wider">// TARGET_CAREER_SECTOR</p>
            <p className="text-lg font-rajdhani font-bold text-white uppercase tracking-wider mt-0.5">{career}</p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'EDUCATION', value: education.split(' - ')[1] || education.split(' ')[0], emoji: '🎓', color: 'text-neon-cyan' },
            { label: 'EXPERIENCE', value: `${expEmoji} ${expLabel}`, emoji: '', color: 'text-neon-pink' },
            { label: 'WEEKLY_TEMPORAL', value: `${studyHours} HRS`, emoji: '⏰', color: 'text-neon-green' },
          ].map((item) => (
            <div key={item.label} className="text-center p-3 rounded-xl bg-cyber-surface/40 border border-cyber-border/40">
              <p className="text-[9px] font-cyber font-bold text-slate-500 uppercase tracking-widest mb-1.5">{item.label}</p>
              <p className={`text-xs font-rajdhani font-bold uppercase tracking-wider truncate ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Current Skills */}
        <div className="border-t border-cyber-border/40 pt-4">
          <p className="text-xs font-cyber font-bold text-slate-400 uppercase tracking-wider mb-3">
            // REGISTERED_SKILLS ({skills.length})
          </p>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-full text-xs font-rajdhani font-semibold uppercase tracking-wider bg-neon-purple/15 text-neon-purple border border-neon-purple/30 shadow-[0_0_8px_rgba(168,85,247,0.15)]"
                >
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 font-rajdhani uppercase tracking-wider italic">No skills registered. AI matrix will initialize path from foundational level.</p>
          )}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={loading}
        className="w-full py-5 rounded-2xl font-cyber font-black text-base uppercase tracking-widest cyber-btn flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-95"
      >
        {loading ? (
          <>
            <span className="spinner border-white/30 border-t-white" />
            SYNTHESIZING PROTOCOL ROADMAP...
          </>
        ) : (
          <>
            <Zap size={22} className="text-white drop-shadow-[0_0_4px_white]" fill="currentColor" />
            GENERATE CAREER MATRIX
            <Sparkles size={18} />
          </>
        )}
      </button>

      {loading && (
        <div className="text-center space-y-3 animate-fade-in pt-3">
          <div className="flex justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_6px_#00FFF0] animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <p className="text-xs font-rajdhani text-neon-cyan uppercase tracking-widest animate-pulse">
            // ANALYZING_USER_GAP_METRICS_AND_GENERATING_RECOMMENDED_CHANNELS
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main Assessment Page ─────────────────────────────────────────────────────
export default function Assessment() {
  const navigate = useNavigate();
  const {
    career, setCareer,
    currentSkills, toggleSkill, setSkills,
    educationLevel, setEducationLevel,
    experienceLevel, setExperienceLevel,
    studyHours, setStudyHours,
    setAssessmentData,
  } = useStore();

  useEffect(() => {
    document.title = "SKILLOVIX ⚡ | ASSESSMENT";
  }, []);

  const [step, setStep] = useState(1);
  const [selectedCareer, setSelectedCareer] = useState(career || '');
  const [selectedSkills, setSelectedSkillsLocal] = useState(currentSkills || []);
  const [education, setEducation] = useState(educationLevel || 'Undergraduate - 3rd Year');
  const [experience, setExperience] = useState(experienceLevel || '');
  const [hours, setHours] = useState(studyHours || 10);
  const [generating, setGenerating] = useState(false);

  const handleToggleSkill = (skill) => {
    setSelectedSkillsLocal((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const canProceed = () => {
    if (step === 1) return selectedCareer !== '';
    if (step === 2) return experience !== '';
    return true;
  };

  const handleNext = () => {
    if (step < 3) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    // Save all to store
    setAssessmentData({
      career: selectedCareer,
      currentSkills: selectedSkills,
      experienceLevel: experience,
      studyHours: hours,
      educationLevel: education,
    });

    await new Promise((r) => setTimeout(r, 2200));
    setGenerating(false);
    navigate('/dashboard');
  };

  const stepTitles = ['CHOOSE CAREER', 'YOUR PROFILE', 'VERIFY & RUN'];

  return (
    <div className="min-h-screen bg-cyber-black text-white py-12 px-4 relative overflow-hidden">
      {/* Background neon orbs */}
      <div className="fixed top-0 right-0 w-[450px] h-[450px] bg-neon-purple/5 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-0 left-0 w-[450px] h-[450px] bg-neon-cyan/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.4)]">
              <Zap size={16} className="text-white drop-shadow-[0_0_3px_white]" fill="white" />
            </div>
            <span className="font-cyber font-black text-lg tracking-wider text-white drop-shadow-[0_0_5px_rgba(168,85,247,0.4)]">SKILLOVIX</span>
          </div>
          <p className="text-xs font-rajdhani text-slate-400 uppercase tracking-widest">// INITIALIZATION_METRICS — STAGE_{step}_OF_3</p>
        </div>

        {/* Custom Step Indicators connected by neon lines */}
        <div className="mb-8 animate-fade-in max-w-2xl mx-auto">
          <div className="flex items-center justify-between relative mb-4">
            {/* Background connecting line */}
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-cyber-border/60 -z-10 -translate-y-1/2 rounded-full" />
            
            {/* Active connecting line overlay */}
            <div
              className="absolute top-1/2 left-4 h-0.5 bg-gradient-to-r from-neon-purple to-neon-cyan -z-10 -translate-y-1/2 rounded-full transition-all duration-500 ease-out"
              style={{
                width: step === 1 ? '0%' : step === 2 ? '50%' : '100%',
                boxShadow: '0 0 8px rgba(0, 255, 240, 0.4)'
              }}
            />

            {stepTitles.map((title, i) => {
              const stepNum = i + 1;
              const isActive = stepNum === step;
              const isDone = stepNum < step;
              return (
                <div key={title} className="flex flex-col items-center gap-2 relative">
                  <div className={`
                    w-9 h-9 rounded-full flex items-center justify-center text-xs font-cyber font-bold shrink-0 transition-all duration-300 border-2
                    ${isDone
                      ? 'bg-neon-green/10 border-neon-green text-neon-green shadow-[0_0_10px_rgba(0,255,136,0.3)]'
                      : isActive
                        ? 'bg-neon-purple/20 border-neon-purple text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                        : 'bg-cyber-card border-cyber-border text-slate-500'
                    }
                  `}>
                    {isDone ? <CheckCircle size={14} className="text-neon-green" /> : stepNum}
                  </div>
                  <span className={`text-[10px] font-cyber font-bold tracking-wider hidden sm:block ${isActive ? 'text-neon-purple drop-shadow-[0_0_4px_rgba(168,85,247,0.3)]' : isDone ? 'text-neon-green' : 'text-slate-500'}`}>
                    {title}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Custom neon progress bar */}
          <div className="neon-progress h-2 max-w-md mx-auto">
            <div className="neon-progress-fill h-full" style={{ width: `${(step / 3) * 100}%` }} />
          </div>
        </div>

        {/* Step Content Card */}
        <div className="glass-card p-6 sm:p-8 mb-6 border-neon-purple/20 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
          {step === 1 && (
            <StepCareer
              selected={selectedCareer}
              onSelect={setSelectedCareer}
            />
          )}
          {step === 2 && (
            <StepProfile
              selectedSkills={selectedSkills}
              toggleSkill={handleToggleSkill}
              education={education}
              setEducation={setEducation}
              experience={experience}
              setExperience={setExperience}
              studyHours={hours}
              setStudyHours={setHours}
            />
          )}
          {step === 3 && (
            <StepReview
              career={selectedCareer}
              skills={selectedSkills}
              education={education}
              experience={experience}
              studyHours={hours}
              onGenerate={handleGenerate}
              loading={generating}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        {step < 3 && (
          <div className="flex items-center justify-between animate-fade-in">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-rajdhani font-bold uppercase tracking-wider text-xs border border-cyber-border hover:bg-cyber-surface hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ArrowLeft size={14} />
              BACK_UNIT
            </button>

            <div className="flex items-center gap-2">
              {[1, 2, 3].map((dot) => (
                <div
                  key={dot}
                  className={`rounded-full transition-all duration-300 ${dot === step ? 'w-6 h-2 bg-neon-purple shadow-[0_0_6px_#A855F7]' : dot < step ? 'w-2 h-2 bg-neon-green' : 'w-2 h-2 bg-cyber-border'}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="cyber-btn flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              NEXT_UNIT
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
