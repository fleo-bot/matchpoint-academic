import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar({ variant = 'default' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const adminLinks = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Recommendations', path: '/admin/recommendation' },
    { label: 'Specialization', path: '/admin/specialization' },
    { label: 'Workload', path: '/admin/workload' },
  ];

  const facultyLinks = [
    { label: 'Dashboard', path: '/faculty' },
    { label: 'My Profile', path: '/faculty/profile' },
    { label: 'Request Subject', path: '/faculty/request' },
  ];

  const links = user?.role === 'admin' ? adminLinks : facultyLinks;

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''} navbar--${variant}`}>
      <div className="navbar__inner">
        {/* Logo */}
        <button className="navbar__logo" onClick={() => navigate(user ? (user.role === 'admin' ? '/admin' : '/faculty') : '/')}>
          <div className="navbar__logo-icon">
            <svg width="32" height="32" viewBox="0 0 44 44" fill="none">
              <circle cx="22" cy="22" r="20" stroke="url(#navGrad)" strokeWidth="2"/>
              <circle cx="22" cy="22" r="13" stroke="#96ACB7" strokeWidth="1.5" strokeDasharray="4 2"/>
              <circle cx="22" cy="22" r="4" fill="url(#navGrad)"/>
              <line x1="22" y1="2" x2="22" y2="10" stroke="#96ACB7" strokeWidth="2" strokeLinecap="round"/>
              <line x1="22" y1="34" x2="22" y2="42" stroke="#96ACB7" strokeWidth="2" strokeLinecap="round"/>
              <line x1="2" y1="22" x2="10" y2="22" stroke="#96ACB7" strokeWidth="2" strokeLinecap="round"/>
              <line x1="34" y1="22" x2="42" y2="22" stroke="#96ACB7" strokeWidth="2" strokeLinecap="round"/>
              <defs>
                <linearGradient id="navGrad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#96ACB7"/>
                  <stop offset="1" stopColor="#FFFFFF"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="navbar__logo-text">
            <span className="navbar__logo-name">MatchPoint</span>
            <span className="navbar__logo-sub">Academic</span>
          </div>
        </button>

        {/* Desktop links */}
        {user && (
          <ul className="navbar__links">
            {links.map(link => (
              <li key={link.path}>
                <button
                  className={`navbar__link ${location.pathname === link.path ? 'navbar__link--active' : ''}`}
                  onClick={() => navigate(link.path)}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Right side */}
        <div className="navbar__right">
          {user ? (
            <div className="navbar__user">
              <div className="navbar__avatar">{user.name?.charAt(0) || user.role.charAt(0).toUpperCase()}</div>
              <div className="navbar__user-info">
                <span className="navbar__user-name">{user.name}</span>
                <span className="navbar__user-role">{user.role}</span>
              </div>
              <button className="navbar__logout" onClick={handleLogout} title="Logout">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          ) : (
            <div className="navbar__actions">
              <button className="btn btn-outline btn-sm" onClick={() => navigate('/login')}>Sign In</button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button className="navbar__hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span className={menuOpen ? 'open' : ''}></span>
            <span className={menuOpen ? 'open' : ''}></span>
            <span className={menuOpen ? 'open' : ''}></span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && user && (
        <div className="navbar__mobile-menu">
          {links.map(link => (
            <button
              key={link.path}
              className={`navbar__mobile-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => { navigate(link.path); setMenuOpen(false); }}
            >
              {link.label}
            </button>
          ))}
          <button className="navbar__mobile-link navbar__mobile-logout" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}
