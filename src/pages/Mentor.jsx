import React, { useState, useEffect, useRef } from 'react';
import { Send, Zap, Bot, RefreshCw, Sparkles } from 'lucide-react';
import useStore from '../store/useStore';
import { roadmaps } from '../data/roadmaps';

const QUICK_CHIPS = [
  { label: 'What should I evolve next? ⚡', key: 'next' },
  { label: 'Am I ready for internships? 💼', key: 'internship' },
  { label: 'Which project should I build? 🛠️', key: 'project' },
  { label: 'How can I improve my resume? 📄', key: 'resume' },
  { label: 'What skills am I missing? 🔍', key: 'skills' },
  { label: 'How long to get a job? ⏱️', key: 'timeline' },
];

function getFallback(text, { career, overallProgress, currentSkills, roadmap }) {
  const t = text.toLowerCase();
  const allSkills = roadmap
    ? [...(roadmap.beginner || []), ...(roadmap.intermediate || []), ...(roadmap.advanced || [])]
    : [];
  const missing = allSkills.filter((s) => !currentSkills.includes(s)).slice(0, 3);
  const nextSkill = missing[0] || 'core fundamentals';

  if (t.includes('next') || t.includes('learn') || t.includes('evolve')) {
    return `Based on your Skillovix roadmap, focus on **${nextSkill}** next. You're **${overallProgress}%** evolved — keep going! ⚡`;
  }
  if (t.includes('intern') || t.includes('ready')) {
    const status = overallProgress >= 60 ? 'well-positioned' : 'building up readiness';
    return `At **${overallProgress}%** on Skillovix, you're **${status}** for internships. Key skills to evolve: ${missing.map((s) => `**${s}**`).join(', ')}. Check your Skillovix Readiness Score! ⚡`;
  }
  if (t.includes('project') || t.includes('build')) {
    const projectIdea =
      career === 'Full Stack Developer'
        ? 'a full-stack e-commerce app'
        : career === 'Data Scientist'
        ? 'a data analysis dashboard'
        : career === 'AI/ML Engineer'
        ? 'an ML-powered recommendation system'
        : 'a portfolio project';
    return `Skillovix recommends building **${projectIdea}** at your level. This will showcase ${missing[0] || 'your key skills'}. Check your Skillovix Project Lab! 💼`;
  }
  if (t.includes('resume')) {
    return `For **${career}**, highlight ${currentSkills.slice(0, 3).map((s) => `**${s}**`).join(', ')} on your resume. Visit Skillovix Resume Analyzer for a full ATS check! 📄`;
  }
  if (t.includes('miss') || t.includes('skill')) {
    return `Your Skillovix Skill Gap shows you need: ${missing.map((s) => `**${s}**`).join(', ')}. Head to the Skill Gap page for your full evolution plan! 🔍`;
  }
  if (t.includes('time') || t.includes('long') || t.includes('job')) {
    const months = Math.max(3, Math.round((100 - overallProgress) / 10));
    return `Based on your **${overallProgress}%** Skillovix progress and ${career} path, you could be job-ready in approximately **${months} months** with consistent effort. Keep evolving! ⚡`;
  }
  return `Great question! Your Skillovix journey is **${overallProgress}%** complete on the ${career} path. ${missing.length > 0 ? `Focus on evolving: ${missing.map((s) => `**${s}**`).join(', ')}.` : ''} Keep evolving! ⚡`;
}

function renderMessage(text) {
  // Convert **bold**, bullet points, line breaks
  return text.split('\n').map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <span key={i}>
        {i > 0 && <br />}
        {parts.map((part, j) =>
          j % 2 === 1 ? (
            <strong key={j} className="font-semibold text-sky-300">
              {part}
            </strong>
          ) : (
            part
          )
        )}
      </span>
    );
  });
}

