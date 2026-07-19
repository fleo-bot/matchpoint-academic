import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Cell, PieChart, Pie, ResponsiveContainer, Legend,
} from 'recharts';
import Navbar from '../../components/Navbar';
import PageHeader from '../../components/PageHeader';
import Icon from '../../components/Icons';
import {
  WORKLOAD_SUMMARY, SUBJECT_COVERAGE, FACULTY, SYSTEM_STATS,
} from '../../data/mockData';
import './WorkloadDashboard.css';

const CATEGORY_COLORS = {
  'Specialized Electives (AI/ML)': '#96ACB7',
  'Specialized Electives (Web)':   '#7a9aaa',
  'Core IT / CS':                  '#5e8899',
  'General Education':             '#4a7080',
  'Mathematics':                   '#c8d8e0',
  'Networking / Security':         '#3a5f6e',
};

const WORKLOAD_COLORS = {
  active:       '#96ACB7',
  overloaded:   '#f87171',
  underutilized:'#facc15',
};

// Short names for charts
const shortName = (n) => n.split(' ').slice(-1)[0];

// Custom bar tooltip
const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const faculty = FACULTY.find(f => shortName(f.name) === label);
  return (
    <div className="wl__tooltip">
      <div className="wl__tooltip-title">{faculty?.name || label}</div>
      <div className="wl__tooltip-units">{payload[0].value} / {payload[0].payload.maxUnits} units</div>
      <div className="wl__tooltip-courses">
        {faculty?.courses?.join(', ') || '—'}
      </div>
      <div className={`wl__tooltip-status wl__tooltip-status--${payload[0].payload.status}`}>
        {payload[0].payload.status}
      </div>
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="wl__tooltip">
      <div className="wl__tooltip-title">{d.category}</div>
      <div className="wl__tooltip-units">{d.qualified} qualified / {d.count} courses</div>
      {d.shortage && <div className="wl__tooltip-status wl__tooltip-status--overloaded"><Icon.AlertTriangle size={11} /> Staffing Shortage</div>}
    </div>
  );
};

