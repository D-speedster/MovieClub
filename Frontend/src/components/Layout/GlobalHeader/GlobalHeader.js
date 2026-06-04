import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchOverlay from '../../UI/SearchOverlay/SearchOverlay';
import './GlobalHeader.css';

const NAV_LINKS = [
  { label: 'فیلم',          to: '/Movies' },
  { label: 'سریال',         to: '/Series' },
  { label: 'انیمه',         to: '/anime' },
  { label: 'تماشای آنلاین', to: '/online' },
  { label: 'اخبار',         to: '/news' },
  { label: 'تماس با ما',    to: '/contact' },
  { label: 'دسته‌بندی‌ها',  to: '/categories' },
];

const GlobalHeader = ({ transparent = false }) => {
  const navigate = useNavigate();
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

  // scroll detection
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close drawer on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Determine header classes
  const headerClass = [
    'global-header',
    transparent && !isScrolled ? 'global-header--transparent' : 'global-header--solid',
    isScrolled ? 'global-header--scrolled' : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      <header className={headerClass}>
        <div className="global-header__content">

          {/* Logo */}
          <Link to="/" className="global-header__logo" onClick={closeMenu}>
            <span className="global-header__logo-text">MOVIE</span>
            <span className="global-header__logo-accent">CLUB</span>
          </Link>

          {/* Desktop nav */}
          <nav className="global-header__nav" aria-label="ناوبری اصلی">
            {NAV_LINKS.map(l => (
              <Link key={l.to} to={l.to} className="global-header__nav-link">{l.label}</Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="global-header__actions">
            {isLoggedIn ? (
              <>
                {(userRole === 'Admin' || userRole === 'Owner') && (
                  <Link to="/admin" className="global-header__login-btn">پنل ادمین</Link>
                )}
                <button className="global-header__subscribe-btn" onClick={handleLogout}>خروج</button>
              </>
            ) : (
              <>
                <button className="global-header__subscribe-btn">خرید اشتراک</button>
                <Link to="/auth/login" className="global-header__login-btn">ورود</Link>
              </>
            )}
            <button
              className="global-header__icon-btn"
              aria-label="جستجو"
              onClick={() => setSearchOpen(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </button>
          </div>

          {/* Mobile: search + hamburger */}
          <div className="global-header__mobile-actions">
            <button
              className="global-header__icon-btn"
              aria-label="جستجو"
              onClick={() => setSearchOpen(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </button>
            <button
              className={`global-header__hamburger${menuOpen ? ' is-open' : ''}`}
              aria-label={menuOpen ? 'بستن منو' : 'باز کردن منو'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(p => !p)}
            >
              <span /><span /><span />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile drawer backdrop */}
      {menuOpen && (
        <div
          className="global-drawer__backdrop"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <nav
        className={`global-drawer${menuOpen ? ' global-drawer--open' : ''}`}
        aria-label="منوی موبایل"
      >
        <div className="global-drawer__header">
          <Link to="/" className="global-drawer__logo" onClick={closeMenu}>
            <span>MOVIE</span><span className="global-drawer__logo-accent">CLUB</span>
          </Link>
          <button
            className="global-drawer__close"
            aria-label="بستن منو"
            onClick={closeMenu}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <ul className="global-drawer__list">
          {NAV_LINKS.map(l => (
            <li key={l.to}>
              <Link to={l.to} className="global-drawer__link" onClick={closeMenu}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="global-drawer__footer">
          {isLoggedIn ? (
            <>
              {(userRole === 'Admin' || userRole === 'Owner') && (
                <Link to="/admin" className="global-drawer__login-btn" onClick={closeMenu}>
                  پنل ادمین
                </Link>
              )}
              <button className="global-drawer__subscribe-btn" onClick={handleLogout}>
                خروج از حساب
              </button>
            </>
          ) : (
            <>
              <Link to="/auth/login" className="global-drawer__login-btn" onClick={closeMenu}>
                ورود به حساب
              </Link>
              <button className="global-drawer__subscribe-btn">خرید اشتراک</button>
            </>
          )}
        </div>
      </nav>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default GlobalHeader;
