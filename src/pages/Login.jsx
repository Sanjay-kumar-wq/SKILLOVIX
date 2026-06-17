import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import useStore from '../store/useStore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const DEMO_EMAIL = 'demo@skillovix.com';
const DEMO_PASSWORD = 'demo123';
const DEMO_NAME = 'Demo Student';

export default function Login() {
  const { setUser } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "SKILLOVIX ⚡ | LOGIN";
  }, []);

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (!form.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    setServerError('');
  };

  const attemptLogin = async (email, password, name) => {
    // 1. Check array of users in localStorage
    const savedUsers = localStorage.getItem('skillovix_users');
    if (savedUsers) {
      const users = JSON.parse(savedUsers);
      const matchedUser = users.find(
        (u) => u.email === email.toLowerCase() && u.password === password
      );
      if (matchedUser) {
        setUser({ name: matchedUser.name, email: matchedUser.email });
        return true;
      }
    }

    // 2. Check legacy single user format for backward compatibility
    const saved = localStorage.getItem('skillovix_user_data');
    if (saved) {
      const userData = JSON.parse(saved);
      if (userData.email === email.toLowerCase() && userData.password === password) {
        setUser({ name: userData.name, email: userData.email });
        return true;
      }
    }

    // 3. Check demo credentials
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      setUser({ name: name || DEMO_NAME, email: DEMO_EMAIL });
      return true;
    }

    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const success = await attemptLogin(form.email, form.password);
    if (success) {
      const currentCareer = useStore.getState().career;
      if (!currentCareer) {
        navigate('/assessment');
      } else {
        navigate('/dashboard');
      }
    } else {
      setServerError('ACCESS DENIED: Invalid credentials. Use Demo Account!');
    }
    setLoading(false);
  };

  const handleDemo = async () => {
    setDemoLoading(true);
    setForm({ email: DEMO_EMAIL, password: DEMO_PASSWORD });
    await new Promise((r) => setTimeout(r, 700));
    setUser({ name: DEMO_NAME, email: DEMO_EMAIL });
    
    const currentCareer = useStore.getState().career;
    if (!currentCareer) {
      navigate('/assessment');
    } else {
      navigate('/dashboard');
    }
    setDemoLoading(false);
  };

  return (
    <div className="min-h-screen bg-cyber-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating neon background orbs */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-neon-purple/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-neon-cyan/10 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md animate-fade-in relative z-10">
        {/* Glass Card Container */}
        <div className="glass-card p-8 border-neon-purple/30 shadow-[0_0_25px_rgba(168,85,247,0.15)]">
          {/* Logo */}
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)] group-hover:scale-105 transition-transform">
                <Zap size={24} className="text-white drop-shadow-[0_0_3px_white]" fill="white" />
              </div>
              <div>
                <h1 className="font-cyber font-black text-xl tracking-wider text-white drop-shadow-[0_0_5px_rgba(168,85,247,0.4)]">SKILLOVIX</h1>
                <p className="text-[7px] font-cyber font-bold tracking-widest text-neon-cyan leading-none mt-1">// SKILL EVOLUTION INTELLIGENCE</p>
              </div>
            </Link>
          </div>

          <div className="mb-6 text-center">
            <h2 className="text-base font-rajdhani font-bold uppercase tracking-wider text-slate-200">PORTAL AUTHENTICATION</h2>
            <p className="text-xs text-slate-400 font-rajdhani uppercase tracking-widest mt-1">// ACCESS_PORTAL.EXE</p>
          </div>

          {/* Server error */}
          {serverError && (
            <div className="mb-4 p-3 rounded-xl bg-neon-pink/10 border border-neon-pink/30 text-neon-pink text-xs font-rajdhani font-bold tracking-wide uppercase shadow-[0_0_8px_rgba(255,0,110,0.2)] animate-slide-down">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              id="login-email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange('email')}
              error={errors.email}
              icon={<Mail size={16} />}
              required
            />

            <Input
              id="login-password"
              label="Password"
              type="password"
              placeholder="Your password"
              value={form.password}
              onChange={handleChange('password')}
              error={errors.password}
              icon={<Lock size={16} />}
              required
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              className="mt-2"
            >
              {loading ? 'VERIFYING...' : 'SIGN IN'}
              {!loading && <ArrowRight size={16} />}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gradient-to-r from-neon-purple/50 to-transparent" />
            <span className="text-[10px] font-cyber font-bold text-slate-500 uppercase tracking-widest">// OR</span>
            <div className="flex-1 h-px bg-gradient-to-l from-neon-purple/50 to-transparent" />
          </div>

          {/* Demo Button */}
          <button
            type="button"
            onClick={handleDemo}
            disabled={demoLoading}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-neon-cyan/50 text-neon-cyan text-xs font-cyber font-bold tracking-wider hover:bg-neon-cyan/10 hover:border-neon-cyan transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_10px_rgba(0,255,240,0.15)]"
          >
            {demoLoading ? (
              <span className="spinner border-neon-cyan/30 border-t-neon-cyan" />
            ) : (
              <Sparkles size={14} className="text-neon-cyan drop-shadow-[0_0_3px_#00FFF0]" />
            )}
            {demoLoading ? 'LOADING DEMO...' : 'BYPASS WITH DEMO ACCESS'}
          </button>

          {/* Register link */}
          <p className="text-center text-sm font-rajdhani font-semibold text-slate-400 uppercase tracking-wider mt-6">
            New node in the network?{' '}
            <Link
              to="/register"
              className="text-neon-cyan hover:drop-shadow-[0_0_5px_rgba(0,255,240,0.5)] transition-all font-bold"
            >
              REGISTER
            </Link>
          </p>
        </div>

        <p className="text-center text-[10px] font-rajdhani text-slate-500 uppercase tracking-wider mt-4">
          Skillovix — Neural Career Planning
        </p>
      </div>
    </div>
  );
}
