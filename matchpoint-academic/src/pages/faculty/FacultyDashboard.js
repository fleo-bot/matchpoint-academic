import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import StatCard from '../../components/StatCard';
import Icon from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import {
  FACULTY,
  COURSES,
  WORKLOAD_SUMMARY,
  SPECIALIZATION_HISTORY,
  FACULTY_REQUESTS,
} from '../../data/mockData';
import './FacultyDashboard.css';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Find this faculty member's data
  const facultyData = FACULTY.find(f => f.id === user?.id) || FACULTY[0];
  const workload = WORKLOAD_SUMMARY.find(w => w.facultyId === facultyData.id) || WORKLOAD_SUMMARY[0];
  const specData = SPECIALIZATION_HISTORY[facultyData.id] || SPECIALIZATION_HISTORY['f001'];
  const myRequests = FACULTY_REQUESTS.filter(r => r.facultyId === facultyData.id);

  // Latest semester breakdown
  const latestSem = specData.semesters[specData.semesters.length - 1];
  const topSubject = Object.entries(latestSem)
    .filter(([k]) => k !== 'label')
    .sort(([, a], [, b]) => b - a)[0];

  const myCourses = COURSES.filter(c => facultyData.courses.includes(c.id));

  const semColors = {
    AI: '#96ACB7',
    DataSci: '#7a9aaa',
    WebDev: '#5e8899',
    CoreCS: '#3a5f6e',
  };

  return (
    <div className="fac-dash">
      <Navbar variant="dashboard" />

      <main className="fac-dash__main">
        <div className="container">

          {/* ── Welcome ── */}
          <div className="fac-dash__welcome">
            <div className="fac-dash__avatar-large">{facultyData.avatar}</div>
            <div className="fac-dash__welcome-info">
              <div className="fac-dash__welcome-tag">Faculty Portal</div>
              <h1 className="fac-dash__welcome-name">{facultyData.name}</h1>
              <div className="fac-dash__welcome-meta">
                <span>{facultyData.rank}</span>
                <span className="fac-dash__meta-dot">·</span>
                <span>{facultyData.department}</span>
                <span className="fac-dash__meta-dot">·</span>
                <span>{facultyData.degree}</span>
              </div>
            </div>
            <div className="fac-dash__welcome-actions">
              <button className="btn btn-outline" onClick={() => navigate('/faculty/profile')}>
                View Profile
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/faculty/request')}>
                + Request Subject
              </button>
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="grid-4 fac-dash__stats">
            <StatCard
              icon={<Icon.BookOpen size={18} />}
              label="Assigned Courses"
              value={facultyData.courses.length}
              sub={`${workload.units} units total`}
              color="default"
            />
            <StatCard
              icon={<Icon.Zap size={18} />}
              label="Workload"
              value={`${workload.percentage}%`}
              sub={`${workload.units}/${workload.maxUnits} units`}
              color={workload.status === 'overloaded' ? 'danger' : workload.status === 'underutilized' ? 'warning' : 'default'}
            />
            <StatCard
              icon={<Icon.Sprout size={18} />}
              label="Specialization"
              value={`${Math.round(topSubject[1])}%`}
              sub={topSubject[0] === 'AI' ? 'AI / Machine Learning' : topSubject[0] === 'DataSci' ? 'Data Science' : topSubject[0] === 'WebDev' ? 'Web Development' : 'Core CS'}
              trend={{ dir: specData.prediction.trend === 'up' ? 'up' : 'stable', label: specData.prediction.status }}
              color="highlight"
            />
            <StatCard
              icon={<Icon.GraduationCap size={18} />}
              label="Experience"
              value={`${facultyData.yearsExperience}y`}
              sub={`${facultyData.specialization}`}
              color="default"
            />
          </div>

          {/* ── Two-col layout ── */}
          <div className="fac-dash__two-col">

            {/* Left: Courses + Workload bar */}
            <div>
              {/* Current courses */}
              <section className="fac-dash__section">
                <div className="fac-dash__section-header">
                  <h2 className="fac-dash__section-title">My Courses This Semester</h2>
                  <span className="tag">{myCourses.length} courses</span>
                </div>
                <div className="fac-dash__courses">
                  {myCourses.map(c => (
                    <div key={c.id} className="fac-dash__course-card">
                      <div className="fac-dash__course-top">
                        <span className="fac-dash__course-id">{c.id}</span>
                        <span className="tag">{c.category}</span>
                      </div>
                      <div className="fac-dash__course-name">{c.name}</div>
                      <div className="fac-dash__course-desc">{c.description}</div>
                      <div className="fac-dash__course-bottom">
                        <span className="fac-dash__course-units">{c.units} units</span>
                        <span className="fac-dash__course-level">Level {c.level}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Workload bar */}
              <section className="fac-dash__section">
                <div className="fac-dash__section-header">
                  <h2 className="fac-dash__section-title">Current Workload</h2>
                </div>
                <div className="fac-dash__workload-card">
                  <div className="fac-dash__wl-top">
                    <div>
                      <div className="fac-dash__wl-value">{workload.units} <span>/ {workload.maxUnits} units</span></div>
                      <div className="fac-dash__wl-label">Teaching Load</div>
                    </div>
                    <div className={`fac-dash__wl-badge fac-dash__wl-badge--${workload.status}`}>
                      {workload.status === 'overloaded' ? <><Icon.AlertTriangle size={11} /> Overloaded</>
                        : workload.status === 'underutilized' ? <><Icon.ArrowDown size={11} /> Under-utilized</>
                        : <><Icon.Check size={11} /> Balanced</>}
                    </div>
                  </div>
                  <div className="fac-dash__wl-bar-wrap">
                    <div className="progress-bar-track" style={{ height: '10px' }}>
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${workload.percentage}%`,
                          background: workload.status === 'overloaded'
                            ? 'linear-gradient(90deg,#f87171,#ef4444)'
                            : workload.status === 'underutilized'
                            ? 'linear-gradient(90deg,#facc15,#eab308)'
                            : 'linear-gradient(90deg,#6e8794,#96ACB7)',
                          height: '10px',
                        }}
                      />
                    </div>
                    <span className="fac-dash__wl-pct">{workload.percentage}%</span>
                  </div>
                  <div className="fac-dash__wl-segments">
                    {myCourses.map(c => (
                      <div key={c.id} className="fac-dash__wl-seg">
                        <span>{c.id}</span>
                        <span>{c.units} units</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Right: Specialization + Requests */}
            <div>
              {/* Specialization tracker */}
              <section className="fac-dash__section">
                <div className="fac-dash__section-header">
                  <h2 className="fac-dash__section-title">Specialization Tracker</h2>
                  <button className="btn btn-ghost btn-sm" onClick={() => navigate('/faculty/profile')}>
                    Full View →
                  </button>
                </div>
                <div className="fac-dash__spec-card">
                  <div className="fac-dash__spec-prediction">
                    <div className="fac-dash__spec-pred-label">AI Prediction</div>
                    <div className="fac-dash__spec-pred-value">{specData.prediction.specialization}</div>
                    <div className="fac-dash__spec-pred-prob">
                      <div className="fac-dash__spec-prob-bar">
                        <div
                          className="fac-dash__spec-prob-fill"
                          style={{ width: `${Math.round(specData.prediction.probability * 100)}%` }}
                        />
                      </div>
                      <span>{Math.round(specData.prediction.probability * 100)}% probability</span>
                    </div>
                    {specData.prediction.status === 'Developing Specialist' && (
                      <div className="fac-dash__spec-badge"><Icon.Sprout size={13} /> Developing Specialist</div>
                    )}
                  </div>

                  {/* Mini semester breakdown */}
                  <div className="fac-dash__spec-history">
                    <div className="fac-dash__spec-history-label">Subject Distribution (Last 6 Semesters)</div>
                    <div className="fac-dash__spec-bars">
                      {specData.semesters.map((sem, i) => {
                        const total = Object.entries(sem).filter(([k]) => k !== 'label').reduce((a, [, v]) => a + v, 0);
                        return (
                          <div key={i} className="fac-dash__spec-bar-col">
                            <div className="fac-dash__spec-stacked">
                              {Object.entries(sem).filter(([k]) => k !== 'label').map(([key, val]) => (
                                <div
                                  key={key}
                                  className="fac-dash__spec-segment"
                                  style={{
                                    height: `${(val / total) * 100}%`,
                                    background: semColors[key] || '#96ACB7',
                                    opacity: 0.85,
                                  }}
                                  title={`${key}: ${val}%`}
                                />
                              ))}
                            </div>
                            <div className="fac-dash__spec-sem-label">{sem.label.split('-')[1]}</div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="fac-dash__spec-legend">
                      {Object.keys(semColors).map(k => (
                        <div key={k} className="fac-dash__spec-leg-item">
                          <div className="fac-dash__spec-leg-dot" style={{ background: semColors[k] }} />
                          <span>{k === 'AI' ? 'AI/ML' : k === 'DataSci' ? 'Data Sci' : k === 'WebDev' ? 'Web Dev' : 'Core CS'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* My requests */}
              <section className="fac-dash__section">
                <div className="fac-dash__section-header">
                  <h2 className="fac-dash__section-title">My Course Requests</h2>
                  <button className="btn btn-outline btn-sm" onClick={() => navigate('/faculty/request')}>
                    New Request
                  </button>
                </div>
                <div className="fac-dash__req-list">
                  {myRequests.length === 0 ? (
                    <div className="fac-dash__empty">
                      No requests submitted yet.
                      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/faculty/request')}>
                        Submit one →
                      </button>
                    </div>
                  ) : myRequests.map(req => (
                    <div key={req.id} className="fac-dash__req-row">
                      <div className="fac-dash__req-top">
                        <span className="fac-dash__req-course">{req.courseName}</span>
                        <span className={`admin-dash__req-status admin-dash__req-status--${req.status}`}>
                          {req.status}
                        </span>
                      </div>
                      <div className="fac-dash__req-reason">"{req.reason}"</div>
                      <div className="fac-dash__req-date">Submitted: {req.date}</div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
