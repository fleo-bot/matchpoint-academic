import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import PageHeader from '../../components/PageHeader';
import Icon from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import { COURSES, RECOMMENDATION_DATA } from '../../data/mockData';
import './RequestSubject.css';

export default function RequestSubject() {
  const { user, requests, addRequest } = useAuth();
  const navigate = useNavigate();

  const [selectedCourse, setSelectedCourse] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const myRequests = requests.filter(r => r.facultyId === (user?.id || 'f001'));
  const course = COURSES.find(c => c.id === selectedCourse);

  // Check if this faculty already has a high compatibility score for selected course
  const existingScore = selectedCourse && RECOMMENDATION_DATA[selectedCourse]
    ? RECOMMENDATION_DATA[selectedCourse].find(r => r.facultyId === (user?.id || 'f001'))
    : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCourse || !reason.trim()) return;
    setSubmitting(true);

    setTimeout(() => {
      const newReq = {
        id: `req${Date.now()}`,
        facultyId: user?.id || 'f001',
        facultyName: user?.name || 'Faculty Member',
        course: selectedCourse,
        courseName: course?.name || selectedCourse,
        reason: reason.trim(),
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
      };
      addRequest(newReq);
      setSubmitted(true);
      setSubmitting(false);
    }, 1200);
  };

  const handleNewRequest = () => {
    setSubmitted(false);
    setSelectedCourse('');
    setReason('');
  };

  return (
    <div className="req-page">
      <Navbar variant="dashboard" />
      <main className="req-page__main">
        <div className="container">
          <PageHeader
            icon={<Icon.Mail size={22} />}
            badge="Faculty Tool"
            title="Request a Subject Assignment"
            subtitle="Submit a formal request to teach a specific course. Your request is factored into the recommendation engine's compatibility scoring."
          />

          <div className="req__grid">

            {/* Form */}
            <div className="req__form-col">
              {submitted ? (
                <div className="req__success">
                  <div className="req__success-icon"><Icon.CheckCircle size={44} /></div>
                  <h2 className="req__success-title">Request Submitted!</h2>
                  <p className="req__success-desc">
                    Your request to teach <strong>{course?.name}</strong> has been submitted and
                    is now pending admin review. It has also been factored into the recommendation engine.
                  </p>
                  <div className="req__success-actions">
                    <button className="btn btn-outline" onClick={handleNewRequest}>
                      Submit Another Request
                    </button>
                    <button className="btn btn-primary" onClick={() => navigate('/faculty')}>
                      Back to Dashboard
                    </button>
                  </div>
                </div>
              ) : (
                <div className="req__form-card">
                  <div className="req__form-title">New Course Request</div>

                  {/* How it works */}
                  <div className="req__how-it-works">
                    <div className="req__hiw-title">
                      <span>ℹ️</span> How requests affect recommendations
                    </div>
                    <p className="req__hiw-desc">
                      When you request a course, a "Faculty Request Bonus" is added to your compatibility
                      score in the recommendation engine. Admins see your request highlighted in the
                      ranked table when they run the engine for that course.
                    </p>
                  </div>

                  <form className="req__form" onSubmit={handleSubmit}>
                    {/* Course selector */}
                    <div className="req__field">
                      <label className="form-label">Select Course</label>
                      <div className="req__course-grid">
                        {COURSES.map(c => {
                          const alreadyReq = requests.some(r => r.facultyId === (user?.id || 'f001') && r.course === c.id && r.status !== 'rejected');
                          return (
                            <button
                              key={c.id}
                              type="button"
                              className={`req__course-btn ${selectedCourse === c.id ? 'req__course-btn--active' : ''} ${alreadyReq ? 'req__course-btn--requested' : ''}`}
                              onClick={() => !alreadyReq && setSelectedCourse(c.id)}
                              disabled={alreadyReq}
                            >
                              <div className="req__cb-top">
                                <span className="req__cb-id">{c.id}</span>
                                {alreadyReq && <span className="req__cb-req-badge">Requested</span>}
                              </div>
                              <div className="req__cb-name">{c.name}</div>
                              <span className="tag">{c.category}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Course preview */}
                    {course && (
                      <div className="req__course-preview">
                        <div className="req__cp-header">
                          <div className="req__cp-id">{course.id}</div>
                          <span className="tag">{course.category}</span>
                        </div>
                        <div className="req__cp-name">{course.name}</div>
                        <div className="req__cp-desc">{course.description}</div>
                        <div className="req__cp-meta">
                          <span>{course.units} units</span>
                          <span>Level {course.level}</span>
                        </div>

                        {existingScore && (
                          <div className="req__compatibility-hint">
                            <div className="req__ch-label">Your Current Compatibility Score</div>
                            <div className="req__ch-bar-wrap">
                              <div className="req__ch-bar">
                                <div
                                  className="req__ch-fill"
                                  style={{
                                    width: `${existingScore.score}%`,
                                    background: existingScore.score >= 80
                                      ? 'linear-gradient(90deg,#4ade80,#22c55e)'
                                      : existingScore.score >= 60
                                      ? 'linear-gradient(90deg,#6e8794,#96ACB7)'
                                      : 'linear-gradient(90deg,#f87171,#ef4444)',
                                  }}
                                />
                              </div>
                              <span className="req__ch-val">{existingScore.score}%</span>
                            </div>
                            <div className="req__ch-status" style={{
                              color: existingScore.score >= 80 ? '#4ade80'
                                : existingScore.score >= 60 ? '#96ACB7'
                                : '#facc15'
                            }}>
                              {existingScore.status}
                            </div>
                            <div className="req__ch-note">
                              <Icon.Sparkles size={12} /> Submitting this request will apply a +5% compatibility bonus, boosting your ranking.
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Reason */}
                    <div className="req__field">
                      <label className="form-label">Reason / Justification</label>
                      <textarea
                        className="form-input req__textarea"
                        placeholder="Explain why you are qualified or interested in teaching this course (e.g., relevant credentials, research, experience)..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={5}
                        required
                      />
                      <div className="req__char-count">{reason.length}/500 characters</div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className={`btn btn-primary req__submit ${submitting ? 'req__submit--loading' : ''}`}
                      disabled={!selectedCourse || !reason.trim() || submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="login__spinner" />
                          Submitting Request...
                        </>
                      ) : (
                        <>
                          Submit Course Request
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Right: My requests history */}
            <div className="req__history-col">
              <div className="req__history-card">
                <div className="req__history-title">My Request History</div>
                {myRequests.length === 0 ? (
                  <div className="req__history-empty">No requests yet.</div>
                ) : (
                  <div className="req__history-list">
                    {myRequests.map(req => (
                      <div key={req.id} className={`req__hist-row req__hist-row--${req.status}`}>
                        <div className="req__hist-top">
                          <span className="req__hist-course">{req.courseName}</span>
                          <span className={`admin-dash__req-status admin-dash__req-status--${req.status}`}>
                            {req.status}
                          </span>
                        </div>
                        <div className="req__hist-reason">"{req.reason}"</div>
                        {req.adminNote && (
                          <div className="req__hist-admin-note">
                            <span className="req__hist-note-label">Admin note:</span> {req.adminNote}
                          </div>
                        )}
                        <div className="req__hist-date">
                          Submitted: {req.date}
                          {req.reviewedAt && ` · Reviewed: ${req.reviewedAt}`}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Info card */}
              <div className="req__info-card">
                <div className="req__info-title"><Icon.BarChart size={13} /> How Requests Influence the Engine</div>
                <div className="req__info-steps">
                  {[
                    { step: '1', text: 'You submit a course request with a justification.' },
                    { step: '2', text: 'A +5% request bonus is applied to your compatibility score for that course.' },
                    { step: '3', text: <>Admin sees an <Icon.Inbox size={12} style={{ verticalAlign: 'middle' }} /> icon next to your name in the ranked recommendations table.</> },
                    { step: '4', text: 'Admin makes the final assignment decision using your score + request context.' },
                  ].map((s, i) => (
                    <div key={i} className="req__info-step">
                      <div className="req__info-step-num">{s.step}</div>
                      <div className="req__info-step-text">{s.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
