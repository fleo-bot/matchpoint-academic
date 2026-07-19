import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import StatCard from '../../components/StatCard';
import Icon from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import {
  SYSTEM_STATS,
  FACULTY,
  COURSES,
  WORKLOAD_SUMMARY,
  SUBJECT_COVERAGE,
} from '../../data/mockData';
import './AdminDashboard.css';

const QUICK_ACTIONS = [
  {
    icon: Icon.Target,
    title: 'Recommendation Engine',
    desc: 'Find best-fit faculty for any course with compatibility scoring.',
    path: '/admin/recommendation',
    tag: 'AI-Powered',
  },
  {
    icon: Icon.TrendingUp,
    title: 'Specialization Predictor',
    desc: 'Track and predict faculty specialization trajectories over time.',
    path: '/admin/specialization',
    tag: 'Predictive',
  },
  {
    icon: Icon.BarChart,
    title: 'Workload Dashboard',
    desc: 'Monitor load distribution and spot staffing gaps instantly.',
    path: '/admin/workload',
    tag: 'Real-Time',
  },
];

const FACULTY_RANKS = [
  'Instructor',
  'Assistant Professor',
  'Associate Professor',
  'Full Professor',
];

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Information Systems',
  'Mathematics',
  'Computer Engineering',
  'General Education',
];

const COURSE_CATEGORIES = [
  'Core IT',
  'Specialized Elective',
  'General Education',
];

const EMPTY_FACULTY = {
  name: '',
  degree: '',
  specialization: '',
  department: '',
  rank: '',
  email: '',
  yearsExperience: '',
};

const EMPTY_COURSE = {
  id: '',
  name: '',
  category: '',
  units: '',
  level: '',
  description: '',
};

