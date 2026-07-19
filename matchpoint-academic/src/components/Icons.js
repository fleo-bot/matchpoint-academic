import React from 'react';

/* ============================================
   MatchPoint Academic — Icon Library
   Lightweight stroke-based vector icons (24x24
   grid, currentColor) replacing emoji glyphs.
   Usage: <Icon.Target size={16} />
============================================ */

const base = (props, size) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  ...props,
});

export const GraduationCap = ({ size = 16, ...p }) => (
  <svg {...base(p, size)}>
    <path d="M2 9.5 12 5l10 4.5-10 4.5-10-4.5Z" />
    <path d="M6 11.5V17c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" />
    <path d="M21 9.5v6" />
  </svg>
);

export const Target = ({ size = 16, ...p }) => (
  <svg {...base(p, size)}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="0.8" fill="currentColor" />
  </svg>
);

export const TrendingUp = ({ size = 16, ...p }) => (
  <svg {...base(p, size)}>
    <polyline points="3 16 9.5 9.5 14 14 21 6" />
    <polyline points="15 6 21 6 21 12" />
  </svg>
);

export const TrendingDown = ({ size = 16, ...p }) => (
  <svg {...base(p, size)}>
    <polyline points="3 8 9.5 14.5 14 10 21 18" />
    <polyline points="21 12 21 18 15 18" />
  </svg>
);

export const ArrowUp = ({ size = 16, ...p }) => (
  <svg {...base(p, size)}>
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="6 11 12 5 18 11" />
  </svg>
);

export const ArrowDown = ({ size = 16, ...p }) => (
  <svg {...base(p, size)}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="18 13 12 19 6 13" />
  </svg>
);

