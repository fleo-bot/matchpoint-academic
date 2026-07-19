import React from 'react';
import Icon from './Icons';
import './StatCard.css';

export default function StatCard({ icon, label, value, sub, color = 'default', trend }) {
  const TrendIcon = trend?.dir === 'up' ? Icon.ArrowUp : trend?.dir === 'down' ? Icon.ArrowDown : Icon.ArrowRight;
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card__header">
        <div className="stat-card__icon">{icon}</div>
        {trend && (
          <div className={`stat-card__trend stat-card__trend--${trend.dir}`}>
            <TrendIcon size={12} /> {trend.label}
          </div>
        )}
      </div>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
      {sub && <div className="stat-card__sub">{sub}</div>}
    </div>
  );
}
