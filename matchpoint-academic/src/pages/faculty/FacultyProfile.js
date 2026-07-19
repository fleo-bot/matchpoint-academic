import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import Navbar from '../../components/Navbar';
import PageHeader from '../../components/PageHeader';
import Icon from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { FACULTY, COURSES, WORKLOAD_SUMMARY, SPECIALIZATION_HISTORY } from '../../data/mockData';
import './FacultyProfile.css';

const COLORS = {
  AI: '#96ACB7',
  DataSci: '#7a9aaa',
  WebDev: '#5e8899',
  CoreCS: '#3a5f6e',
};

const LABEL_MAP = {
  AI: 'AI / ML',
  DataSci: 'Data Science',
  WebDev: 'Web Development',
  CoreCS: 'Core CS',
};

export default function FacultyProfile() {
  const { user } = useAuth();
  const facultyData = FACULTY.find(f => f.id === user?.id) || FACULTY[0];
  const workload = WORKLOAD_SUMMARY.find(w => w.facultyId === facultyData.id) || WORKLOAD_SUMMARY[0];
  const specData = SPECIALIZATION_HISTORY[facultyData.id] || SPECIALIZATION_HISTORY['f001'];
  const myCourses = COURSES.filter(c => facultyData.courses.includes(c.id));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="fp__tooltip">
        <div className="fp__tooltip-label">{label}</div>
        {payload.map((p, i) => (
          <div key={i} className="fp__tooltip-row">
            <span className="fp__tooltip-dot" style={{ background: p.fill || p.color }} />
            <span>{LABEL_MAP[p.dataKey] || p.dataKey}:</span>
            <span>{p.value}%</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fp-page">
      <Navbar variant="dashboard" />
      <main className="fp-page__main">
        <div className="container">
          <PageHeader
            icon={<Icon.User size={22} />}
            badge="Faculty Portal"
            title="My Academic Profile"
            subtitle="Your credentials, teaching portfolio, and specialization trajectory in one place."
          />

          <div className="fp__grid">
            {/* Left column — profile card */}
            <div className="fp__left">
              <div className="fp__profile-card">
                <div className="fp__avatar-xl">{facultyData.avatar}</div>
                <h2 className="fp__name">{facultyData.name}</h2>
                <div className="fp__rank">{facultyData.rank}</div>
                <div className="fp__dept">{facultyData.department}</div>

                <div className="fp__divider" />

                <div className="fp__info-rows">
                  {[
                    { label: 'Degree', value: facultyData.degree },
                    { label: 'Specialization', value: facultyData.specialization },
                    { label: 'Experience', value: `${facultyData.yearsExperience} years` },
                    { label: 'Email', value: facultyData.email },
                    { label: 'Current Load', value: `${workload.units}/${workload.maxUnits} units (${workload.percentage}%)` },
                  ].map((r, i) => (
                    <div key={i} className="fp__info-row">
                      <span className="fp__info-label">{r.label}</span>
                      <span className="fp__info-value">{r.value}</span>
                    </div>
                  ))}
                </div>

                <div className="fp__divider" />

                {/* Workload gauge */}
                <div className="fp__gauge-wrap">
                  <div className="fp__gauge-label">Teaching Load</div>
                  <div className="fp__gauge">
                    <svg viewBox="0 0 100 60" className="fp__gauge-svg">
                      <path d="M10 55 A45 45 0 0 1 90 55" fill="none" stroke="rgba(150,172,183,0.1)" strokeWidth="8" strokeLinecap="round" />
                      <path
                        d="M10 55 A45 45 0 0 1 90 55"
                        fill="none"
                        stroke={workload.status === 'overloaded' ? '#f87171' : workload.status === 'underutilized' ? '#facc15' : '#96ACB7'}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(workload.percentage / 100) * 141} 141`}
                      />
                    </svg>
                    <div className="fp__gauge-value">{workload.percentage}%</div>
                  </div>
                  <div className={`fp__gauge-status fp__gauge-status--${workload.status}`}>
                    {workload.status === 'overloaded' ? <><Icon.AlertTriangle size={12} /> Overloaded</>
                      : workload.status === 'underutilized' ? <><Icon.ArrowDown size={12} /> Under-utilized</>
                      : <><Icon.Check size={12} /> Balanced</>}
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="fp__right">
              {/* Current courses */}
              <section className="fp__section">
                <h3 className="fp__section-title">Assigned Courses</h3>
                <div className="fp__courses-grid">
                  {myCourses.map(c => (
                    <div key={c.id} className="fp__course-card">
                      <div className="fp__course-id">{c.id}</div>
                      <div className="fp__course-name">{c.name}</div>
                      <div className="fp__course-meta">
                        <span className="tag">{c.category}</span>
                        <span className="fp__course-units">{c.units} units</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Specialization chart */}
              <section className="fp__section">
                <div className="fp__spec-header">
                  <h3 className="fp__section-title">Specialization Trajectory</h3>
                  <div className={`fp__spec-status-badge fp__spec-status-badge--${specData.prediction.trend}`}>
                    {specData.prediction.status}
                  </div>
                </div>

                <div className="fp__spec-card">
                  <div className="fp__spec-pred-row">
                    <div className="fp__spec-pred-item">
                      <div className="fp__spi-label">Predicted Specialization</div>
                      <div className="fp__spi-value">{specData.prediction.specialization}</div>
                    </div>
                    <div className="fp__spec-pred-item">
                      <div className="fp__spi-label">Retention Probability</div>
                      <div className="fp__spi-value">{Math.round(specData.prediction.probability * 100)}%</div>
                    </div>
                    <div className="fp__spec-pred-item">
                      <div className="fp__spi-label">Trend</div>
                      <div className="fp__spi-value" style={{ color: specData.prediction.trend === 'up' ? '#4ade80' : '#96ACB7' }}>
                        {specData.prediction.trend === 'up' ? <><Icon.ArrowUp size={12} /> Increasing</> : <><Icon.ArrowRight size={12} /> Stable</>}
                      </div>
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={specData.semesters} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        {Object.entries(COLORS).map(([key, col]) => (
                          <linearGradient key={key} id={`fpGrad${key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={col} stopOpacity={0.5} />
                            <stop offset="95%" stopColor={col} stopOpacity={0.05} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,172,183,0.07)" />
                      <XAxis dataKey="label" tick={{ fill: '#6e8794', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#6e8794', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                      <Tooltip content={<CustomTooltip />} />
                      {Object.keys(COLORS).map(key => (
                        <Area
                          key={key}
                          type="monotone"
                          dataKey={key}
                          stackId="1"
                          stroke={COLORS[key]}
                          fill={`url(#fpGrad${key})`}
                          strokeWidth={1.5}
                        />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>

                  {/* Legend */}
                  <div className="fp__spec-legend">
                    {Object.entries(COLORS).map(([key, col]) => (
                      <div key={key} className="fp__spec-leg-item">
                        <div className="fp__spec-leg-dot" style={{ background: col }} />
                        <span>{LABEL_MAP[key]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