export const ArrowRight = ({ size = 16, ...p }) => (
  <svg {...base(p, size)}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export const ArrowLeft = ({ size = 16, ...p }) => (
  <svg {...base(p, size)}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export const BarChart = ({ size = 16, ...p }) => (
  <svg {...base(p, size)}>
    <line x1="5" y1="20" x2="5" y2="12" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="19" y1="20" x2="19" y2="9" />
  </svg>
);

export const Flame = ({ size = 16, ...p }) => (
  <svg {...base(p, size)}>
    <path d="M12 2.5c1.2 2.4-.4 3.8-1.6 5.1C9 9 8.2 10.4 8.2 12.2A3.8 3.8 0 0 0 12 16a3.8 3.8 0 0 0 3.8-3.8c0-1-.4-1.7-.9-2.4.9.6 2.1 2 2.1 4.2A5 5 0 0 1 12 19a5 5 0 0 1-5-5c0-4.3 3.2-6.1 3.2-9.1 0-.9-.3-1.6-.7-2.4.9.1 1.9.5 2.5 0Z" />
  </svg>
);

export const Shield = ({ size = 16, ...p }) => (
  <svg {...base(p, size)}>
    <path d="M12 3 5 6v5.5c0 4.6 2.9 7.7 7 8.5 4.1-.8 7-3.9 7-8.5V6l-7-3Z" />
    <path d="M9 12l2 2 4-4.5" />
  </svg>
);

export const Mail = ({ size = 16, ...p }) => (
  <svg {...base(p, size)}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 6.5 8 6.5 8-6.5" />
  </svg>
);

export const Sprout = ({ size = 16, ...p }) => (
  <svg {...base(p, size)}>
    <path d="M6 10c0 3.3 2.7 5 5 5V9.5C11 7 8.6 5 6 5v5Z" />
    <path d="M18 7c0 3-2.4 4.5-4.5 4.5V7c0-2.5 2-4 4.5-4v4Z" />
    <path d="M11 15v6" />
  </svg>
);

export const Ruler = ({ size = 16, ...p }) => (
  <svg {...base(p, size)}>
    <rect x="2.5" y="8" width="19" height="8" rx="1.5" transform="rotate(-15 12 12)" />
    <path d="m8 8.7 1 2M11 8 12 10M14 7.3l1 2M17 6.6l1 2" />
  </svg>
);

export const Settings = ({ size = 16, ...p }) => (
  <svg {...base(p, size)}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2.5v2.4M12 19.1v2.4M4.2 6.3l1.9 1.4M17.9 16.3l1.9 1.4M2 12h2.4M19.6 12H22M4.2 17.7l1.9-1.4M17.9 7.7l1.9-1.4M8.4 3.4l1 2.2M14.6 18.4l1 2.2M3.4 15.6l2.2-1M18.4 9.4l2.2-1" />
  </svg>
);

export const Inbox = ({ size = 16, ...p }) => (
  <svg {...base(p, size)}>
    <path d="M3 12h4.5l1.5 3h6l1.5-3H21" />
    <path d="M5.5 5h13L21 12v6a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18v-6L5.5 5Z" />
  </svg>
);

export const Medal = ({ size = 16, ...p }) => (
  <svg {...base(p, size)}>
    <circle cx="12" cy="14.5" r="6" />
    <path d="M9.5 3 12 8.5 14.5 3" />
    <path d="m9 9.5-2 3.5M15 9.5l2 3.5" />
    <path d="M10.3 15.3 12 12l1.7 3.3-1.7 3.4-1.7-3.4Z" fill="currentColor" stroke="none" />
  </svg>
);

export const AlertTriangle = ({ size = 16, ...p }) => (
  <svg {...base(p, size)}>
    <path d="M12 3.5 22 20H2L12 3.5Z" />
    <line x1="12" y1="9.5" x2="12" y2="14" />
    <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const Zap = ({ size = 16, ...p }) => (
  <svg {...base(p, size)}>
    <polygon points="13 2 4 14 11 14 10 22 20 9 13 9 13 2" />
  </svg>
);

export const User = ({ size = 16, ...p }) => (
  <svg {...base(p, size)}>
    <circle cx="12" cy="8" r="3.7" />
    <path d="M4.5 20c1.2-4 4-6 7.5-6s6.3 2 7.5 6" />
  </svg>
);

export const Users = ({ size = 16, ...p }) => (
  <svg {...base(p, size)}>
    <circle cx="9" cy="8" r="3.3" />
    <path d="M2.8 19c1-3.5 3.3-5.3 6.2-5.3s5.2 1.8 6.2 5.3" />
    <path d="M16 5.3c1.6.4 2.8 1.8 2.8 3.5 0 1.6-1 2.9-2.5 3.4" />
    <path d="M17.5 13.9c2.2.7 3.7 2.4 4.4 5.1" />
  </svg>
);

export const Clipboard = ({ size = 16, ...p }) => (
  <svg {...base(p, size)}>
    <rect x="5" y="4.5" width="14" height="17" rx="2" />
    <rect x="9" y="2.5" width="6" height="3.5" rx="1" />
    <line x1="8.5" y1="11" x2="15.5" y2="11" />
    <line x1="8.5" y1="15" x2="15.5" y2="15" />
  </svg>
);

export const Folder = ({ size = 16, ...p }) => (
  <svg {...base(p, size)}>
    <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h4.6l2 2.3h8.4A1.5 1.5 0 0 1 21 8.8v9.7A1.5 1.5 0 0 1 19.5 20h-15A1.5 1.5 0 0 1 3 18.5V6.5Z" />
  </svg>
);

export const BookOpen = ({ size = 16, ...p }) => (
  <svg {...base(p, size)}>
    <path d="M12 6.5c-1.6-1.3-3.7-2-6.5-2-1 0-1.5.2-1.5.2v13s.6-.2 1.5-.2c2.8 0 4.9.7 6.5 2 1.6-1.3 3.7-2 6.5-2 .9 0 1.5.2 1.5.2v-13s-.5-.2-1.5-.2c-2.8 0-4.9.7-6.5 2Z" />
    <line x1="12" y1="6.5" x2="12" y2="19.5" />
  </svg>
);

export const CheckCircle = ({ size = 16, ...p }) => (
  <svg {...base(p, size)}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="8 12.5 11 15.5 16 9" />
  </svg>
);

export const XCircle = ({ size = 16, ...p }) => (
  <svg {...base(p, size)}>
    <circle cx="12" cy="12" r="9" />
    <line x1="8.5" y1="8.5" x2="15.5" y2="15.5" />
    <line x1="15.5" y1="8.5" x2="8.5" y2="15.5" />
  </svg>
);

export const Sparkles = ({ size = 16, ...p }) => (
  <svg {...base(p, size)}>
    <path d="M11 3v3.2M11 16.8V20M4 11h3.2M14.8 11H18M6.5 6.5l2.1 2.1M13.4 13.4l2.1 2.1M15.5 6.5l-2.1 2.1M8.6 13.4l-2.1 2.1" />
    <path d="M19 15.5v2.6M17.7 16.8h2.6" />
  </svg>
);

export const Check = ({ size = 16, ...p }) => (
  <svg {...base(p, size)}>
    <polyline points="4 12.5 9 17.5 20 6" />
  </svg>
);

export const Circle = ({ size = 16, filled = false, ...p }) => (
  <svg {...base(p, size)}>
    <circle cx="12" cy="12" r="8" fill={filled ? 'currentColor' : 'none'} />
  </svg>
);

const Icon = {
  GraduationCap, Target, TrendingUp, TrendingDown, ArrowUp, ArrowDown,
  ArrowRight, ArrowLeft, BarChart, Flame, Shield, Mail, Sprout, Ruler,
  Settings, Inbox, Medal, AlertTriangle, Zap, User, Users, Clipboard,
  Folder, BookOpen, CheckCircle, XCircle, Sparkles, Check, Circle,
};

export default Icon;
