import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = ({ 
  trailers = [], 
  loading = false 
}) => {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Background images that rotate every 10 seconds
  const backgroundImages = [
    '/img/hero/star-wars-the-phantom-menace-hd-wallpaper-uhdpaper.com-29@5@l.jpg',
    '/img/hero/tron-ares-jared-leto-hd-wallpaper-uhdpaper.com-418@5@i.jpg',
    '/img/hero/varang-avatar-fire-and-ash-hd-wallpaper-uhdpaper.com-552@5@k.jpg',
    '/img/hero/zootopia-2-nick-wilde-judy-hopps-de-snake-hd-wallpaper-uhdpaper.com-531@5@k.jpg'
  ];

  // Auto-rotate background every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex(prev => (prev + 1) % backgroundImages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <section className="hero-section hero-section--loading">
        <div className="hero-section__loading-skeleton"></div>
      </section>
    );
  }

  return (
    <section className="hero-section">
      {/* Full-screen background */}
      <div 
        className="hero-section__background"
        style={{ backgroundImage: `url(${backgroundImages[currentBgIndex]})` }}
      >
        <div className="hero-section__overlay"></div>
      </div>

      {/* Header with soft shadow */}
      <header className={`hero-header ${isScrolled ? 'hero-header--scrolled' : ''}`}>
        <div className="hero-header__content">
          {/* Logo */}
          <div className="hero-header__logo">
            <span className="hero-header__logo-text">MOVIE CLUB</span>
          </div>

          {/* Navigation */}
          <nav className="hero-header__nav">
            <Link to="/movies" className="hero-header__nav-link">فیلم</Link>
            <Link to="/series" className="hero-header__nav-link">سریال</Link>
            <Link to="/anime" className="hero-header__nav-link">انیمه</Link>
            <Link to="/online" className="hero-header__nav-link">تماشای آنلاین</Link>
            <Link to="/news" className="hero-header__nav-link">اخبار</Link>
            <Link to="/contact" className="hero-header__nav-link">تماس با ما</Link>
            <Link to="/categories" className="hero-header__nav-link">دسته‌بندی‌ها</Link>
            <Link to="/faq" className="hero-header__nav-link">سوال</Link>
          </nav>

          {/* Action buttons */}
          <div className="hero-header__actions">
            <button className="hero-header__subscribe-btn">خرید اشتراک</button>
            <Link to="/auth/login" className="hero-header__login-btn">ورود</Link>
            <button className="hero-header__search-btn" aria-label="جستجو">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </button>
            <button className="hero-header__theme-btn" aria-label="تغییر تم">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="hero-section__content">
        <div className="container">
          <div className="hero-section__main">
            {/* Slogan */}
            <h1 className="hero-section__slogan">
            ۴۰۰ هزار فیلم و قسمت سریال

            </h1>

            {/* Feature buttons */}
            <div className="hero-section__features">
              <div className="hero-feature">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>پشتیبانی ۲۴ ساعته</span>
              </div>
              <div className="hero-feature">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>بدون سانسور و حذفیات</span>
              </div>
              <div className="hero-feature">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>اپلیکیشن اختصاصی</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="hero-section__cta">
              <button className="hero-section__cta-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                اشتراک و تماشا
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;