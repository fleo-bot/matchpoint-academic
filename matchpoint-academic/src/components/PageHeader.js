import React from 'react';
import './PageHeader.css';

export default function PageHeader({ title, subtitle, badge, actions, icon }) {
  return (
    <div className="page-header">
      <div className="page-header__left">
        {icon && <div className="page-header__icon">{icon}</div>}
        <div>
          {badge && <div className="page-header__badge">{badge}</div>}
          <h1 className="page-header__title">{title}</h1>
          {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </div>
  );
}