export default function WorkloadDashboard() {
  const [activeTab, setActiveTab] = useState('workload'); // workload | coverage | profile

  const barData = WORKLOAD_SUMMARY.map(w => ({
    name: shortName(FACULTY.find(f => f.id === w.facultyId)?.name || ''),
    units: w.units,
    maxUnits: w.maxUnits,
    status: w.status,
    percentage: w.percentage,
    facultyId: w.facultyId,
  }));

  const pieData = SUBJECT_COVERAGE.map(c => ({
    name: c.category.split('(')[0].trim(),
    value: c.count,
    ...c,
  }));

  const profileData = FACULTY.map(f => ({
    name: shortName(f.name),
    degree: f.degree.startsWith('Ph.D') ? 'Ph.D' : f.degree.startsWith('M.') ? "Master's" : 'Bachelor\'s',
    load: WORKLOAD_SUMMARY.find(w => w.facultyId === f.id)?.units || 0,
    experience: f.yearsExperience,
  }));

  return (
    <div className="wl-page">
      <Navbar variant="dashboard" />
      <main className="wl-page__main">
        <div className="container">
          <PageHeader
            icon={<Icon.BarChart size={22} />}
            badge="Analytics Dashboard"
            title="Workload & Course Distribution Dashboard"
            subtitle="Real-time staffing intelligence — powered by shinydashboard, plotly, and highcharter. Hover charts for detailed insights."
          />

          {/* Summary stats */}
          <div className="wl__summary-grid">
            {[
              { label: 'Avg. Workload', value: `${SYSTEM_STATS.avgWorkload}%`, icon: Icon.Zap, note: 'Department average' },
              { label: 'Coverage Rate', value: `${SYSTEM_STATS.coverageRate}%`, icon: Icon.Clipboard, note: 'Courses staffed' },
              { label: 'Overloaded', value: WORKLOAD_SUMMARY.filter(w => w.status === 'overloaded').length, icon: () => <Icon.Circle size={16} filled style={{ color: '#f87171' }} />, note: 'Faculty at max capacity' },
              { label: 'Underutilized', value: WORKLOAD_SUMMARY.filter(w => w.status === 'underutilized').length, icon: () => <Icon.Circle size={16} filled style={{ color: '#facc15' }} />, note: 'Faculty with capacity' },
              { label: 'Shortages', value: SUBJECT_COVERAGE.filter(c => c.shortage).length, icon: Icon.AlertTriangle, note: 'Subject areas at risk' },
              { label: 'Developing Specialists', value: SYSTEM_STATS.developingSpecialists, icon: Icon.Sprout, note: 'On specialization track' },
            ].map((s, i) => (
              <div key={i} className="wl__summary-card">
                <div className="wl__summary-icon"><s.icon size={20} /></div>
                <div className="wl__summary-value">{s.value}</div>
                <div className="wl__summary-label">{s.label}</div>
                <div className="wl__summary-note">{s.note}</div>
              </div>
            ))}
          </div>

          {/* Tab navigation */}
          <div className="wl__tabs">
            {[
              { id: 'workload', icon: Icon.BarChart, label: 'Workload Balance', sub: 'Faculty load distribution' },
              { id: 'coverage', icon: Icon.Folder, label: 'Subject Coverage', sub: 'Staffing by category' },
              { id: 'profile', icon: Icon.User, label: 'Profile Insights', sub: 'Degree & experience match' },
            ].map(t => (
              <button
                key={t.id}
                className={`wl__tab ${activeTab === t.id ? 'wl__tab--active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                <span className="wl__tab-label"><t.icon size={14} /> {t.label}</span>
                <span className="wl__tab-sub">{t.sub}</span>
              </button>
            ))}
          </div>

          {/* ── WORKLOAD BALANCE TAB ── */}
          {activeTab === 'workload' && (
            <div className="wl__tab-content">
              <div className="wl__chart-grid">
                {/* Bar chart */}
                <div className="wl__chart-card">
                  <div className="wl__chart-header">
                    <div className="wl__chart-title">Faculty Workload (Units Assigned)</div>
                    <div className="wl__chart-sub">Hover bars for course details · R: plotly / highcharter</div>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={barData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,172,183,0.08)" />
                      <XAxis dataKey="name" tick={{ fill: '#6e8794', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#6e8794', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 15]} />
                      <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(150,172,183,0.05)' }} />
                      <Bar dataKey="units" radius={[6, 6, 0, 0]} maxBarSize={48}>
                        {barData.map((entry, i) => (
                          <Cell
                            key={i}
                            fill={WORKLOAD_COLORS[entry.status] || '#96ACB7'}
                            fillOpacity={0.85}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>

                  {/* Legend */}
                  <div className="wl__bar-legend">
                    {Object.entries(WORKLOAD_COLORS).map(([k, c]) => (
                      <div key={k} className="wl__bar-leg-item">
                        <div className="wl__bar-leg-dot" style={{ background: c }} />
                        <span>{k.charAt(0).toUpperCase() + k.slice(1)}</span>
                      </div>
                    ))}
                    <div className="wl__bar-leg-item">
                      <div style={{ width: 8, height: 8, background: 'rgba(150,172,183,0.3)', borderRadius: 2 }} />
                      <span>Max: 15 units</span>
                    </div>
                  </div>
                </div>

                {/* Workload list */}
                <div className="wl__chart-card">
                  <div className="wl__chart-header">
                    <div className="wl__chart-title">Workload Detail View</div>
                    <div className="wl__chart-sub">Units / Max units · Sorted by load %</div>
                  </div>
                  <div className="wl__workload-list">
                    {[...WORKLOAD_SUMMARY].sort((a, b) => b.percentage - a.percentage).map(w => {
                      const f = FACULTY.find(x => x.id === w.facultyId);
                      return (
                        <div key={w.facultyId} className="wl__wl-row">
                          <div className="wl__wl-avatar">{f?.avatar}</div>
                          <div className="wl__wl-info">
                            <div className="wl__wl-name">{f?.name}</div>
                            <div className="wl__wl-spec">{f?.specialization}</div>
                          </div>
                          <div className="wl__wl-right">
                            <div className="wl__wl-bar-wrap">
                              <div className="wl__wl-bar">
                                <div
                                  className="wl__wl-fill"
                                  style={{
                                    width: `${w.percentage}%`,
                                    background: WORKLOAD_COLORS[w.status] || '#96ACB7',
                                  }}
                                />
                              </div>
                              <span className="wl__wl-pct">{w.percentage}%</span>
                            </div>
                            <div className="wl__wl-units">{w.units}/{w.maxUnits} units</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* R code */}
              <div className="wl__r-code">
                <div className="wl__r-code-header"><Icon.BarChart size={13} /> R Code — shinydashboard + plotly workload chart</div>
                <pre className="wl__r-code-body">{`# Workload Dashboard (R / shinydashboard + plotly)
library(shinydashboard); library(plotly); library(dplyr)

# Interactive bar chart: Faculty vs Units
plot_ly(faculty_workload,
  x = ~faculty_name, y = ~units_assigned,
  type = "bar",
  color = ~status,
  colors = c(active="#96ACB7", overloaded="#f87171", underutilized="#facc15"),
  hovertemplate = paste(
    "<b>%{x}</b><br>",
    "Units: %{y}/15<br>",
    "Courses: %{customdata}<extra></extra>"
  ),
  customdata = ~courses_list
) %>%
layout(
  title = "Faculty Workload Distribution",
  plot_bgcolor = "#000000",
  paper_bgcolor = "#000000",
  xaxis = list(color="#96ACB7"),
  yaxis = list(color="#96ACB7", title="Units Assigned")
)`}</pre>
              </div>
            </div>
          )}

          {/* ── COVERAGE TAB ── */}
          {activeTab === 'coverage' && (
            <div className="wl__tab-content">
              <div className="wl__chart-grid">
                {/* Pie / Donut chart */}
                <div className="wl__chart-card">
                  <div className="wl__chart-header">
                    <div className="wl__chart-title">Subject Category Distribution (Treemap/Pie)</div>
                    <div className="wl__chart-sub">Total courses per category · R: highcharter treemap</div>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={120}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((entry, i) => (
                          <Cell
                            key={i}
                            fill={CATEGORY_COLORS[entry.category] || '#96ACB7'}
                            stroke="none"
                            opacity={entry.shortage ? 0.7 : 1}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="wl__pie-legend">
                    {SUBJECT_COVERAGE.map((c, i) => (
                      <div key={i} className="wl__pie-leg-item">
                        <div className="wl__pie-leg-dot" style={{ background: CATEGORY_COLORS[c.category] || '#96ACB7' }} />
                        <span>{c.category.split('(')[0].trim()}</span>
                        {c.shortage && <span className="wl__shortage-badge"><Icon.AlertTriangle size={12} /></span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coverage detail */}
                <div className="wl__chart-card">
                  <div className="wl__chart-header">
                    <div className="wl__chart-title">Qualified Faculty per Subject Area</div>
                    <div className="wl__chart-sub">Green = adequate · Red = shortage</div>
                  </div>
                  <div className="wl__coverage-list">
                    {SUBJECT_COVERAGE.map((c, i) => (
                      <div key={i} className={`wl__cov-row ${c.shortage ? 'wl__cov-row--shortage' : ''}`}>
                        <div className="wl__cov-top">
                          <span className="wl__cov-name">{c.category}</span>
                          {c.shortage
                            ? <span className="wl__cov-alert"><Icon.AlertTriangle size={11} /> Shortage — {c.count - c.qualified} unqualified</span>
                            : <span className="wl__cov-ok"><Icon.Check size={11} /> Adequate</span>
                          }
                        </div>
                        <div className="wl__cov-bar-wrap">
                          <div className="wl__cov-bar">
                            <div
                              className="wl__cov-fill"
                              style={{
                                width: `${Math.round((c.qualified / c.count) * 100)}%`,
                                background: c.shortage
                                  ? 'linear-gradient(90deg,#f87171,#ef4444)'
                                  : 'linear-gradient(90deg,#6e8794,#96ACB7)',
                              }}
                            />
                          </div>
                          <span className="wl__cov-ratio">{c.qualified}/{c.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── PROFILE TAB ── */}
          {activeTab === 'profile' && (
            <div className="wl__tab-content">
              <div className="wl__chart-grid wl__chart-grid--single">
                <div className="wl__chart-card wl__chart-card--full">
                  <div className="wl__chart-header">
                    <div className="wl__chart-title">Academic Profile vs Course Level Matching</div>
                    <div className="wl__chart-sub">Degree qualifications matched to course complexity · Profile Insights</div>
                  </div>

                  <div className="wl__profile-table">
                    <div className="wl__profile-header-row">
                      <span>Faculty</span>
                      <span>Degree</span>
                      <span>Specialization</span>
                      <span>Experience</span>
                      <span>Course Levels</span>
                      <span>Load Match</span>
                    </div>
                    {FACULTY.map(f => {
                      const wl = WORKLOAD_SUMMARY.find(w => w.facultyId === f.id);
                      const isDrPhd = f.degree.startsWith('Ph.D');
                      const isMaster = f.degree.startsWith('M.');
                      return (
                        <div key={f.id} className="wl__profile-row">
                          <div className="wl__profile-faculty">
                            <div className="wl__profile-avatar">{f.avatar}</div>
                            <div>
                              <div className="wl__profile-name">{f.name}</div>
                              <div className="wl__profile-rank">{f.rank}</div>
                            </div>
                          </div>
                          <div>
                            <span className={`wl__degree-badge ${isDrPhd ? 'wl__degree-badge--phd' : isMaster ? 'wl__degree-badge--master' : ''}`}>
                              {isDrPhd ? 'Ph.D' : isMaster ? "Master's" : "Bachelor's"}
                            </span>
                          </div>
                          <div className="wl__profile-spec">{f.specialization}</div>
                          <div className="wl__profile-exp">{f.yearsExperience} yrs</div>
                          <div className="wl__profile-levels">
                            {f.courses.map(cid => (
                              <span key={cid} className="tag">{cid}</span>
                            ))}
                          </div>
                          <div>
                            <span className={`wl__load-badge wl__load-badge--${wl?.status || 'active'}`}>
                              {wl?.percentage}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* R code */}
                  <div className="wl__r-code" style={{ margin: '16px 0 0' }}>
                    <div className="wl__r-code-header"><Icon.BarChart size={13} /> R Code — Profile demographic breakdown</div>
                    <pre className="wl__r-code-body">{`# Profile Insights (R)
library(ggplot2); library(dplyr)

# Match degree level to course level
faculty_profile <- faculty_data %>%
  mutate(
    degree_level = case_when(
      grepl("Ph.D", degree) ~ "Doctoral",
      grepl("^M\\\\.", degree) ~ "Master",
      TRUE ~ "Bachelor"
    ),
    course_level_avg = sapply(courses, mean_course_level)
  )

# Bubble chart: experience vs workload, colored by degree
ggplot(faculty_profile,
  aes(x=years_experience, y=workload_pct,
      size=course_count, color=degree_level)) +
  geom_point(alpha=0.8) +
  scale_color_manual(values=c(Doctoral="#FFFFFF",
                               Master="#96ACB7",
                               Bachelor="#5e8899")) +
  labs(title="Faculty Profile: Experience vs Workload") +
  theme_dark()`}</pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
