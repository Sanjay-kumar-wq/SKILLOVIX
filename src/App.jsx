import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useStore from './store/useStore';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Assessment from './pages/Assessment';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import SkillGap from './pages/SkillGap';
import Projects from './pages/Projects';
import Mentor from './pages/Mentor';
import Readiness from './pages/Readiness';
import Resume from './pages/Resume';
import Compare from './pages/Compare';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Layout
import Navbar from './components/layout/Navbar';

// Toast
import { ToastProvider } from './components/ui/Toast';

// ── Protected Route ──────────────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { user } = useStore();
  if (!user.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// ── Public Only Route ────────────────────────────────────────────────────────
function PublicRoute({ children }) {
  const { user, career } = useStore();
  if (user.isLoggedIn) {
    if (!career) {
      return <Navigate to="/assessment" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

// ── Layout Wrapper for authenticated pages ────────────────────────────────────
function AuthLayout({ children }) {
  return (
    <Navbar>
      {children}
    </Navbar>
  );
}

// ── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const { theme } = useStore();

  // Apply theme class to html element on mount and when theme changes
  useEffect(() => {
    // On first load, read from localStorage to apply correct theme before store rehydrates
    const savedTheme = localStorage.getItem('theme') || theme || 'dark';
    const html = document.documentElement;
    if (savedTheme === 'dark') {
      html.classList.add('dark');
      html.classList.remove('light');
      html.style.backgroundColor = '';
    } else {
      html.classList.remove('dark');
      html.classList.add('light');
      html.style.backgroundColor = '#F8FAFC';
    }
  }, [theme]);

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Assessment - Protected */}
          <Route
            path="/assessment"
            element={
              <ProtectedRoute>
                <Assessment />
              </ProtectedRoute>
            }
          />

          {/* Authenticated routes with sidebar layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AuthLayout>
                  <Dashboard />
                </AuthLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/roadmap"
            element={
              <ProtectedRoute>
                <AuthLayout>
                  <Roadmap />
                </AuthLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/skill-gap"
            element={
              <ProtectedRoute>
                <AuthLayout>
                  <SkillGap />
                </AuthLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <AuthLayout>
                  <Projects />
                </AuthLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/mentor"
            element={
              <ProtectedRoute>
                <AuthLayout>
                  <Mentor />
                </AuthLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/readiness"
            element={
              <ProtectedRoute>
                <AuthLayout>
                  <Readiness />
                </AuthLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/resume"
            element={
              <ProtectedRoute>
                <AuthLayout>
                  <Resume />
                </AuthLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/compare"
            element={
              <ProtectedRoute>
                <AuthLayout>
                  <Compare />
                </AuthLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AuthLayout>
                  <Profile />
                </AuthLayout>
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
