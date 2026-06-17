import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap, ChevronDown, ArrowRight, Play, Star, CheckCircle,
  Brain, Target, Users, Award, Menu, X,
} from 'lucide-react';
import useStore from '../store/useStore';

// ── Navbar ──────────────────────────────────────────────────────────────────
function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b
        ${scrolled
          ? 'backdrop-blur-xl shadow-[0_4px_16px_rgba(37,99,235,0.12)]'
          : 'bg-transparent border-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex flex-col gap-0.5 group">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.5)] group-hover:scale-110 transition-transform">
                <Zap size={16} className="text-white drop-shadow-[0_0_3px_white]" fill="white" />
              </div>
              <span className="font-cyber font-black text-xl tracking-wider text-white drop-shadow-[0_0_6px_rgba(168,85,247,0.4)]">SKILLOVIX</span>
            </div>
            <span className="text-[7px] font-cyber font-bold tracking-widest text-neon-cyan leading-none ml-10">// SKILL EVOLUTION INTELLIGENCE</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {['features', 'how-it-works', 'faq'].map((id) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-sm font-rajdhani font-bold uppercase tracking-wider text-slate-300 hover:text-neon-cyan hover:drop-shadow-[0_0_5px_rgba(0,255,240,0.6)] transition-all cursor-pointer"
              >
                {id === 'how-it-works' ? 'How It Works' : id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* CTA */}
            <Link
              to="/register"
              className="hidden md:inline-flex items-center gap-2 cyber-btn hover:scale-105"
            >
              Get Started
              <ArrowRight size={15} />
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-neon-purple transition-all"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-6 space-y-2 animate-slide-down border-t border-neon-purple/20 pt-4 bg-cyber-black/95 backdrop-blur-xl">
            {['features', 'how-it-works', 'faq'].map((id) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="block w-full text-left px-4 py-3 rounded-xl text-sm font-rajdhani font-bold uppercase tracking-wider text-slate-300 hover:bg-neon-cyan/5 hover:text-neon-cyan transition-all"
              >
                {id === 'how-it-works' ? 'How It Works' : id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
            <div className="px-4 pt-2">
              <Link
                to="/register"
                className="block w-full text-center cyber-btn"
                onClick={() => setMenuOpen(false)}
              >
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// ── Hero Mockup ──────────────────────────────────────────────────────────────
function HeroMockup() {
  const mockupSkills = [
    { name: 'React Framework', done: true, color: 'text-neon-purple border-neon-purple/30 bg-neon-purple/10 shadow-[0_0_8px_rgba(168,85,247,0.2)]' },
    { name: 'TypeScript Core', done: true, color: 'text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10 shadow-[0_0_8px_rgba(0,255,240,0.2)]' },
    { name: 'Node.js Backend', done: false, color: 'text-slate-400 border-slate-700 bg-slate-800/40' },
  ];

  const chartBars = [30, 45, 60, 50, 75, 90, 85];

  return (
    <div className="relative w-full max-w-md mx-auto lg:max-w-lg float-animation">
      {/* Background glow orbs */}
      <div className="absolute -inset-4 bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 blur-2xl rounded-3xl -z-10" />

      {/* Glass card container */}
      <div className="glass-card border-neon-purple/40 shadow-[0_0_30px_rgba(168,85,247,0.15)] p-6 space-y-5">
        {/* Mockup Header */}
        <div className="flex items-center justify-between border-b border-cyber-border/40 pb-3">
          <div>
            <p className="text-[10px] font-cyber font-bold text-neon-cyan tracking-wider">// ROADMAP_EVOLUTION</p>
            <h3 className="text-base font-rajdhani font-bold text-white uppercase tracking-wide mt-0.5">Full Stack Engineer</h3>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-green/10 text-neon-green border border-neon-green/30 text-xs font-rajdhani font-bold shadow-[0_0_8px_rgba(0,255,136,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
            60% EVOLVED
          </div>
        </div>

        {/* Custom Neon Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-cyber text-slate-400">
            <span>PHASE_03</span>
            <span>60/100 XP</span>
          </div>
          <div className="neon-progress h-2.5">
            <div className="neon-progress-fill h-full" style={{ width: '60%' }} />
          </div>
        </div>

        {/* Skill chips section */}
        <div className="space-y-2">
          <p className="text-[10px] font-cyber text-slate-400 tracking-wider">// NEXT_SKILLS</p>
          <div className="space-y-2">
            {mockupSkills.map((s) => (
              <div
                key={s.name}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl border text-xs font-semibold font-rajdhani transition-all duration-300 ${s.color}`}
              >
                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${s.done ? 'border-neon-cyan text-neon-cyan shadow-[0_0_5px_rgba(0,255,240,0.5)]' : 'border-slate-600'}`}>
                  {s.done ? <CheckCircle size={10} /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />}
                </div>
                <span className={s.done ? 'line-through opacity-70' : ''}>{s.name}</span>
                {!s.done && (
                  <span className="ml-auto text-[10px] text-neon-cyan font-cyber uppercase animate-pulse">// REQ_LEARN</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chart representation */}
        <div className="space-y-2 pt-1 border-t border-cyber-border/40">
          <p className="text-[10px] font-cyber text-slate-400 tracking-wider">// WEEKLY_SKILL_EXP_GAINED</p>
          <div className="h-16 flex items-end justify-between gap-2 pt-2 px-1">
            {chartBars.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div
                  className="w-full rounded-t-sm transition-all duration-500 hover:brightness-125"
                  style={{ height: `${h}%`, background: 'linear-gradient(to top, #2563EB, #38BDF8)', boxShadow: '0 0 6px rgba(56,189,248,0.25)' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, description, borderColor, iconBg }) {
  return (
    <div className={`glass-card p-6 border transition-all duration-300 hover:-translate-y-1 group ${borderColor}`}>
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.05)]`}>
        {icon}
      </div>
      <h3 className="font-rajdhani font-bold text-lg uppercase tracking-wider text-white mb-2">{title}</h3>
      <p className="text-sm font-inter text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

// ── Testimonial Card ──────────────────────────────────────────────────────────
function TestimonialCard({ quote, name, college, initials, color }) {
  return (
    <div className="glass-card p-6 border-neon-purple/20 hover:border-neon-purple/50 shadow-[0_0_15px_rgba(168,85,247,0.05)] transition-all duration-300">
      <div className="text-neon-purple text-5xl font-cyber leading-none h-6 select-none opacity-50 mb-3">“</div>
      <p className="text-slate-300 text-sm leading-relaxed mb-6 italic relative z-10 font-inter">
        {quote}
      </p>
      <div className="flex items-center gap-3 border-t border-cyber-border/30 pt-4">
        <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white text-sm font-rajdhani font-bold shadow-[0_0_10px_rgba(255,255,255,0.15)] border border-white/20`}>
          {initials}
        </div>
        <div>
          <p className="font-rajdhani font-bold text-white text-sm uppercase tracking-wide">{name}</p>
          <p className="text-xs text-neon-cyan font-rajdhani tracking-wider">{college}</p>
        </div>
      </div>
    </div>
  );
}

// ── FAQ Accordion ─────────────────────────────────────────────────────────────
function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);

  return (
    <div className={`glass-card overflow-hidden transition-all duration-300 border-l-2 ${open ? 'border-neon-purple shadow-[0_0_15px_rgba(168,85,247,0.1)]' : 'border-cyber-border/40 border-l-neon-purple/50'}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 cursor-pointer"
        aria-expanded={open}
      >
        <span className="font-rajdhani font-bold text-sm uppercase tracking-wider text-slate-200">{question}</span>
        <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${open ? 'bg-neon-purple text-white rotate-180 shadow-[0_0_8px_#A855F7]' : 'bg-cyber-surface text-slate-400'}`}>
          <ChevronDown size={14} />
        </span>
      </button>
      <div
        style={{ maxHeight: open ? contentRef.current?.scrollHeight + 'px' : '0px', opacity: open ? 1 : 0 }}
        className="accordion-content transition-all duration-300"
        ref={contentRef}
      >
        <p className="px-6 pb-5 text-sm text-slate-400 leading-relaxed font-inter">
          {answer}
        </p>
      </div>
    </div>
  );
}

// ── Stats Item ─────────────────────────────────────────────────────────────
function StatItem({ value, label, valueColor }) {
  return (
    <div className="glass-card p-5 border-neon-purple/10 text-center hover:border-neon-purple/30 transition-all">
      <div className={`text-3xl font-cyber font-black drop-shadow-[0_0_8px_rgba(0,0,0,0.5)] ${valueColor}`}>
        {value}
      </div>
      <p className="text-xs text-slate-400 font-rajdhani uppercase tracking-wider mt-2">{label}</p>
    </div>
  );
}

// ── Main Landing Page ─────────────────────────────────────────────────────────
export default function Landing() {
  const { theme } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "SKILLOVIX ⚡ | HOME";
  }, []);

  const features = [
    {
      icon: '⚡',
      title: 'AI Roadmap Generator',
      description: 'Get a step-by-step personalized learning path based on your goals and current skills.',
      borderColor: 'border-neon-purple/20 hover:border-neon-purple hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]',
      iconBg: 'bg-neon-purple/10 text-neon-purple',
    },
    {
      icon: '🔍',
      title: 'Skill Gap Analysis',
      description: "See exactly what skills you're missing and what to learn next to reach your dream role.",
      borderColor: 'border-neon-cyan/20 hover:border-neon-cyan hover:shadow-[0_0_20px_rgba(0,255,240,0.25)]',
      iconBg: 'bg-neon-cyan/10 text-neon-cyan',
    },
    {
      icon: '📊',
      title: 'Progress Tracker',
      description: 'Track your learning streak, completed skills, and milestones on your journey.',
      borderColor: 'border-neon-pink/20 hover:border-neon-pink hover:shadow-[0_0_20px_rgba(255,0,110,0.25)]',
      iconBg: 'bg-neon-pink/10 text-neon-pink',
    },
    {
      icon: '💼',
      title: 'Project Recommendations',
      description: 'Get project ideas matched to your current skill level to build a standout portfolio.',
      borderColor: 'border-neon-green/20 hover:border-neon-green hover:shadow-[0_0_20px_rgba(0,255,136,0.25)]',
      iconBg: 'bg-neon-green/10 text-neon-green',
    },
    {
      icon: '🤖',
      title: 'AI Career Mentor',
      description: 'Chat with an AI mentor that knows your profile and goals to give you personalized advice.',
      borderColor: 'border-neon-yellow/20 hover:border-neon-yellow hover:shadow-[0_0_20px_rgba(255,230,0,0.25)]',
      iconBg: 'bg-neon-yellow/10 text-neon-yellow',
    },
    {
      icon: '📄',
      title: 'Resume Analyzer',
      description: 'Upload your resume and get an ATS score along with actionable improvement tips.',
      borderColor: 'border-neon-blue/20 hover:border-neon-blue hover:shadow-[0_0_20px_rgba(0,102,255,0.25)]',
      iconBg: 'bg-neon-blue/10 text-neon-blue',
    },
  ];

  const testimonials = [
    {
      quote: 'I went from zero to getting a React internship in 4 months following my Skillovix roadmap!',
      name: 'Priya S.',
      college: '3rd Year CSE, VIT',
      initials: 'PS',
      color: 'bg-gradient-to-br from-neon-purple to-neon-pink',
    },
    {
      quote: 'Skillovix showed me exactly what skills were missing from my resume. Absolute game changer!',
      name: 'Arjun M.',
      college: 'Fresh Graduate, NIT',
      initials: 'AM',
      color: 'bg-gradient-to-br from-neon-blue to-neon-cyan',
    },
    {
      quote: 'Switched from mechanical to software engineering with the help of Skillovix AI mentor. Best decision ever!',
      name: 'Kavya R.',
      college: 'Career Switcher',
      initials: 'KR',
      color: 'bg-gradient-to-br from-neon-purple to-neon-blue',
    },
  ];

  const faqs = [
    {
      question: 'Is Skillovix free to use?',
      answer: 'Yes! Skillovix is completely free during our preview period with full access to all features including AI Roadmap Generator, Skill Gap Analysis, AI Mentor, and more.',
    },
    {
      question: 'Which careers does Skillovix support?',
      answer: 'Skillovix supports 9 tech career paths including Full Stack Developer, Data Scientist, AI/ML Engineer, Cybersecurity Analyst, Cloud Engineer, DevOps Engineer, Mobile App Developer, Frontend Developer, and Backend Developer.',
    },
    {
      question: 'How is the roadmap personalized for me?',
      answer: 'Based on your current skills, experience level, education level, and available study hours per week, Skillovix generates a custom learning sequence with phases tailored specifically to bridge your skill gaps and reach your career goal.',
    },
    {
      question: 'Can I change my career goal later?',
      answer: 'Absolutely! You can update your career goal anytime from your Skillovix profile settings. Your progress and completed skills will be saved for each career path separately.',
    },
    {
      question: 'How does the Skillovix AI Mentor work?',
      answer: 'The Skillovix AI Mentor uses your profile data — skills, progress, career goal, and experience level — to give you highly personalized career advice, answer your doubts, suggest projects, and provide interview preparation guidance.',
    },
  ];

  return (
    <div className="min-h-screen bg-cyber-black text-white relative">
      <LandingNavbar />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div className="space-y-8 animate-fade-in text-left">
              {/* Badge pill */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-cyan/40 bg-neon-cyan/5 text-neon-cyan text-xs font-cyber tracking-widest shadow-[0_0_12px_rgba(0,255,240,0.15)] animate-pulse">
                <Zap size={12} fill="currentColor" className="text-neon-cyan" />
                ⚡ AI-POWERED SKILL EVOLUTION
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-cyber font-black leading-none tracking-tight">
                <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">EVOLVE YOUR SKILLS</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">ELEVATE YOUR CAREER</span>
              </h1>

              {/* Subheadline */}
              <p className="text-sm sm:text-base text-slate-400 font-rajdhani tracking-widest leading-relaxed max-w-xl uppercase">
                Skillovix analyzes your profile to identify skill gaps, maps your study timeline, and generates an interactive, personalized tech roadmap engineered by AI.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  to="/register"
                  className="cyber-btn inline-flex items-center justify-center gap-2 text-center"
                >
                  <Zap size={16} fill="white" />
                  START EVOLVING
                </Link>
                <button
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="cyber-btn-outline inline-flex items-center justify-center gap-2"
                >
                  <Play size={14} className="text-neon-purple fill-neon-purple/20" />
                  SEE HOW IT WORKS
                </button>
              </div>


            </div>

            {/* Right: Mockup */}
            <div className="animate-slide-up lg:pl-4">
              <HeroMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section id="features" className="py-24 border-t border-cyber-border/30 bg-cyber-dark/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 text-neon-cyan font-cyber tracking-widest text-xs font-bold">
              // CORE_FEATURES
            </div>
            <h2 className="text-3xl sm:text-4xl font-cyber font-black text-white uppercase tracking-wider">
              WHAT <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink">SKILLOVIX OFFERS</span>
            </h2>
            <p className="text-sm text-slate-400 font-rajdhani tracking-widest uppercase max-w-xl mx-auto">
              Our comprehensive system tracks, recommends, and analyses your tech stack in real-time.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 border-t border-cyber-border/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 text-neon-pink font-cyber tracking-widest text-xs font-bold">
              // THREE_STEPS_TO_EVOLVE
            </div>
            <h2 className="text-3xl sm:text-4xl font-cyber font-black text-white uppercase tracking-wider">
              HOW IT WORKS
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector Dotted Line */}
            <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 border-t-2 border-dashed border-neon-cyan/20 z-0" />

            {[
              {
                num: '01',
                icon: <Users size={28} className="text-neon-cyan" />,
                title: 'CREATE PROFILE',
                desc: 'Fill out our interactive assessment mapping your current skills, availability, and targets.',
              },
              {
                num: '02',
                icon: <Brain size={28} className="text-neon-purple" />,
                title: 'GENERATE ROADMAP',
                desc: 'Skillovix AI builds a step-by-step custom curriculum showing exactly what to study and when.',
              },
              {
                num: '03',
                icon: <Award size={28} className="text-neon-green" />,
                title: 'EVOLVE & LAND ROLE',
                desc: 'Complete recommended projects, track your readiness metrics, and close your skill gaps.',
              },
            ].map((step) => (
              <div
                key={step.num}
                className="glass-card relative flex flex-col items-center text-center p-8 border-neon-cyan/25 hover:border-neon-cyan/60 hover:shadow-[0_0_20px_rgba(0,255,240,0.15)] transition-all duration-300 z-10"
              >
                <div className="font-cyber font-black text-5xl text-neon-purple drop-shadow-[0_0_10px_rgba(168,85,247,0.4)] mb-4">{step.num}</div>
                <div className="w-14 h-14 rounded-2xl bg-cyber-surface/60 flex items-center justify-center mb-4 border border-cyber-border/60 shadow-inner">
                  {step.icon}
                </div>
                <h3 className="text-lg font-rajdhani font-bold text-white uppercase tracking-wider mb-2">{step.title}</h3>
                <p className="text-sm font-inter text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/register"
              className="cyber-btn inline-flex items-center gap-2 hover:scale-105"
            >
              <Zap size={18} fill="white" />
              START FREE NOW
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="py-24 border-t border-cyber-border/30 bg-cyber-dark/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 text-neon-purple font-cyber tracking-widest text-xs font-bold">
              // STUDENT_REVIEWS.EXE
            </div>
            <h2 className="text-3xl sm:text-4xl font-cyber font-black text-white uppercase tracking-wider">
              CLIENT TESTIMONIALS
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 border-t border-cyber-border/30 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 text-neon-cyan font-cyber tracking-widest text-xs font-bold">
              // FAQ.SYS
            </div>
            <h2 className="text-3xl sm:text-4xl font-cyber font-black text-white uppercase tracking-wider">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((f) => (
              <FAQItem key={f.question} {...f} />
            ))}
          </div>
        </div>
      </section>


      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="border-t border-cyber-border/30 bg-cyber-black/95 py-12 relative">
        {/* Footer bottom line */}
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #2563EB, #38BDF8)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Logo + tagline */}
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.4)]">
                <Zap size={16} className="text-white drop-shadow-[0_0_3px_white]" fill="white" />
              </div>
              <div>
                <span className="font-cyber font-black text-base tracking-wider text-white drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">SKILLOVIX</span>
                <p className="text-[9px] font-cyber font-semibold text-neon-cyan tracking-wider mt-0.5 leading-none">// EVOLVE YOUR SKILLS. ELEVATE YOUR CAREER.</p>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6">
              {['features', 'how-it-works', 'faq'].map((id) => (
                <button
                  key={id}
                  onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-xs font-rajdhani font-bold uppercase tracking-wider text-slate-400 hover:text-neon-cyan hover:drop-shadow-[0_0_5px_rgba(0,255,240,0.5)] transition-all cursor-pointer"
                >
                  {id === 'how-it-works' ? 'How It Works' : id}
                </button>
              ))}
            </div>

            {/* Copyright */}
            <p className="text-xs font-rajdhani tracking-wider text-slate-500 uppercase">
              © 2026 SKILLOVIX. NEURAL_MATRIX_V1.0.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