export default function AdminDashboard() {
  const { user, requests, updateRequestStatus } = useAuth();
  const navigate = useNavigate();

  // Local faculty & courses state (seeded from mock data)
  const [facultyList, setFacultyList] = useState(FACULTY);
  const [courseList, setCourseList] = useState(COURSES);

  // Modal state for approve/deny
  const [modal, setModal] = useState(null); // { req, action: 'approve'|'deny' }
  const [adminNote, setAdminNote] = useState('');
  const [processing, setProcessing] = useState(false);

  // Add Faculty modal state
  const [showAddFaculty, setShowAddFaculty] = useState(false);
  const [facultyForm, setFacultyForm] = useState(EMPTY_FACULTY);
  const [facultyErrors, setFacultyErrors] = useState({});
  const [savingFaculty, setSavingFaculty] = useState(false);

  // Add Course modal state
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courseForm, setCourseForm] = useState(EMPTY_COURSE);
  const [courseErrors, setCourseErrors] = useState({});
  const [savingCourse, setSavingCourse] = useState(false);

  const pendingRequests = requests.filter(r => r.status === 'pending');

  const openModal = (req, action) => {
    setModal({ req, action });
    setAdminNote('');
  };

  const closeModal = () => {
    setModal(null);
    setAdminNote('');
  };

  const handleDecision = () => {
    if (!modal) return;
    setProcessing(true);
    setTimeout(() => {
      updateRequestStatus(modal.req.id, modal.action === 'approve' ? 'approved' : 'rejected', adminNote);
      setProcessing(false);
      closeModal();
    }, 800);
  };

  // ── Add Faculty handlers ──────────────────────────────────
  const openAddFaculty = () => {
    setFacultyForm(EMPTY_FACULTY);
    setFacultyErrors({});
    setShowAddFaculty(true);
  };

  const closeAddFaculty = () => {
    setShowAddFaculty(false);
    setFacultyErrors({});
  };

  const validateFaculty = () => {
    const errs = {};
    if (!facultyForm.name.trim()) errs.name = 'Name is required.';
    if (!facultyForm.degree.trim()) errs.degree = 'Degree is required.';
    if (!facultyForm.specialization.trim()) errs.specialization = 'Specialization is required.';
    if (!facultyForm.department) errs.department = 'Department is required.';
    if (!facultyForm.rank) errs.rank = 'Rank is required.';
    if (!facultyForm.email.trim()) errs.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(facultyForm.email)) errs.email = 'Enter a valid email.';
    if (facultyForm.yearsExperience !== '' && isNaN(Number(facultyForm.yearsExperience)))
      errs.yearsExperience = 'Must be a number.';
    return errs;
  };

  const handleSaveFaculty = () => {
    const errs = validateFaculty();
    if (Object.keys(errs).length) { setFacultyErrors(errs); return; }
    setSavingFaculty(true);
    setTimeout(() => {
      const initials = facultyForm.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(s => s[0].toUpperCase())
        .join('');
      const newFaculty = {
        id: `f${String(facultyList.length + 1).padStart(3, '0')}`,
        name: facultyForm.name.trim(),
        degree: facultyForm.degree.trim(),
        specialization: facultyForm.specialization.trim(),
        department: facultyForm.department,
        rank: facultyForm.rank,
        email: facultyForm.email.trim(),
        yearsExperience: Number(facultyForm.yearsExperience) || 0,
        currentLoad: 0,
        maxLoad: 5,
        status: 'active',
        avatar: initials,
        courses: [],
      };
      setFacultyList(prev => [...prev, newFaculty]);
      setSavingFaculty(false);
      closeAddFaculty();
    }, 700);
  };

  // ── Add Course handlers ───────────────────────────────────
  const openAddCourse = () => {
    setCourseForm(EMPTY_COURSE);
    setCourseErrors({});
    setShowAddCourse(true);
  };

  const closeAddCourse = () => {
    setShowAddCourse(false);
    setCourseErrors({});
  };

  const validateCourse = () => {
    const errs = {};
    if (!courseForm.id.trim()) errs.id = 'Course code is required.';
    else if (courseList.find(c => c.id.toLowerCase() === courseForm.id.trim().toLowerCase()))
      errs.id = 'Course code already exists.';
    if (!courseForm.name.trim()) errs.name = 'Course name is required.';
    if (!courseForm.category) errs.category = 'Category is required.';
    if (!courseForm.units) errs.units = 'Units are required.';
    else if (isNaN(Number(courseForm.units)) || Number(courseForm.units) < 1)
      errs.units = 'Must be a positive number.';
    if (!courseForm.level) errs.level = 'Level is required.';
    else if (isNaN(Number(courseForm.level)) || Number(courseForm.level) < 1 || Number(courseForm.level) > 4)
      errs.level = 'Level must be 1–4.';
    return errs;
  };

  const handleSaveCourse = () => {
    const errs = validateCourse();
    if (Object.keys(errs).length) { setCourseErrors(errs); return; }
    setSavingCourse(true);
    setTimeout(() => {
      const newCourse = {
        id: courseForm.id.trim().toUpperCase(),
        name: courseForm.name.trim(),
        category: courseForm.category,
        units: Number(courseForm.units),
        level: Number(courseForm.level),
        description: courseForm.description.trim(),
      };
      setCourseList(prev => [...prev, newCourse]);
      setSavingCourse(false);
      closeAddCourse();
    }, 700);
  };

  const statusColor = (s) =>
    s === 'overloaded' ? 'danger' : s === 'underutilized' ? 'warning' : 'active';

  const statusLabel = (s) =>
    s === 'overloaded' ? 'Overloaded' : s === 'underutilized' ? 'Under-utilized' : 'Active';

  return (
    <div className="admin-dash">
      <Navbar variant="dashboard" />

      <main className="admin-dash__main">
        <div className="container">

          {/* ── Welcome banner ───────── */}
          <div className="admin-dash__welcome">
            <div className="admin-dash__welcome-left">
              <div className="admin-dash__welcome-tag">Admin Panel</div>
              <h1 className="admin-dash__welcome-title">
                Welcome back, <span>{user?.name?.split(' ')[0] || 'Admin'}</span>
              </h1>
              <p className="admin-dash__welcome-sub">
                {SYSTEM_STATS.activeSemester} is active · {pendingRequests.length} pending faculty request{pendingRequests.length !== 1 ? 's' : ''} awaiting review
              </p>
            </div>
            <div className="admin-dash__welcome-right">
              <div className="admin-dash__semester-badge">
                <span className="status-dot status-active" />
                Semester {SYSTEM_STATS.activeSemester}
              </div>
            </div>
          </div>

          {/* ── Stat cards ───────────── */}
          <div className="grid-4 admin-dash__stats">
            <StatCard
              icon={<Icon.Users size={18} />}
              label="Total Faculty"
              value={SYSTEM_STATS.totalFaculty}
              sub="Active this semester"
              color="default"
            />
            <StatCard
              icon={<Icon.BookOpen size={18} />}
              label="Total Courses"
              value={SYSTEM_STATS.totalCourses}
              sub="Across all departments"
              color="default"
            />
            <StatCard
              icon={<Icon.Zap size={18} />}
              label="Coverage Rate"
              value={`${SYSTEM_STATS.coverageRate}%`}
              sub="Courses with qualified faculty"
              trend={{ dir: 'up', label: '+4% vs last sem' }}
              color="highlight"
            />
            <StatCard
              icon={<Icon.Sprout size={18} />}
              label="Developing Specialists"
              value={SYSTEM_STATS.developingSpecialists}
              sub="Faculty on specialization track"
              color="default"
            />
          </div>

          {/* ── Quick actions ─────────── */}
          <section className="admin-dash__section">
            <h2 className="admin-dash__section-title">Analytics Modules</h2>
            <div className="admin-dash__actions-grid">
              {QUICK_ACTIONS.map((a, i) => (
                <button
                  key={i}
                  className="admin-dash__action-card"
                  onClick={() => navigate(a.path)}
                >
                  <div className="admin-dash__action-top">
                    <span className="admin-dash__action-icon"><a.icon size={20} /></span>
                    <span className="admin-dash__action-tag">{a.tag}</span>
                  </div>
                  <h3 className="admin-dash__action-title">{a.title}</h3>
                  <p className="admin-dash__action-desc">{a.desc}</p>
                  <div className="admin-dash__action-arrow">
                    Open Module
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* ── Two-column layout ─────── */}
          <div className="admin-dash__two-col">

            {/* Faculty roster */}
            <section className="admin-dash__section">
              <div className="admin-dash__section-header">
                <h2 className="admin-dash__section-title">Faculty Roster</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="tag">{facultyList.length} members</span>
                  <button className="btn-add" onClick={openAddFaculty}>
                    <Icon.Plus size={13} /> Add Faculty
                  </button>
                </div>
              </div>
              <div className="admin-dash__faculty-list">
                {facultyList.map(f => {
                  const wl = WORKLOAD_SUMMARY.find(w => w.facultyId === f.id);
                  return (
                    <div key={f.id} className="admin-dash__faculty-row">
                      <div className="admin-dash__faculty-avatar">{f.avatar}</div>
                      <div className="admin-dash__faculty-info">
                        <div className="admin-dash__faculty-name">{f.name}</div>
                        <div className="admin-dash__faculty-spec">{f.specialization}</div>
                      </div>
                      <div className="admin-dash__faculty-right">
                        <div className="admin-dash__faculty-load">
                          <div className="admin-dash__load-bar">
                            <div
                              className="admin-dash__load-fill"
                              style={{
                                width: `${wl?.percentage || 0}%`,
                                background: wl?.status === 'overloaded'
                                  ? 'linear-gradient(90deg,#f87171,#ef4444)'
                                  : wl?.status === 'underutilized'
                                  ? 'linear-gradient(90deg,#facc15,#eab308)'
                                  : 'linear-gradient(90deg,#6e8794,#96ACB7)',
                              }}
                            />
                          </div>
                          <span className="admin-dash__load-pct">{wl?.percentage || 0}%</span>
                        </div>
                        <span className={`status-dot status-${statusColor(f.status)}`} title={statusLabel(f.status)} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Right column */}
            <div className="admin-dash__right-col">

              {/* Pending requests */}
              <section className="admin-dash__section">
                <div className="admin-dash__section-header">
                  <h2 className="admin-dash__section-title">Subject Requests</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="tag">{pendingRequests.length} pending</span>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/requests')}>
                      View All →
                    </button>
                  </div>
                </div>
                <div className="admin-dash__requests">
                  {pendingRequests.length === 0 ? (
                    <div className="admin-dash__req-empty">
                      <Icon.CheckCircle size={20} />
                      <span>All requests have been reviewed.</span>
                    </div>
                  ) : (
                    pendingRequests.slice(0, 3).map(req => (
                      <div key={req.id} className="admin-dash__req-row">
                        <div className="admin-dash__req-header">
                          <span className="admin-dash__req-faculty">{req.facultyName}</span>
                          <span className={`admin-dash__req-status admin-dash__req-status--${req.status}`}>
                            {req.status}
                          </span>
                        </div>
                        <div className="admin-dash__req-course">→ {req.courseName} ({req.course})</div>
                        <div className="admin-dash__req-reason">"{req.reason}"</div>
                        <div className="admin-dash__req-date">{req.date}</div>
                        <div className="admin-dash__req-actions">
                          <button
                            className="admin-dash__req-btn admin-dash__req-btn--approve"
                            onClick={() => openModal(req, 'approve')}
                          >
                            <Icon.CheckCircle size={13} /> Approve
                          </button>
                          <button
                            className="admin-dash__req-btn admin-dash__req-btn--deny"
                            onClick={() => openModal(req, 'deny')}
                          >
                            <Icon.XCircle size={13} /> Deny
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* Coverage snapshot */}
              <section className="admin-dash__section">
                <div className="admin-dash__section-header">
                  <h2 className="admin-dash__section-title">Coverage Snapshot</h2>
                </div>
                <div className="admin-dash__coverage">
                  {SUBJECT_COVERAGE.map((c, i) => (
                    <div key={i} className="admin-dash__cov-row">
                      <div className="admin-dash__cov-info">
                        <span className="admin-dash__cov-label">{c.category}</span>
                        {c.shortage && <span className="admin-dash__cov-alert"><Icon.AlertTriangle size={11} /> Shortage</span>}
                      </div>
                      <div className="admin-dash__cov-bar-wrap">
                        <div className="admin-dash__cov-bar">
                          <div
                            className="admin-dash__cov-fill"
                            style={{
                              width: `${Math.round((c.qualified / c.count) * 100)}%`,
                              background: c.shortage
                                ? 'linear-gradient(90deg,#f87171,#ef4444)'
                                : 'linear-gradient(90deg,#6e8794,#96ACB7)',
                            }}
                          />
                        </div>
                        <span className="admin-dash__cov-ratio">{c.qualified}/{c.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Course list */}
              <section className="admin-dash__section">
                <div className="admin-dash__section-header">
                  <h2 className="admin-dash__section-title">Courses</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="tag">{courseList.length} total</span>
                    <button className="btn-add" onClick={openAddCourse}>
                      <Icon.Plus size={13} /> Add Course
                    </button>
                  </div>
                </div>
                <div className="admin-dash__course-list">
                  {courseList.map((c) => (
                    <div key={c.id} className="admin-dash__course-row">
                      <div className="admin-dash__course-code">{c.id}</div>
                      <div className="admin-dash__course-info">
                        <div className="admin-dash__course-name">{c.name}</div>
                        <div className="admin-dash__course-meta">{c.category} · {c.units} units · Level {c.level}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Average workload meter */}
          <section className="admin-dash__section admin-dash__meter-section">
            <div className="admin-dash__section-header">
              <h2 className="admin-dash__section-title">Department Workload Overview</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/workload')}>
                Full Dashboard →
              </button>
            </div>
            <div className="admin-dash__meters">
              {WORKLOAD_SUMMARY.map(w => (
                <div key={w.facultyId} className="admin-dash__meter-row">
                  <div className="admin-dash__meter-name">{w.name.split(' ').slice(-1)[0]}</div>
                  <div className="progress-bar-track" style={{ flex: 1 }}>
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${w.percentage}%`,
                        background: w.status === 'overloaded'
                          ? 'linear-gradient(90deg,#f87171,#ef4444)'
                          : w.status === 'underutilized'
                          ? 'linear-gradient(90deg,#facc15,#eab308)'
                          : 'linear-gradient(90deg,#6e8794,#96ACB7)',
                      }}
                    />
                  </div>
                  <div className="admin-dash__meter-units">{w.units}/{w.maxUnits} units</div>
                  <span className={`status-dot status-${statusColor(w.status)}`} />
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* ── Approve / Deny Modal ─── */}
      {modal && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <div className={`admin-modal__icon admin-modal__icon--${modal.action}`}>
                {modal.action === 'approve'
                  ? <Icon.CheckCircle size={22} />
                  : <Icon.XCircle size={22} />}
              </div>
              <div>
                <h3 className="admin-modal__title">
                  {modal.action === 'approve' ? 'Approve Request' : 'Deny Request'}
                </h3>
                <p className="admin-modal__subtitle">
                  {modal.req.facultyName} · {modal.req.courseName}
                </p>
              </div>
            </div>

            <div className="admin-modal__body">
              <div className="admin-modal__req-detail">
                <span className="admin-modal__detail-label">Course</span>
                <span className="admin-modal__detail-val">{modal.req.courseName} ({modal.req.course})</span>
              </div>
              <div className="admin-modal__req-detail">
                <span className="admin-modal__detail-label">Reason</span>
                <span className="admin-modal__detail-val">"{modal.req.reason}"</span>
              </div>
              <div className="admin-modal__req-detail">
                <span className="admin-modal__detail-label">Submitted</span>
                <span className="admin-modal__detail-val">{modal.req.date}</span>
              </div>

              <div className="admin-modal__note-field">
                <label className="form-label">
                  Admin Note <span style={{ color: 'var(--dark-dim)', fontWeight: 400 }}>(optional)</span>
                </label>
                <textarea
                  className="form-input"
                  placeholder={modal.action === 'approve'
                    ? 'e.g. Assignment confirmed for 2025-S1...'
                    : 'e.g. Insufficient credentials for this course level...'}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="admin-modal__footer">
              <button className="btn btn-ghost" onClick={closeModal} disabled={processing}>
                Cancel
              </button>
              <button
                className={`btn ${modal.action === 'approve' ? 'admin-modal__btn--approve' : 'admin-modal__btn--deny'}`}
                onClick={handleDecision}
                disabled={processing}
              >
                {processing ? (
                  <span className="login__spinner" />
                ) : modal.action === 'approve' ? (
                  <><Icon.CheckCircle size={14} /> Confirm Approval</>
                ) : (
                  <><Icon.XCircle size={14} /> Confirm Denial</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Faculty Modal ─── */}
      {showAddFaculty && (
        <div className="admin-modal-overlay" onClick={closeAddFaculty}>
          <div className="admin-modal admin-modal--form" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <div className="admin-modal__icon admin-modal__icon--add">
                <Icon.Users size={22} />
              </div>
              <div>
                <h3 className="admin-modal__title">Add Faculty Member</h3>
                <p className="admin-modal__subtitle">Fill in the details to register a new faculty member.</p>
              </div>
            </div>

            <div className="admin-modal__body admin-modal__body--form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name <span className="form-required">*</span></label>
                  <input
                    className={`form-input${facultyErrors.name ? ' form-input--error' : ''}`}
                    placeholder="e.g. Dr. Juan dela Cruz"
                    value={facultyForm.name}
                    onChange={e => setFacultyForm(p => ({ ...p, name: e.target.value }))}
                  />
                  {facultyErrors.name && <span className="form-error">{facultyErrors.name}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Email <span className="form-required">*</span></label>
                  <input
                    className={`form-input${facultyErrors.email ? ' form-input--error' : ''}`}
                    placeholder="e.g. j.delacruz@matchpoint.edu"
                    value={facultyForm.email}
                    onChange={e => setFacultyForm(p => ({ ...p, email: e.target.value }))}
                  />
                  {facultyErrors.email && <span className="form-error">{facultyErrors.email}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Degree <span className="form-required">*</span></label>
                  <input
                    className={`form-input${facultyErrors.degree ? ' form-input--error' : ''}`}
                    placeholder="e.g. Ph.D. Computer Science"
                    value={facultyForm.degree}
                    onChange={e => setFacultyForm(p => ({ ...p, degree: e.target.value }))}
                  />
                  {facultyErrors.degree && <span className="form-error">{facultyErrors.degree}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Specialization <span className="form-required">*</span></label>
                  <input
                    className={`form-input${facultyErrors.specialization ? ' form-input--error' : ''}`}
                    placeholder="e.g. Machine Learning & AI"
                    value={facultyForm.specialization}
                    onChange={e => setFacultyForm(p => ({ ...p, specialization: e.target.value }))}
                  />
                  {facultyErrors.specialization && <span className="form-error">{facultyErrors.specialization}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Department <span className="form-required">*</span></label>
                  <select
                    className={`form-input form-select${facultyErrors.department ? ' form-input--error' : ''}`}
                    value={facultyForm.department}
                    onChange={e => setFacultyForm(p => ({ ...p, department: e.target.value }))}
                  >
                    <option value="">Select department…</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {facultyErrors.department && <span className="form-error">{facultyErrors.department}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Academic Rank <span className="form-required">*</span></label>
                  <select
                    className={`form-input form-select${facultyErrors.rank ? ' form-input--error' : ''}`}
                    value={facultyForm.rank}
                    onChange={e => setFacultyForm(p => ({ ...p, rank: e.target.value }))}
                  >
                    <option value="">Select rank…</option>
                    {FACULTY_RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {facultyErrors.rank && <span className="form-error">{facultyErrors.rank}</span>}
                </div>
              </div>

              <div className="form-row form-row--single">
                <div className="form-group">
                  <label className="form-label">Years of Experience</label>
                  <input
                    className={`form-input${facultyErrors.yearsExperience ? ' form-input--error' : ''}`}
                    placeholder="e.g. 5"
                    type="number"
                    min="0"
                    value={facultyForm.yearsExperience}
                    onChange={e => setFacultyForm(p => ({ ...p, yearsExperience: e.target.value }))}
                  />
                  {facultyErrors.yearsExperience && <span className="form-error">{facultyErrors.yearsExperience}</span>}
                </div>
              </div>
            </div>

            <div className="admin-modal__footer">
              <button className="btn btn-ghost" onClick={closeAddFaculty} disabled={savingFaculty}>Cancel</button>
              <button className="btn-add btn-add--lg" onClick={handleSaveFaculty} disabled={savingFaculty}>
                {savingFaculty ? <span className="login__spinner" /> : <><Icon.Plus size={14} /> Add Faculty</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Course Modal ─── */}
      {showAddCourse && (
        <div className="admin-modal-overlay" onClick={closeAddCourse}>
          <div className="admin-modal admin-modal--form" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <div className="admin-modal__icon admin-modal__icon--add">
                <Icon.BookOpen size={22} />
              </div>
              <div>
                <h3 className="admin-modal__title">Add Course</h3>
                <p className="admin-modal__subtitle">Fill in the details to register a new course.</p>
              </div>
            </div>

            <div className="admin-modal__body admin-modal__body--form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Course Code <span className="form-required">*</span></label>
                  <input
                    className={`form-input${courseErrors.id ? ' form-input--error' : ''}`}
                    placeholder="e.g. CS501"
                    value={courseForm.id}
                    onChange={e => setCourseForm(p => ({ ...p, id: e.target.value }))}
                  />
                  {courseErrors.id && <span className="form-error">{courseErrors.id}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Course Name <span className="form-required">*</span></label>
                  <input
                    className={`form-input${courseErrors.name ? ' form-input--error' : ''}`}
                    placeholder="e.g. Deep Learning"
                    value={courseForm.name}
                    onChange={e => setCourseForm(p => ({ ...p, name: e.target.value }))}
                  />
                  {courseErrors.name && <span className="form-error">{courseErrors.name}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category <span className="form-required">*</span></label>
                  <select
                    className={`form-input form-select${courseErrors.category ? ' form-input--error' : ''}`}
                    value={courseForm.category}
                    onChange={e => setCourseForm(p => ({ ...p, category: e.target.value }))}
                  >
                    <option value="">Select category…</option>
                    {COURSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {courseErrors.category && <span className="form-error">{courseErrors.category}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Units <span className="form-required">*</span></label>
                  <input
                    className={`form-input${courseErrors.units ? ' form-input--error' : ''}`}
                    placeholder="e.g. 3"
                    type="number"
                    min="1"
                    value={courseForm.units}
                    onChange={e => setCourseForm(p => ({ ...p, units: e.target.value }))}
                  />
                  {courseErrors.units && <span className="form-error">{courseErrors.units}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Level (1–4) <span className="form-required">*</span></label>
                  <input
                    className={`form-input${courseErrors.level ? ' form-input--error' : ''}`}
                    placeholder="e.g. 4"
                    type="number"
                    min="1"
                    max="4"
                    value={courseForm.level}
                    onChange={e => setCourseForm(p => ({ ...p, level: e.target.value }))}
                  />
                  {courseErrors.level && <span className="form-error">{courseErrors.level}</span>}
                </div>
                <div className="form-group" style={{ flex: 2 }}>
                  <label className="form-label">Description</label>
                  <input
                    className="form-input"
                    placeholder="Brief course description…"
                    value={courseForm.description}
                    onChange={e => setCourseForm(p => ({ ...p, description: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="admin-modal__footer">
              <button className="btn btn-ghost" onClick={closeAddCourse} disabled={savingCourse}>Cancel</button>
              <button className="btn-add btn-add--lg" onClick={handleSaveCourse} disabled={savingCourse}>
                {savingCourse ? <span className="login__spinner" /> : <><Icon.Plus size={14} /> Add Course</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
