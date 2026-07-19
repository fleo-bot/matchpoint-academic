import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/Icons';
import './LoginPage.css';

const DEMO_USERS = {
  admin: {
    id: 'a001',
    name: 'System Administrator',
    role: 'admin',
    email: 'admin@matchpoint.edu',
    password: 'admin123',
  },
  faculty: [
    { id: 'f001', name: 'Dr. Maria Santos', role: 'faculty', email: 'm.santos@matchpoint.edu', password: 'faculty123' },
    { id: 'f002', name: 'Prof. James Reyes', role: 'faculty', email: 'j.reyes@matchpoint.edu', password: 'faculty123' },
    { id: 'f003', name: 'Dr. Angela Cruz', role: 'faculty', email: 'a.cruz@matchpoint.edu', password: 'faculty123' },
    { id: 'f004', name: 'Engr. Ramon Dela Cruz', role: 'faculty', email: 'r.delacruz@matchpoint.edu', password: 'faculty123' },
    { id: 'f005', name: 'Dr. Liza Fernandez', role: 'faculty', email: 'l.fernandez@matchpoint.edu', password: 'faculty123' },
    { id: 'f006', name: 'Prof. Kevin Tan', role: 'faculty', email: 'k.tan@matchpoint.edu', password: 'faculty123' },
  ],
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState(null); // null | 'admin' | 'faculty'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleRoleSelect = (r) => {
    setRole(r);
    setError('');
    setEmail('');
    setPassword('');
    // Pre-fill demo credentials
    if (r === 'admin') {
      setEmail(DEMO_USERS.admin.email);
      setPassword(DEMO_USERS.admin.password);
    } else {
      setEmail(DEMO_USERS.faculty[0].email);
      setPassword('faculty123');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (role === 'admin') {
        if (email === DEMO_USERS.admin.email && password === DEMO_USERS.admin.password) {
          login(DEMO_USERS.admin);
          navigate('/admin');
        } else {
          setError('Invalid admin credentials. Try admin@matchpoint.edu / admin123');
        }
      } else {
        const found = DEMO_USERS.faculty.find(f => f.email === email && f.password === password);
        if (found) {
          login(found);
          navigate('/faculty');
        } else {
          setError('Invalid faculty credentials. Try any faculty email with password: faculty123');
        }
      }
      setLoading(false);
    }, 900);
  };

  const handleBack = () => {
    setRole(null);
    setError('');
  };

  return (
    <div className="login">
      {/* Animated background */}
      <div className="login__bg">
        <div className="login__bg-ring login__bg-ring--1" />
        <div className="login__bg-ring login__bg-ring--2" />
        <div className="login__bg-ring login__bg-ring--3" />
        <div className="login__bg-grid" />
      </div>

      {/* Nav bar brand */}
      <div className="login__topbar">
        <button className="login__brand" onClick={() => navigate('/')}>
          <svg width="30" height="30" viewBox="0 0 44 44" fill="none">
            <circle cx="22" cy="22" r="20" stroke="url(#lGrad)" strokeWidth="2"/>
            <circle cx="22" cy="22" r="13" stroke="#96ACB7" strokeWidth="1.5" strokeDasharray="4 2"/>
            <circle cx="22" cy="22" r="4" fill="url(#lGrad)"/>
            <line x1="22" y1="2" x2="22" y2="10" stroke="#96ACB7" strokeWidth="2" strokeLinecap="round"/>
            <line x1="22" y1="34" x2="22" y2="42" stroke="#96ACB7" strokeWidth="2" strokeLinecap="round"/>
            <line x1="2" y1="22" x2="10" y2="22" stroke="#96ACB7" strokeWidth="2" strokeLinecap="round"/>
            <line x1="34" y1="22" x2="42" y2="22" stroke="#96ACB7" strokeWidth="2" strokeLinecap="round"/>
            <defs>
              <linearGradient id="lGrad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                <stop stopColor="#96ACB7"/><stop offset="1" stopColor="#FFFFFF"/>
              </linearGradient>
            </defs>
          </svg>
          <div>
            <div className="login__brand-name">MatchPoint</div>
            <div className="login__brand-sub">Academic</div>
          </div>
        </button>
        <button className="login__back-home" onClick={() => navigate('/')}>
          <Icon.ArrowLeft size={14} /> Back to Home
        </button>
      </div>

      {/* Main card */}
      <div className="login__main">
        <div className="login__card">

          {/* Step indicator */}
          <div className="login__steps">
            <div className={`login__step ${role !== null ? 'login__step--done' : 'login__step--active'}`}>
              <div className="login__step-dot">{role !== null ? <Icon.Check size={12} /> : '1'}</div>
              <span>Select Role</span>
            </div>
            <div className="login__step-line" />
            <div className={`login__step ${role !== null ? 'login__step--active' : ''}`}>
              <div className="login__step-dot">2</div>
              <span>Sign In</span>
            </div>
          </div>

          {/* ── STEP 1: Role Selector ── */}
          {role === null && (
            <div className="login__role-section">
              <div className="login__header">
                <h1 className="login__title">Welcome Back</h1>
                <p className="login__subtitle">Select your role to continue to MatchPoint Academic</p>
              </div>

              <div className="login__role-grid">
                {/* Admin card */}
                <button className="login__role-card login__role-card--admin" onClick={() => handleRoleSelect('admin')}>
                  <div className="login__role-glow" />
                  <div className="login__role-icon-wrap">
                    <div className="login__role-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="login__role-info">
                    <h3 className="login__role-name">Administrator</h3>
                    <p className="login__role-desc">Manage faculty assignments, view analytics, approve course requests, and monitor workload distribution.</p>
                    <div className="login__role-perms">
                      {['Full Dashboard Access', 'Faculty Management', 'Recommendation Engine', 'Analytics & Reports'].map(p => (
                        <span key={p} className="login__role-perm">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="login__role-arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </div>
                </button>

                {/* Faculty card */}
                <button className="login__role-card login__role-card--faculty" onClick={() => handleRoleSelect('faculty')}>
                  <div className="login__role-glow" />
                  <div className="login__role-icon-wrap">
                    <div className="login__role-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                      </svg>
                    </div>
                  </div>
                  <div className="login__role-info">
                    <h3 className="login__role-name">Faculty Member</h3>
                    <p className="login__role-desc">View your course assignments, track specialization trajectory, and submit subject preference requests.</p>
                    <div className="login__role-perms">
                      {['Personal Dashboard', 'Specialization Tracker', 'Course Schedule', 'Request Subjects'].map(p => (
                        <span key={p} className="login__role-perm">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="login__role-arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </div>
                </button>
              </div>

              {/* Demo note */}
              <div className="login__demo-note">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Demo credentials are pre-filled automatically on role selection.
              </div>
            </div>
          )}

          {/* ── STEP 2: Login Form ── */}
          {role !== null && (
            <div className="login__form-section">
              <button className="login__back" onClick={handleBack}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                </svg>
                Change Role
              </button>

              <div className="login__header">
                <div className="login__role-badge login__role-badge--active">
                  {role === 'admin' ? <Icon.Shield size={14} /> : <Icon.GraduationCap size={14} />}
                  Signing in as {role === 'admin' ? 'Administrator' : 'Faculty Member'}
                </div>
                <h1 className="login__title">Sign In</h1>
                <p className="login__subtitle">Enter your credentials to access your dashboard</p>
              </div>

              <form className="login__form" onSubmit={handleSubmit}>
                {/* Faculty selector if role is faculty */}
                {role === 'faculty' && (
                  <div className="login__field">
                    <label className="form-label">Select Faculty Account</label>
                    <select
                      className="form-input login__select"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    >
                      {DEMO_USERS.faculty.map(f => (
                        <option key={f.id} value={f.email}>{f.name} — {f.email}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="login__field">
                  <label className="form-label">Email Address</label>
                  <div className="login__input-wrap">
                    <svg className="login__input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <input
                      type="email"
                      className="form-input login__input"
                      placeholder="your@matchpoint.edu"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      required
                      readOnly={role === 'admin'}
                    />
                  </div>
                </div>

                <div className="login__field">
                  <label className="form-label">Password</label>
                  <div className="login__input-wrap">
                    <svg className="login__input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                    <input
                      type={showPass ? 'text' : 'password'}
                      className="form-input login__input"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      required
                    />
                    <button type="button" className="login__show-pass" onClick={() => setShowPass(!showPass)}>
                      {showPass
                        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="login__error">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className={`btn btn-primary login__submit ${loading ? 'login__submit--loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="login__spinner" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In to {role === 'admin' ? 'Admin Panel' : 'Faculty Portal'}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Demo credentials hint */}
              <div className="login__credentials">
                <div className="login__cred-title">Demo Credentials</div>
                {role === 'admin'
                  ? <div className="login__cred-row"><span>Email:</span> admin@matchpoint.edu &nbsp;|&nbsp; <span>Password:</span> admin123</div>
                  : <div className="login__cred-row"><span>Any faculty email</span> with password: <span>faculty123</span></div>
                }
              </div>
            </div>
          )}
        </div>

        {/* Side info panel (desktop only) */}
        <div className="login__side">
          <div className="login__side-content">
            <div className="login__side-logo">
              <svg width="48" height="48" viewBox="0 0 44 44" fill="none">
                <circle cx="22" cy="22" r="20" stroke="url(#sideGrad)" strokeWidth="1.5"/>
                <circle cx="22" cy="22" r="13" stroke="#96ACB7" strokeWidth="1" strokeDasharray="4 2"/>
                <circle cx="22" cy="22" r="4" fill="url(#sideGrad)"/>
                <line x1="22" y1="2" x2="22" y2="10" stroke="#96ACB7" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="22" y1="34" x2="22" y2="42" stroke="#96ACB7" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="2" y1="22" x2="10" y2="22" stroke="#96ACB7" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="34" y1="22" x2="42" y2="22" stroke="#96ACB7" strokeWidth="1.5" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="sideGrad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#96ACB7"/><stop offset="1" stopColor="#FFFFFF"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h2 className="login__side-title">MatchPoint<br/>Academic</h2>
            <p className="login__side-desc">Faculty & Course Monitoring System powered by R analytics and predictive intelligence.</p>

            <div className="login__side-features">
              {[
                { icon: Icon.Target, text: 'Smart Compatibility Scoring' },
                { icon: Icon.TrendingUp, text: 'Specialization Prediction' },
                { icon: Icon.BarChart, text: 'Workload Dashboard' },
                { icon: Icon.Mail, text: 'Course Request System' },
              ].map((f, i) => (
                <div key={i} className="login__side-feature">
                  <span><f.icon size={16} /></span>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>

            <div className="login__side-stack">
              {['React', 'R', 'Plumber', 'ggplot2', 'dplyr'].map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
