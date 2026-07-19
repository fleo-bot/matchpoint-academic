import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Icon from '../components/Icons';
import './HomePage.css';

// Animated counter hook
function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// Particle background
function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    let animId;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(150, 172, 183, ${p.alpha})`;
        ctx.fill();
      });
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(150, 172, 183, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={canvasRef} className="home__particles" />;
}

// Feature card data
const FEATURES = [
  {
    icon: Icon.Target,
    tag: 'AI-Powered',
    title: 'Smart Faculty-to-Course Recommendation Engine',
    desc: 'Analytics-driven compatibility scoring ranks the best faculty members for each course. Weighted scoring via historical fit, academic profile, and real-time workload checks.',
    pill: 'dplyr · DT Package',
    color: 'blue',
  },
  {
    icon: Icon.TrendingUp,
    tag: 'Predictive',
    title: 'Dynamic Specialization Predictor',
    desc: 'Time-series tracking of faculty teaching portfolios across semesters. Flags developing specialists at 60%+ subject concentration, and predicts future specialization probability.',
    pill: 'ggplot2 · glm()',
    color: 'teal',
  },
  {
    icon: Icon.BarChart,
    tag: 'Real-Time',
    title: 'Workload & Course Distribution Dashboard',
    desc: 'A comprehensive dashboard for admin staffing insights. Bar charts, treemaps, and profile breakdowns to spot over-allocation, shortages, and demographic patterns at a glance.',
    pill: 'shinydashboard · plotly',
    color: 'slate',
  },
  {
    icon: Icon.Mail,
    tag: 'Faculty Tool',
    title: 'Request Subject System',
    desc: 'Faculty members can formally request course assignments. Requests are factored into the recommendation engine, giving faculty agency in shaping their teaching portfolio.',
    pill: 'Weighted Scoring',
    color: 'white',
  },
];

const STATS_DATA = [
  { value: 98, suffix: '%', label: 'Assignment Accuracy' },
  { value: 3, suffix: 'x', label: 'Faster Scheduling' },
  { value: 60, suffix: '%', label: 'Specialization Threshold' },
  { value: 100, suffix: '+', label: 'Data Points Tracked' },
];

const ROLES = [
  {
    role: 'admin',
    icon: Icon.Shield,
    title: 'Administrator',
    desc: 'Full access to recommendation engine, workload dashboards, specialization predictors, and faculty management tools.',
    pills: ['Manage Faculty', 'View Analytics', 'Approve Requests'],
  },
  {
    role: 'faculty',
    icon: Icon.GraduationCap,
    title: 'Faculty Member',
    desc: 'View your assigned courses, track your specialization trajectory, and submit course preference requests.',
    pills: ['View Schedule', 'Track Specialization', 'Request Subjects'],
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const c0 = useCounter(STATS_DATA[0].value, 1800, statsVisible);
  const c1 = useCounter(STATS_DATA[1].value, 1200, statsVisible);
  const c2 = useCounter(STATS_DATA[2].value, 1500, statsVisible);
  const c3 = useCounter(STATS_DATA[3].value, 2000, statsVisible);
  const counters = [c0, c1, c2, c3];

  return (
    <div className="home">
      <Navbar variant="default" />
      <ParticleField />

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="home__hero">
        <div className="home__hero-bg-ring home__hero-bg-ring--1" />
        <div className="home__hero-bg-ring home__hero-bg-ring--2" />
        <div className="home__hero-bg-ring home__hero-bg-ring--3" />

        <div className="container">
          <div className="home__hero-inner">
            <div className="home__hero-badge">
              <span className="home__hero-badge-dot" />
              Faculty & Course Monitoring System
            </div>

            <h1 className="home__hero-title">
              The Smartest Way to
              <br />
              <span className="home__hero-title-accent">Match Faculty</span>
              <br />
              to Courses
            </h1>

            <p className="home__hero-desc">
              MatchPoint Academic uses analytics-driven scoring, time-series prediction,
              and real-time workload monitoring to ensure every course gets the right instructor —
              every semester.
            </p>

            <div className="home__hero-actions">
              <button className="btn btn-primary home__hero-cta" onClick={() => navigate('/login')}>
                <span>Get Started</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
              <button className="btn btn-outline" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
                Explore Features
              </button>
            </div>

            <div className="home__hero-tags">
              {['R Programming', 'React', 'Plumber API', 'ggplot2', 'dplyr', 'Predictive Analytics'].map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Floating data preview card */}
        <div className="home__hero-float-card home__hero-float-card--1">
          <div className="home__float-label">Compatibility Score</div>
          <div className="home__float-value">96%</div>
          <div className="home__float-sub">Dr. Maria Santos → Machine Learning</div>
          <div className="home__float-bar">
            <div className="home__float-bar-fill" style={{ width: '96%' }} />
          </div>
        </div>

        <div className="home__hero-float-card home__hero-float-card--2">
          <div className="home__float-label">Developing Specialist</div>
          <div className="home__float-value home__float-value--sm">AI & ML</div>
          <div className="home__float-badge"><Icon.Flame size={12} /> 91% probability</div>
        </div>

        <div className="home__hero-float-card home__hero-float-card--3">
          <div className="home__float-label">Workload Alert</div>
          <div className="home__float-overload">Overloaded</div>
          <div className="home__float-sub">Engr. Ramon — 15/15 units</div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────── */}
      <section className="home__stats" ref={statsRef}>
        <div className="container">
          <div className="home__stats-grid">
            {STATS_DATA.map((s, i) => (
              <div key={i} className="home__stat-item">
                <div className="home__stat-value">
                  {counters[i]}{s.suffix}
                </div>
                <div className="home__stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────── */}
      <section className="home__features section" id="features">
        <div className="container">
          <div className="home__section-header">
            <div className="badge badge-dark">Core Features</div>
            <h2 className="home__section-title">Everything you need to run<br />a smarter academic department</h2>
            <p className="home__section-sub">Four integrated modules, powered by R, delivering real data intelligence for faculty and course management.</p>
          </div>

          <div className="home__features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className={`home__feature-card home__feature-card--${f.color}`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="home__feature-icon"><f.icon size={30} /></div>
                <div className="home__feature-tag">{f.tag}</div>
                <h3 className="home__feature-title">{f.title}</h3>
                <p className="home__feature-desc">{f.desc}</p>
                <div className="home__feature-pill">{f.pill}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section className="home__how section">
        <div className="container">
          <div className="home__section-header">
            <div className="badge badge-dark">Workflow</div>
            <h2 className="home__section-title">How MatchPoint Works</h2>
          </div>

          <div className="home__how-steps">
            {[
              { num: '01', title: 'Faculty Data Input', desc: 'Credentials, historical teaching records, and specialization data are loaded into the R backend.' },
              { num: '02', title: 'R Scoring Engine', desc: 'dplyr calculates weighted compatibility scores using 3 dimensions: historical fit, academic profile, and current workload.' },
              { num: '03', title: 'Ranked Recommendations', desc: 'Admin selects a course and receives a live ranked table with visual compatibility bars highlighting the top 3 matches.' },
              { num: '04', title: 'Predictive Insights', desc: 'ggplot2 charts and logistic regression flag developing specialists and forecast teaching trends for future semesters.' },
            ].map((step, i) => (
              <div key={i} className="home__how-step">
                <div className="home__how-num">{step.num}</div>
                <div className="home__how-connector" />
                <h4 className="home__how-title">{step.title}</h4>
                <p className="home__how-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLES ────────────────────────────────────── */}
      <section className="home__roles section">
        <div className="container">
          <div className="home__section-header">
            <div className="badge badge-dark">Access</div>
            <h2 className="home__section-title">Built for Two Roles</h2>
            <p className="home__section-sub">Tailored dashboards and tools for administrators and faculty members.</p>
          </div>

          <div className="home__roles-grid">
            {ROLES.map((r, i) => (
              <div key={i} className="home__role-card">
                <div className="home__role-icon"><r.icon size={38} /></div>
                <h3 className="home__role-title">{r.title}</h3>
                <p className="home__role-desc">{r.desc}</p>
                <div className="home__role-pills">
                  {r.pills.map(p => <span key={p} className="tag">{p}</span>)}
                </div>
                <button className="btn btn-outline home__role-btn" onClick={() => navigate('/login')}>
                  Sign in as {r.title}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="home__cta section">
        <div className="container">
          <div className="home__cta-box">
            <div className="home__cta-ring" />
            <div className="badge badge-white" style={{ margin: '0 auto 16px' }}>Ready to Begin</div>
            <h2 className="home__cta-title">
              Start optimizing your<br />academic department today
            </h2>
            <p className="home__cta-desc">Log in to access your dashboard and put data-driven faculty management to work.</p>
            <button className="btn btn-primary home__cta-btn" onClick={() => navigate('/login')}>
              Access the System
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className="home__footer">
        <div className="container">
          <div className="home__footer-inner">
            <div className="home__footer-brand">
              <svg width="28" height="28" viewBox="0 0 44 44" fill="none">
                <circle cx="22" cy="22" r="20" stroke="#96ACB7" strokeWidth="1.5"/>
                <circle cx="22" cy="22" r="4" fill="#96ACB7"/>
                <line x1="22" y1="2" x2="22" y2="10" stroke="#96ACB7" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="22" y1="34" x2="22" y2="42" stroke="#96ACB7" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="2" y1="22" x2="10" y2="22" stroke="#96ACB7" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="34" y1="22" x2="42" y2="22" stroke="#96ACB7" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>MatchPoint <span style={{ color: '#96ACB7' }}>Academic</span></span>
            </div>
            <p className="home__footer-copy">
              Faculty & Course Monitoring System · Built with React & R Programming
            </p>
            <div className="home__footer-stack">
              {['React', 'R', 'Plumber', 'ggplot2', 'dplyr', 'Recharts'].map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
