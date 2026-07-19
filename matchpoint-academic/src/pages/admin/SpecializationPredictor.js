import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, LineChart, Line,
} from 'recharts';
import Navbar from '../../components/Navbar';
import PageHeader from '../../components/PageHeader';
import Icon from '../../components/Icons';
import { FACULTY, SPECIALIZATION_HISTORY } from '../../data/mockData';
import './SpecializationPredictor.css';

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

// Future projection: adds 2 predicted semesters
function buildProjection(semesters, spec) {
  const keyMap = { 'AI & Machine Learning': 'AI', 'Data Science': 'DataSci', 'Web Development': 'WebDev', 'Core CS / Systems': 'CoreCS' };
  const specKey = keyMap[spec] || 'AI';
  const last = semesters[semesters.length - 1];
  const growth = (semesters[semesters.length - 1][specKey] - semesters[0][specKey]) / (semesters.length - 1);

  return [
    ...semesters,
    {
      label: '2025-S1',
      [specKey]: Math.min(100, Math.round(last[specKey] + growth * 1)),
      ...Object.fromEntries(
        Object.keys(last).filter(k => k !== 'label' && k !== specKey)
          .map(k => [k, Math.max(0, Math.round(last[k] - (growth * 1) / (Object.keys(last).length - 2)))])
      ),
      predicted: true,
    },
    {
      label: '2025-S2',
      [specKey]: Math.min(100, Math.round(last[specKey] + growth * 2)),
      ...Object.fromEntries(
        Object.keys(last).filter(k => k !== 'label' && k !== specKey)
          .map(k => [k, Math.max(0, Math.round(last[k] - (growth * 2) / (Object.keys(last).length - 2)))])
      ),
      predicted: true,
    },
  ];
}

// Custom tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="spec__tooltip">
      <div className="spec__tooltip-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="spec__tooltip-row">
          <span className="spec__tooltip-dot" style={{ background: p.fill || p.color }} />
          <span>{LABEL_MAP[p.dataKey] || p.dataKey}:</span>
          <span>{p.value}%</span>
        </div>
      ))}
    </div>
  );
};

