import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './MobileNav.css';

const MobileNav = () => {
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      label: 'خانه',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      )
    },
    {
      path: '/Movies',
      label: 'فیلم‌ها',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
        </svg>
      )
    },
    {
      path: '/Series',
      label: 'سریال‌ها',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5l-1 1v1h8v-1l-1-1h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12H3V5h18v10z"/>
        </svg>
      )
    },
    {
      path: '/login',
      label: 'ورود',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      )
    }
  ];

  return (
    <nav className="mobile-nav">
      <div className="mobile-nav__container">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-nav__item ${isActive ? 'mobile-nav__item--active' : ''}`}
              aria-label={item.label}
            >
              <div className="mobile-nav__icon">
                {item.icon}
              </div>
              <span className="mobile-nav__label">{item.label}</span>
              {isActive && <div className="mobile-nav__indicator"></div>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;