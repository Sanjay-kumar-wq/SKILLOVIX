import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, User, ArrowRight } from 'lucide-react';
import useStore from '../store/useStore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Register() {
  const { setUser } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "SKILLOVIX ⚡ | REGISTER";
  }, []);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required';
    else if (form.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';

    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email address';

    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    return newErrors;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    const emailKey = form.email.toLowerCase().trim();
    
    // Check if email already exists in users list
    const users = JSON.parse(localStorage.getItem('skillovix_users') || '[]');
    if (users.some((u) => u.email === emailKey)) {
      setErrors({ email: 'This email is already registered.' });
      setLoading(false);
      return;
    }

    // Save user to list
    const userData = {
      name: form.name.trim(),
      email: emailKey,
      password: form.password, // In production, NEVER store plain-text passwords
    };
    users.push(userData);
    localStorage.setItem('skillovix_users', JSON.stringify(users));

    // Keep legacy single-user store for backward compatibility
    localStorage.setItem('skillovix_user_data', JSON.stringify(userData));

    // Update Zustand store
    setUser({ name: userData.name, email: userData.email });

    // Simulate a brief loading animation
    await new Promise((r) => setTimeout(r, 800));

    setLoading(false);
    navigate('/assessment');
  };

  return (
    <div className="min-h-screen bg-cyber-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating neon background orbs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-neon-purple/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-neon-cyan/10 rounded-full blur-3xl -z-10" />

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
            <h2 className="text-base font-rajdhani font-bold uppercase tracking-wider text-slate-200">CREATE NEURAL PROFILE</h2>
            <p className="text-xs text-slate-400 font-rajdhani uppercase tracking-widest mt-1">// REGISTER_NEW_USER.EXE</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              id="reg-name"
              label="Full Name"
              type="text"
              placeholder="e.g. Priya Sharma"
              value={form.name}
              onChange={handleChange('name')}
              error={errors.name}
              icon={<User size={16} />}
              required
            />

            <Input
              id="reg-email"
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
              id="reg-password"
              label="Password"
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange('password')}
              error={errors.password}
              icon={<Lock size={16} />}
              required
            />

            <Input
              id="reg-confirm-password"
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              error={errors.confirmPassword}
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
              {loading ? 'INITIALIZING...' : 'CREATE PROFILE'}
              {!loading && <ArrowRight size={16} />}
            </Button>
          </form>

          {/* Login link */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gradient-to-r from-neon-purple/50 to-transparent" />
            <span className="text-[10px] font-cyber font-bold text-slate-500 uppercase tracking-widest">// CONNECT</span>
            <div className="flex-1 h-px bg-gradient-to-l from-neon-purple/50 to-transparent" />
          </div>

          <p className="text-center text-sm font-rajdhani font-semibold text-slate-400 uppercase tracking-wider">
            Already have a profile?{' '}
            <Link
              to="/login"
              className="text-neon-cyan hover:drop-shadow-[0_0_5px_rgba(0,255,240,0.5)] transition-all font-bold"
            >
              SIGN IN
            </Link>
          </p>
        </div>

        {/* Footer note */}
        <p className="text-center text-[10px] font-rajdhani text-slate-500 uppercase tracking-wider mt-4">
          By registering, you sync with our neural learning protocol.
        </p>
      </div>
    </div>
  );
}
