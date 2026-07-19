import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import PageHeader from '../../components/PageHeader';
import Icon from '../../components/Icons';
import { COURSES, RECOMMENDATION_DATA, FACULTY_REQUESTS } from '../../data/mockData';
import './RecommendationEngine.css';

const WEIGHTS = { historicalFit: 0.40, academicProfile: 0.35, workloadScore: 0.25 };

function ScoreBar({ value, max = 100, color }) {
  return (
    <div className="rec__score-bar-wrap">
      <div className="rec__score-bar-track">
        <div
          className="rec__score-bar-fill"
          style={{
            width: `${(value / max) * 100}%`,
            background: color || 'linear-gradient(90deg,#6e8794,#96ACB7)',
          }}
        />
      </div>
      <span className="rec__score-bar-label">{value}%</span>
    </div>
  );
}

export default function RecommendationEngine() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [showWeights, setShowWeights] = useState(false);
  const [weights, setWeights] = useState(WEIGHTS);

  const recommendations = selectedCourse ? RECOMMENDATION_DATA[selectedCourse] || [] : [];
  const course = COURSES.find(c => c.id === selectedCourse);

  // Check if any faculty requests match this course
  const courseRequests = FACULTY_REQUESTS.filter(r => r.course === selectedCourse);

  // Sort by score
  const ranked = [...recommendations].sort((a, b) => b.score - a.score);

  const statusColor = (s) => {
    if (s === 'Highly Recommended') return '#4ade80';
    if (s === 'Recommended') return '#96ACB7';
    if (s === 'Possible') return '#facc15';
    return '#f87171';
  };

  const topThree = ranked.slice(0, 3);

  return (
    <div className="rec-page">
      <Navbar variant="dashboard" />
      <main className="rec-page__main">
        <div className="container">
          <PageHeader
            icon={<Icon.Target size={22} />}
            badge="AI-Powered Module"
            title="Smart Faculty Recommendation Engine"
            subtitle="Select a course to get ranked faculty recommendations based on weighted compatibility scoring using R (dplyr)."
            actions={
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setShowWeights(!showWeights)}
              >
                <Icon.Settings size={14} /> Scoring Weights
              </button>
            }
          />

          {/* ── Weights panel ── */}
          {showWeights && (
            <div className="rec__weights-panel">
              <div className="rec__weights-title">
                R Scoring Weights — <code>dplyr::mutate(score = w1*hist + w2*profile + w3*workload)</code>
              </div>
              <div className="rec__weights-grid">
                {Object.entries(weights).map(([key, val]) => (
                  <div key={key} className="rec__weight-item">
                    <div className="rec__weight-label">
                      {key === 'historicalFit' ? 'Historical Fit'
                        : key === 'academicProfile' ? 'Academic Profile'
                        : 'Workload Score'}
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={val}
                      onChange={(e) => setWeights(prev => ({ ...prev, [key]: parseFloat(e.target.value) }))}
                      className="rec__weight-slider"
                    />
                    <span className="rec__weight-val">{Math.round(val * 100)}%</span>
                  </div>
                ))}
              </div>
              <div className="rec__weights-note">
                Total weight: {Math.round(Object.values(weights).reduce((a, v) => a + v, 0) * 100)}%
                (should equal 100% for balanced scoring)
              </div>
            </div>
          )}

          {/* ── Course selector ── */}
          <div className="rec__course-selector">
            <div className="rec__selector-label">Select a Course to Analyze</div>
            <div className="rec__course-grid">
              {Object.keys(RECOMMENDATION_DATA).map(cid => {
                const c = COURSES.find(x => x.id === cid);
                return (
                  <button
                    key={cid}
                    className={`rec__course-btn ${selectedCourse === cid ? 'rec__course-btn--active' : ''}`}
                    onClick={() => setSelectedCourse(cid)}
                  >
                    <span className="rec__course-btn-id">{cid}</span>
                    <span className="rec__course-btn-name">{c?.name || cid}</span>
                    <span className="tag">{c?.category}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Results ── */}
          {selectedCourse && course ? (
            <div className="rec__results">

              {/* Course summary */}
              <div className="rec__course-summary">
                <div className="rec__cs-left">
                  <div className="rec__cs-id">{course.id}</div>
                  <div className="rec__cs-name">{course.name}</div>
                  <div className="rec__cs-desc">{course.description}</div>
                  <div className="rec__cs-tags">
                    <span className="tag">{course.category}</span>
                    <span className="tag">{course.units} Units</span>
                    <span className="tag">Level {course.level}</span>
                  </div>
                </div>
                {courseRequests.length > 0 && (
                  <div className="rec__cs-requests">
                    <div className="rec__cs-req-label">
                      <Icon.Inbox size={13} /> Faculty Requests for this course
                    </div>
                    {courseRequests.map(req => (
                      <div key={req.id} className="rec__cs-req-item">
                        <span className="rec__cs-req-name">{req.facultyName}</span>
                        <span className={`admin-dash__req-status admin-dash__req-status--${req.status}`}>
                          {req.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top 3 highlights */}
              <div className="rec__top3">
                <div className="rec__top3-label">
                  Top 3 Matches — R Output (dplyr weighted scoring)
                </div>
                <div className="rec__top3-grid">
                  {topThree.map((r, i) => (
                    <div key={r.facultyId} className={`rec__top3-card rec__top3-card--${i}`}>
                      <div className="rec__top3-rank">#{i + 1}</div>
                      <div className="rec__top3-avatar">
                        {r.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                      </div>
                      <div className="rec__top3-name">{r.name}</div>
                      <div className="rec__top3-score-ring">
                        <svg viewBox="0 0 36 36" className="rec__ring-svg">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none" stroke="rgba(150,172,183,0.15)" strokeWidth="2.5"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={statusColor(r.status)}
                            strokeWidth="2.5"
                            strokeDasharray={`${r.score}, 100`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="rec__ring-value">{r.score}%</div>
                      </div>
                      <div className="rec__top3-status" style={{ color: statusColor(r.status) }}>
                        {r.status}
                      </div>
                      <div className="rec__top3-taught">
                        {r.timesTaught > 0 ? `Taught ${r.timesTaught}× before` : 'First time'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full ranked table */}
              <div className="rec__table-section">
                <div className="rec__table-header">
                  <span className="rec__table-title">Full Compatibility Rankings</span>
                  <span className="rec__table-sub">R Output — DT Package Visualization</span>
                </div>
                <div className="rec__table-wrap">
                  <table className="rec__table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Faculty Member</th>
                        <th>Compatibility Score</th>
                        <th>Historical Fit</th>
                        <th>Academic Profile</th>
                        <th>Workload</th>
                        <th>Times Taught</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ranked.map((r, i) => (
                        <tr key={r.facultyId} className={i < 3 ? 'rec__table-row--top' : ''}>
                          <td className="rec__table-rank">
                            {i === 0 ? <Icon.Medal size={16} style={{ color: '#e8c86a' }} />
                              : i === 1 ? <Icon.Medal size={16} style={{ color: '#c7d2d9' }} />
                              : i === 2 ? <Icon.Medal size={16} style={{ color: '#c98a56' }} />
                              : `#${i + 1}`}
                          </td>
                          <td className="rec__table-faculty">
                            <div className="rec__tf-avatar">
                              {r.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                            </div>
                            <span>{r.name}</span>
                            {courseRequests.some(req => req.facultyId === r.facultyId) && (
                              <span className="rec__req-badge" title="Has requested this course"><Icon.Inbox size={12} /></span>
                            )}
                          </td>
                          <td>
                            <ScoreBar
                              value={r.score}
                              color={
                                r.score >= 80 ? 'linear-gradient(90deg,#4ade80,#22c55e)'
                                  : r.score >= 60 ? 'linear-gradient(90deg,#6e8794,#96ACB7)'
                                  : 'linear-gradient(90deg,#f87171,#ef4444)'
                              }
                            />
                          </td>
                          <td><ScoreBar value={r.historicalFit} /></td>
                          <td><ScoreBar value={r.academicProfile} /></td>
                          <td><ScoreBar value={r.workloadScore} /></td>
                          <td className="rec__table-taught">
                            <span>{r.timesTaught > 0 ? `${r.timesTaught}×` : '—'}</span>
                          </td>
                          <td>
                            <span
                              className="rec__status-badge"
                              style={{
                                color: statusColor(r.status),
                                background: `${statusColor(r.status)}18`,
                                border: `1px solid ${statusColor(r.status)}40`,
                              }}
                            >
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* R code preview */}
                <div className="rec__r-code">
                  <div className="rec__r-code-header">
                    <span><Icon.BarChart size={13} /> R Code — dplyr scoring logic</span>
                  </div>
                  <pre className="rec__r-code-body">{`# Faculty Recommendation Engine (R / dplyr)
library(dplyr)
library(DT)

faculty_scores <- faculty_data %>%
  mutate(
    historical_fit   = calculate_fit(faculty_id, course_id),
    academic_profile = match_credentials(degree, course_topic),
    workload_score   = (max_load - current_load) / max_load * 100
  ) %>%
  mutate(
    compatibility_score = (
      historical_fit   * ${Math.round(weights.historicalFit * 100) / 100} +
      academic_profile * ${Math.round(weights.academicProfile * 100) / 100} +
      workload_score   * ${Math.round(weights.workloadScore * 100) / 100}
    )
  ) %>%
  arrange(desc(compatibility_score))

# Display with DT package (top 3 highlighted)
datatable(faculty_scores, options = list(pageLength = 10)) %>%
  formatStyle('compatibility_score',
    background = styleColorBar(c(0,100), '#96ACB7'),
    backgroundSize = '100% 80%',
    backgroundRepeat = 'no-repeat',
    backgroundPosition = 'center'
  )`}</pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="rec__placeholder">
              <div className="rec__placeholder-icon"><Icon.Target size={44} /></div>
              <div className="rec__placeholder-title">Select a course above to generate recommendations</div>
              <div className="rec__placeholder-sub">
                The engine will calculate weighted compatibility scores for all faculty members
                using R's dplyr package and display ranked results with visual progress bars.
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