export default function SpecializationPredictor() {
  const [selectedFaculty, setSelectedFaculty] = useState('f001');
  const [chartType, setChartType] = useState('area'); // 'area' | 'line'

  const specData = SPECIALIZATION_HISTORY[selectedFaculty];
  const facultyInfo = FACULTY.find(f => f.id === selectedFaculty);
  const projectedData = buildProjection(specData.semesters, specData.prediction.specialization);

  const latestSem = specData.semesters[specData.semesters.length - 1];
  const topSubjectVal = Math.max(...Object.entries(latestSem).filter(([k]) => k !== 'label').map(([, v]) => v));
  const isSpecialist = topSubjectVal > 60;

  // Check three consecutive semesters above 60%
  const keyMap = { 'AI & Machine Learning': 'AI', 'Data Science': 'DataSci', 'Web Development': 'WebDev', 'Core CS / Systems': 'CoreCS' };
  const specKey = keyMap[specData.prediction.specialization] || 'AI';
  const last3 = specData.semesters.slice(-3);
  const consecutiveSpec = last3.every(s => s[specKey] >= 60);

  return (
    <div className="spec-page">
      <Navbar variant="dashboard" />
      <main className="spec-page__main">
        <div className="container">
          <PageHeader
            icon={<Icon.TrendingUp size={22} />}
            badge="Predictive Analytics Module"
            title="Dynamic Specialization Predictor"
            subtitle="Time-series tracking of faculty teaching portfolios across semesters. Uses logistic regression (glm) and ggplot2-style charts."
            actions={
              <div className="spec__chart-toggle">
                <button
                  className={`spec__toggle-btn ${chartType === 'area' ? 'spec__toggle-btn--active' : ''}`}
                  onClick={() => setChartType('area')}
                >
                  Stacked Area
                </button>
                <button
                  className={`spec__toggle-btn ${chartType === 'line' ? 'spec__toggle-btn--active' : ''}`}
                  onClick={() => setChartType('line')}
                >
                  Line Graph
                </button>
              </div>
            }
          />

          {/* Faculty selector */}
          <div className="spec__faculty-selector">
            {FACULTY.filter(f => SPECIALIZATION_HISTORY[f.id]).map(f => {
              const sd = SPECIALIZATION_HISTORY[f.id];
              return (
                <button
                  key={f.id}
                  className={`spec__fac-btn ${selectedFaculty === f.id ? 'spec__fac-btn--active' : ''}`}
                  onClick={() => setSelectedFaculty(f.id)}
                >
                  <div className="spec__fac-avatar">{f.avatar}</div>
                  <div className="spec__fac-info">
                    <div className="spec__fac-name">{f.name}</div>
                    <div className="spec__fac-pred">{sd.prediction.specialization}</div>
                  </div>
                  {sd.prediction.status === 'Developing Specialist' && (
                    <span className="spec__fac-spec-badge"><Icon.Sprout size={14} /></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Main content */}
          <div className="spec__main-grid">

            {/* Chart */}
            <div className="spec__chart-section">
              <div className="spec__chart-header">
                <div>
                  <div className="spec__chart-title">Subject Distribution Over Time — {facultyInfo?.name}</div>
                  <div className="spec__chart-sub">ggplot2-style visualization · R Implementation</div>
                </div>
                <div className="spec__chart-legend-custom">
                  {Object.entries(COLORS).map(([key, col]) => (
                    <div key={key} className="spec__leg-item">
                      <div className="spec__leg-dot" style={{ background: col }} />
                      <span>{LABEL_MAP[key]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prediction zone label */}
              <div className="spec__prediction-zone-note">
                <span className="spec__pz-dot" /> Data &nbsp;|&nbsp;
                <span className="spec__pz-dot spec__pz-dot--pred" /> Projected (2025 prediction)
              </div>

              <ResponsiveContainer width="100%" height={320}>
                {chartType === 'area' ? (
                  <AreaChart data={projectedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      {Object.entries(COLORS).map(([key, col]) => (
                        <linearGradient key={key} id={`grad${key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={col} stopOpacity={0.6} />
                          <stop offset="95%" stopColor={col} stopOpacity={0.1} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,172,183,0.08)" />
                    <XAxis dataKey="label" tick={{ fill: '#6e8794', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6e8794', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<CustomTooltip />} />
                    {Object.keys(COLORS).map((key) => (
                      <Area
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stackId="1"
                        stroke={COLORS[key]}
                        fill={`url(#grad${key})`}
                        strokeWidth={2}
                        strokeDasharray={(d) => d.predicted ? '5 5' : undefined}
                      />
                    ))}
                  </AreaChart>
                ) : (
                  <LineChart data={projectedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,172,183,0.08)" />
                    <XAxis dataKey="label" tick={{ fill: '#6e8794', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6e8794', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<CustomTooltip />} />
                    {Object.keys(COLORS).map((key) => (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={COLORS[key]}
                        strokeWidth={key === specKey ? 3 : 1.5}
                        dot={{ r: 4, fill: COLORS[key] }}
                        strokeDasharray={key === specKey ? undefined : '4 4'}
                      />
                    ))}
                  </LineChart>
                )}
              </ResponsiveContainer>

              {/* R code snippet */}
              <div className="spec__r-code">
                <div className="spec__r-code-header"><Icon.BarChart size={13} /> R Code — ggplot2 + glm() logistic regression</div>
                <pre className="spec__r-code-body">{`# Dynamic Specialization Predictor (R)
library(ggplot2); library(tidyr); library(dplyr)

# Stacked area chart
ggplot(faculty_history, aes(x=semester, y=percentage, fill=subject)) +
  geom_area(alpha=0.7, position="stack") +
  scale_fill_manual(values=c(AI="#96ACB7", DataSci="#7a9aaa",
                              WebDev="#5e8899", CoreCS="#3a5f6e")) +
  geom_vline(xintercept="2025-S1", linetype="dashed",
             color="white", alpha=0.4) +
  labs(title="Faculty Specialization Trajectory",
       subtitle="Predicted semesters shown with dashed boundary") +
  theme_minimal() + theme(panel.background=element_rect(fill="#000000"))

# Logistic regression: P(maintain specialization)
model <- glm(is_specialist ~ semester_count + dept_growth + course_demand,
             data = faculty_history, family = binomial)
predict(model, newdata = future_semesters, type = "response")`}</pre>
              </div>
            </div>

            {/* Right panel */}
            <div className="spec__right-panel">

              {/* Prediction card */}
              <div className="spec__pred-card">
                <div className="spec__pred-header">
                  <span className="spec__pred-label">AI Prediction</span>
                  <span className={`spec__pred-trend spec__pred-trend--${specData.prediction.trend}`}>
                    {specData.prediction.trend === 'up'
                      ? <><Icon.ArrowUp size={11} /> Increasing</>
                      : specData.prediction.trend === 'stable'
                      ? <><Icon.ArrowRight size={11} /> Stable</>
                      : <><Icon.ArrowDown size={11} /> Decreasing</>}
                  </span>
                </div>
                <div className="spec__pred-subject">{specData.prediction.specialization}</div>

                {/* Probability ring */}
                <div className="spec__pred-ring-wrap">
                  <svg viewBox="0 0 80 80" className="spec__pred-ring-svg">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(150,172,183,0.1)" strokeWidth="5" />
                    <circle
                      cx="40" cy="40" r="34"
                      fill="none"
                      stroke={specData.prediction.probability > 0.8 ? '#4ade80' : '#96ACB7'}
                      strokeWidth="5"
                      strokeDasharray={`${Math.round(specData.prediction.probability * 213.6)} 213.6`}
                      strokeLinecap="round"
                      transform="rotate(-90 40 40)"
                    />
                    <text x="40" y="36" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="800" fontFamily="Raleway">
                      {Math.round(specData.prediction.probability * 100)}%
                    </text>
                    <text x="40" y="50" textAnchor="middle" fill="#6e8794" fontSize="8" fontFamily="Raleway">
                      probability
                    </text>
                  </svg>
                </div>

                {/* Specialist flags */}
                <div className="spec__flags">
                  <div className={`spec__flag ${isSpecialist ? 'spec__flag--active' : ''}`}>
                    <span>{isSpecialist ? <Icon.Check size={12} /> : <Icon.Circle size={12} />}</span>
                    60%+ threshold met
                  </div>
                  <div className={`spec__flag ${consecutiveSpec ? 'spec__flag--active' : ''}`}>
                    <span>{consecutiveSpec ? <Icon.Check size={12} /> : <Icon.Circle size={12} />}</span>
                    3 consecutive semesters
                  </div>
                  <div className={`spec__flag ${specData.prediction.status === 'Developing Specialist' ? 'spec__flag--specialist' : ''}`}>
                    <span><Icon.Sprout size={12} /></span>
                    {specData.prediction.status}
                  </div>
                </div>

                <div className="spec__pred-note">
                  Based on logistic regression model using {specData.semesters.length} semesters of teaching data,
                  departmental growth rate, and course demand index.
                </div>
              </div>

              {/* Semester breakdown table */}
              <div className="spec__sem-table">
                <div className="spec__sem-table-header">Semester Breakdown</div>
                <div className="spec__sem-rows">
                  {specData.semesters.slice(-4).map((sem, i) => (
                    <div key={i} className="spec__sem-row">
                      <div className="spec__sem-label">{sem.label}</div>
                      <div className="spec__sem-bars">
                        {Object.entries(sem).filter(([k]) => k !== 'label').map(([key, val]) => (
                          <div key={key} className="spec__sem-bar-item">
                            <div className="spec__sem-bar-label">{key}</div>
                            <div className="spec__sem-bar-track">
                              <div
                                className="spec__sem-bar-fill"
                                style={{ width: `${val}%`, background: COLORS[key] || '#96ACB7' }}
                              />
                            </div>
                            <span className="spec__sem-bar-val">{val}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Threshold marker */}
              <div className="spec__threshold-card">
                <div className="spec__threshold-title"><Icon.Ruler size={13} /> Specialization Threshold Rule</div>
                <p className="spec__threshold-desc">
                  A faculty member is flagged as a <strong>Developing Specialist</strong> when their
                  workload consists of <strong>&gt;60%</strong> of a specific subject area across
                  <strong> three consecutive semesters</strong>.
                </p>
                <div className="spec__threshold-bar">
                  <div
                    className="spec__threshold-fill"
                    style={{ width: `${Math.min(100, topSubjectVal)}%` }}
                  />
                  <div className="spec__threshold-marker" style={{ left: '60%' }}>
                    <span>60% threshold</span>
                  </div>
                </div>
                <div className="spec__threshold-vals">
                  <span>Current peak: <strong>{topSubjectVal}%</strong></span>
                  <span>Threshold: <strong>60%</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