export default function Mentor() {
  const { user, career, currentSkills, experienceLevel, educationLevel, studyHours, completedSkills, chatHistory, addMessage, clearChatHistory } = useStore();

  const roadmap = roadmaps[career] || {};
  const allSkills = [...(roadmap.beginner || []), ...(roadmap.intermediate || []), ...(roadmap.advanced || [])];
  const completedForCareer = completedSkills[career] || [];
  const overallProgress = allSkills.length > 0 ? Math.round((completedForCareer.length / allSkills.length) * 100) : 0;

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    document.title = 'Skillovix | AI Mentor';
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  // Welcome message on first load
  useEffect(() => {
    if (chatHistory.length === 0) {
      addMessage({
        role: 'assistant',
        content: `Hey ${user.name || 'there'}! 👋 I'm your **Skillovix AI Mentor** — your personal career coach.\n\nI can see you're on the **${career || 'tech'}** path and you're **${overallProgress}%** evolved on Skillovix. I know your full profile, so let's make your journey count!\n\nWhat would you like to evolve today? ⚡`,
        timestamp: Date.now(),
      });
    }
  }, []);


  const sendMessage = async (userMessage) => {
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY
      
      console.log('API Key exists:', !!apiKey)
      console.log('API Key starts with:', apiKey?.substring(0, 10))

      if (!apiKey) {
        return 'API key missing! Check .env file.'
      }

      const systemPrompt = `You are Skillovix AI Mentor, a friendly career coach for Indian engineering students. Give advice in 3-4 sentences. End with Keep evolving! ⚡`

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]

      console.log('Sending to Groq...')

      const response = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: messages,
            max_tokens: 300,
            temperature: 0.7
          })
        }
      )

      console.log('Response status:', response.status)
      
      const data = await response.json()
      console.log('Full response:', data)

      if (!response.ok) {
        console.error('API Error:', data)
        return `Error ${response.status}: ${data.error?.message || 'Unknown error'}`
      }

      const reply = data?.choices?.[0]?.message?.content
      
      if (!reply) {
        return 'No response received. Try again!'
      }

      return reply

    } catch (error) {
      console.error('Fetch failed:', error.message)
      return `Connection failed: ${error.message}`
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMsg = { role: 'user', content: text.trim(), timestamp: Date.now() };
    addMessage(userMsg);
    setInput('');
    setLoading(true);

    const reply = await sendMessage(text.trim());

    addMessage({ role: 'assistant', content: reply, timestamp: Date.now() });
    setLoading(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  return (
    <div className="flex flex-col h-screen bg-[#070E1A] overflow-hidden">
      {/* Header */}
      <div
        className="shrink-0 px-6 py-4 border-b flex items-center justify-between"
        style={{ borderColor: '#1E3A5F', background: '#0A1120' }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(135deg, #2563EB, #38BDF8)',
              boxShadow: '0 0 20px rgba(37,99,235,0.5)',
            }}
          >
            <Bot size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              🤖 Skillovix AI Mentor
            </h1>
            <p className="text-sm text-slate-400">
              Your personal AI career coach — powered by Skillovix •{' '}
              <span className="text-sky-400">Knows your full Skillovix profile</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: '#1E3A5F', color: '#38BDF8' }}
          >
            <Zap size={12} fill="currentColor" />
            {overallProgress}% Evolved
          </div>
          <button
            onClick={clearChatHistory}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
            title="Clear chat"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="flex flex-col gap-1 max-w-[85%] md:max-w-[70%]">
                <span className="text-[11px] font-semibold text-sky-400 flex items-center gap-1 ml-1">
                  <Zap size={10} fill="currentColor" /> Skillovix Mentor
                </span>
                <div
                  className="px-5 py-4 rounded-2xl rounded-tl-sm text-sm leading-relaxed text-slate-200"
                  style={{
                    background: '#0D1B2E',
                    border: '1px solid #1E3A5F',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  }}
                >
                  {renderMessage(msg.content)}
                </div>
              </div>
            )}
            {msg.role === 'user' && (
              <div
                className="max-w-[85%] md:max-w-[70%] px-5 py-4 rounded-2xl rounded-tr-sm text-sm leading-relaxed text-white"
                style={{
                  background: 'linear-gradient(135deg, #1D4ED8, #2563EB)',
                  boxShadow: '0 4px 20px rgba(37,99,235,0.3)',
                }}
              >
                {msg.content}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex flex-col gap-1 max-w-[70%]">
              <span className="text-[11px] font-semibold text-sky-400 flex items-center gap-1 ml-1">
                <Zap size={10} fill="currentColor" /> Skillovix Mentor
              </span>
              <div
                className="px-5 py-4 rounded-2xl rounded-tl-sm flex items-center gap-3"
                style={{ background: '#0D1B2E', border: '1px solid #1E3A5F' }}
              >
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-sky-400"
                      style={{
                        animation: 'bounce 1.2s ease-in-out infinite',
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-400">Skillovix Mentor is thinking... ⚡</span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick Chips */}
      <div
        className="shrink-0 px-4 md:px-8 py-3 border-t flex gap-2 overflow-x-auto scrollbar-hide"
        style={{ borderColor: '#1E3A5F', background: '#0A1120' }}
      >
        {QUICK_CHIPS.map((chip) => (
          <button
            key={chip.key}
            onClick={() => handleSendMessage(chip.label)}
            disabled={loading}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: '#1E3A5F',
              color: '#38BDF8',
              border: '1px solid #2563EB33',
              whiteSpace: 'nowrap',
            }}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div
        className="shrink-0 px-4 md:px-8 py-4 border-t"
        style={{ borderColor: '#1E3A5F', background: '#0A1120' }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex items-center gap-3"
        >
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your Skillovix mentor..."
              disabled={loading}
              className="w-full px-5 py-3.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all disabled:opacity-50"
              style={{
                background: '#0D1B2E',
                border: '1px solid #1E3A5F',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
              onBlur={(e) => (e.target.style.borderColor = '#1E3A5F')}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3.5 rounded-xl font-semibold text-white flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #2563EB, #38BDF8)',
              boxShadow: '0 0 16px rgba(37,99,235,0.4)',
            }}
          >
            <Zap size={16} fill="currentColor" />
            <span className="hidden sm:block">Send</span>
          </button>
        </form>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
