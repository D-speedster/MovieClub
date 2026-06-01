import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchOverlay from '../SearchOverlay/SearchOverlay';
import './HeroSection.css';

const NAV_LINKS = [
  { label: 'فیلم',          to: '/Movies' },
  { label: 'سریال',         to: '/Series' },
  { label: 'انیمه',         to: '/anime' },
  { label: 'تماشای آنلاین', to: '/online' },
  { label: 'اخبار',         to: '/news' },
  { label: 'تماس با ما',    to: '/contact' },
  { label: 'دسته‌بندی‌ها',  to: '/categories' },
];

const BG_IMAGES = [
  '/img/hero/star-wars-the-phantom-menace-hd-wallpaper-uhdpaper.com-29@5@l.jpg',
  '/img/hero/tron-ares-jared-leto-hd-wallpaper-uhdpaper.com-418@5@i.jpg',
  '/img/hero/varang-avatar-fire-and-ash-hd-wallpaper-uhdpaper.com-552@5@k.jpg',
  '/img/hero/zootopia-2-nick-wilde-judy-hopps-de-snake-hd-wallpaper-uhdpaper.com-531@5@k.jpg',
];

const HeroSection = ({ trailers = [], loading = false }) => {
  const navigate = useNavigate();
  const [bgIndex,     setBgIndex]     = useState(0);
  const [isScrolled,  setIsScrolled]  = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);

  const isLoggedIn = !!localStorage.getItem('token');
  const userRole   = localStorage.getItem('role');

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3001/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (_) {}
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/auth/login');
  };

  // rotate background
  useEffect(() => {
    const id = setInterval(() => setBgIndex(p => (p + 1) % BG_IMAGES.length), 10000);
    return () => clearInterval(id);
  }, []);

  // sticky header
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  if (loading) {
    return (
      <section className="hero-section hero-section--loading">
        <div className="hero-section__loading-skeleton" />
      </section>
    );
  }

  return (
    <>
      <section className="hero-section">
        {/* Background */}
        <div
          className="hero-section__background"
          style={{ backgroundImage: `url(${BG_IMAGES[bgIndex]})` }}
        >
          <div className="hero-section__overlay" />
        </div>

        {/* ── Header ── */}
        <header className={`hero-header${isScrolled ? ' hero-header--scrolled' : ''}`}>
          <div className="hero-header__content">

            {/* Logo */}
            <Link to="/" className="hero-header__logo" onClick={closeMenu}>
              <span className="hero-header__logo-text">MOVIE</span>
              <span className="hero-header__logo-accent">CLUB</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hero-header__nav" aria-label="ناوبری اصلی">
              {NAV_LINKS.map(l => (
                <Link key={l.to} to={l.to} className="hero-header__nav-link">{l.label}</Link>
              ))}
            </nav>

            {/* Desktop actions */}
            <div className="hero-header__actions">
              {isLoggedIn ? (
                <>
                  {(userRole === 'Admin' || userRole === 'Owner') && (
                    <Link to="/admin" className="hero-header__login-btn">پنل ادمین</Link>
                  )}
                  <button className="hero-header__subscribe-btn" onClick={handleLogout}>خروج</button>
                </>
              ) : (
                <>
                  <button className="hero-header__subscribe-btn">خرید اشتراک</button>
                  <Link to="/auth/login" className="hero-header__login-btn">ورود</Link>
                </>
              )}
              <button
                className="hero-header__icon-btn"
                aria-label="جستجو"
                onClick={() => setSearchOpen(true)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              </button>
            </div>

            {/* Mobile: search + hamburger */}
            <div className="hero-header__mobile-actions">
              <button
                className="hero-header__icon-btn"
                aria-label="جستجو"
                onClick={() => setSearchOpen(true)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              </button>
              <button
                className={`hero-header__hamburger${menuOpen ? ' is-open' : ''}`}
                aria-label={menuOpen ? 'بستن منو' : 'باز کردن منو'}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(p => !p)}
              >
                <span /><span /><span />
              </button>
            </div>

          </div>
        </header>

        {/* ── Mobile drawer overlay ── */}
        {menuOpen && (
          <div
            className="hero-drawer__backdrop"
            onClick={closeMenu}
            aria-hidden="true"
          />
        )}

        {/* ── Mobile drawer (slides from right) ── */}
        <nav
          className={`hero-drawer${menuOpen ? ' hero-drawer--open' : ''}`}
          aria-label="منوی موبایل"
        >
          <div className="hero-drawer__header">
            <Link to="/" className="hero-drawer__logo" onClick={closeMenu}>
              <span>MOVIE</span><span className="hero-drawer__logo-accent">CLUB</span>
            </Link>
            <button
              className="hero-drawer__close"
              aria-label="بستن منو"
              onClick={closeMenu}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>

          <ul className="hero-drawer__list">
            {NAV_LINKS.map(l => (
              <li key={l.to}>
                <Link to={l.to} className="hero-drawer__link" onClick={closeMenu}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hero-drawer__footer">
            {isLoggedIn ? (
              <>
                {(userRole === 'Admin' || userRole === 'Owner') && (
                  <Link to="/admin" className="hero-drawer__login-btn" onClick={closeMenu}>
                    پنل ادمین
                  </Link>
                )}
                <button className="hero-drawer__subscribe-btn" onClick={handleLogout}>
                  خروج از حساب
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="hero-drawer__login-btn" onClick={closeMenu}>
                  ورود به حساب
                </Link>
                <button className="hero-drawer__subscribe-btn">خرید اشتراک</button>
              </>
            )}
          </div>
        </nav>

        {/* ── Hero content ── */}
        <div className="hero-section__content">
          <div className="container">
            <div className="hero-section__main">
              <h1 className="hero-section__slogan">۴۰۰ هزار فیلم و قسمت سریال</h1>

              <div className="hero-section__features">
                <div className="hero-feature">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <span>پشتیبانی ۲۴ ساعته</span>
                </div>
                <div className="hero-feature">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <span>بدون سانسور</span>
                </div>
                <div className="hero-feature">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg>
                  <span>اپلیکیشن اختصاصی</span>
                </div>
              </div>

              <div className="hero-section__cta">
                <button className="hero-section__cta-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  اشتراک و تماشا
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default HeroSection;
