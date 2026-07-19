import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import PageHeader from '../../components/PageHeader';
import Icon from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import './SubjectRequests.css';

const STATUS_FILTERS = ['all', 'pending', 'approved', 'rejected'];

export default function SubjectRequests() {
  const { requests, updateRequestStatus } = useAuth();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // { req, action: 'approve'|'deny' }
  const [adminNote, setAdminNote] = useState('');
  const [processing, setProcessing] = useState(false);

  const filtered = useMemo(() => {
    return requests.filter(r => {
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        r.facultyName.toLowerCase().includes(q) ||
        r.courseName.toLowerCase().includes(q) ||
        r.course.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [requests, statusFilter, search]);

  const counts = useMemo(() => ({
    all: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  }), [requests]);

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
      updateRequestStatus(
        modal.req.id,
        modal.action === 'approve' ? 'approved' : 'rejected',
        adminNote
      );
      setProcessing(false);
      closeModal();
    }, 800);
  };

  return (
    <div className="sreq-page">
      <Navbar variant="dashboard" />
      <main className="sreq-page__main">
        <div className="container">

          <PageHeader
            icon={<Icon.Inbox size={22} />}
            badge="Admin Tool"
            title="Subject Request Management"
            subtitle="Review, approve, or deny faculty subject assignment requests."
            actions={
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin')}>
                ← Back to Dashboard
              </button>
            }
          />

          {/* ── Controls ─── */}
          <div className="sreq__controls">
            {/* Filter tabs */}
            <div className="sreq__filter-tabs">
              {STATUS_FILTERS.map(f => (
                <button
                  key={f}
                  className={`sreq__filter-tab ${statusFilter === f ? 'sreq__filter-tab--active' : ''}`}
                  onClick={() => setStatusFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  <span className={`sreq__filter-count sreq__filter-count--${f}`}>{counts[f]}</span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="sreq__search-wrap">
              <Icon.Users size={14} />
              <input
                className="sreq__search"
                type="text"
                placeholder="Search by faculty or course..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* ── Request list ─── */}
          {filtered.length === 0 ? (
            <div className="sreq__empty">
              <Icon.Inbox size={32} />
              <p>No requests match your current filter.</p>
            </div>
          ) : (
            <div className="sreq__list">
              {filtered.map(req => (
                <div key={req.id} className={`sreq__card sreq__card--${req.status}`}>

                  {/* Card header */}
                  <div className="sreq__card-header">
                    <div className="sreq__card-faculty">
                      <div className="sreq__card-avatar">
                        {req.facultyName.split(' ').map(w => w[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <div className="sreq__card-name">{req.facultyName}</div>
                        <div className="sreq__card-date">Submitted {req.date}</div>
                      </div>
                    </div>
                    <span className={`sreq__status-badge sreq__status-badge--${req.status}`}>
                      {req.status === 'pending' && <Icon.AlertTriangle size={11} />}
                      {req.status === 'approved' && <Icon.CheckCircle size={11} />}
                      {req.status === 'rejected' && <Icon.XCircle size={11} />}
                      {req.status}
                    </span>
                  </div>

                  {/* Course info */}
                  <div className="sreq__card-course">
                    <span className="sreq__card-course-id">{req.course}</span>
                    <span className="sreq__card-course-name">{req.courseName}</span>
                  </div>

                  {/* Reason */}
                  <div className="sreq__card-reason">
                    <span className="sreq__card-reason-label">Justification</span>
                    <p>"{req.reason}"</p>
                  </div>

                  {/* Admin note (if reviewed) */}
                  {req.adminNote && (
                    <div className="sreq__card-admin-note">
                      <span className="sreq__card-reason-label">Admin Note</span>
                      <p>{req.adminNote}</p>
                      {req.reviewedAt && (
                        <div className="sreq__card-reviewed-date">Reviewed: {req.reviewedAt}</div>
                      )}
                    </div>
                  )}

                  {/* Actions — only for pending */}
                  {req.status === 'pending' && (
                    <div className="sreq__card-actions">
                      <button
                        className="sreq__action-btn sreq__action-btn--approve"
                        onClick={() => openModal(req, 'approve')}
                      >
                        <Icon.CheckCircle size={14} /> Approve
                      </button>
                      <button
                        className="sreq__action-btn sreq__action-btn--deny"
                        onClick={() => openModal(req, 'deny')}
                      >
                        <Icon.XCircle size={14} /> Deny
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Confirm Modal ─── */}
      {modal && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
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
                <span className="admin-modal__detail-val">
                  {modal.req.courseName} ({modal.req.course})
                </span>
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
                  Admin Note{' '}
                  <span style={{ color: 'var(--dark-dim)', fontWeight: 400 }}>(optional)</span>
                </label>
                <textarea
                  className="form-input"
                  placeholder={
                    modal.action === 'approve'
                      ? 'e.g. Assignment confirmed for 2025-S1...'
                      : 'e.g. Insufficient credentials for this course level...'
                  }
                  value={adminNote}
                  onChange={e => setAdminNote(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="admin-modal__footer">
              <button className="btn btn-ghost" onClick={closeModal} disabled={processing}>
                Cancel
              </button>
              <button
                className={`btn ${modal.action === 'approve'
                  ? 'admin-modal__btn--approve'
                  : 'admin-modal__btn--deny'}`}
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
    </div>
  );
}
