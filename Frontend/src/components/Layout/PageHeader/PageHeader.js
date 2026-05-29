import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PageHeader.css';

const PageHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`page-header ${isScrolled ? 'page-header--scrolled' : ''}`}>
      <div className="page-header__content">
        {/* Logo */}
        <div className="page-header__logo">
          <span className="page-header__logo-text">MOVIE CLUB</span>
        </div>

        {/* Navigation */}
        <nav className="page-header__nav">
          <Link to="/movies" className="page-header__nav-link">فیلم</Link>
          <Link to="/series" className="page-header__nav-link">سریال</Link>
          <Link to="/anime" className="page-header__nav-link">انیمه</Link>
          <Link to="/online" className="page-header__nav-link">تماشای آنلاین</Link>
          <Link to="/news" className="page-header__nav-link">اخبار</Link>
          <Link to="/contact" className="page-header__nav-link">تماس با ما</Link>
          <Link to="/categories" className="page-header__nav-link">دسته‌بندی‌ها</Link>
          <Link to="/faq" className="page-header__nav-link">سوال</Link>
        </nav>

        {/* Action buttons */}
        <div className="page-header__actions">
          <button className="page-header__subscribe-btn">خرید اشتراک</button>
          <Link to="/auth/login" className="page-header__login-btn">ورود</Link>
          <button className="page-header__search-btn" aria-label="جستجو">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
          <button className="page-header__theme-btn" aria-label="تغییر تم">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;