import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'درباره ما', path: '/about' },
      { label: 'تماس با ما', path: '/contact' },
      { label: 'قوانین و مقررات', path: '/terms' },
      { label: 'حریم خصوصی', path: '/privacy' }
    ],
    content: [
      { label: 'فیلم‌ها', path: '/movies' },
      { label: 'سریال‌ها', path: '/series' },
      { label: 'انیمه', path: '/anime' },
      { label: 'مستندات', path: '/documentaries' }
    ],
    support: [
      { label: 'راهنما', path: '/help' },
      { label: 'پشتیبانی', path: '/support' },
      { label: 'گزارش مشکل', path: '/report' },
      { label: 'درخواست فیلم', path: '/request' }
    ]
  };

  const socialLinks = [
    {
      name: 'تلگرام',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
      url: 'https://t.me/movieclub'
    },
    {
      name: 'اینستاگرام',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      url: 'https://instagram.com/movieclub'
    },
    {
      name: 'توییتر',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      url: 'https://twitter.com/movieclub'
    }
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          {/* Logo and Description */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <img 
                src="/img/movie-club-banner-2x.png" 
                alt="Movie Club" 
                className="footer__logo-image"
              />
            </Link>
            <p className="footer__description">
              بهترین مرجع دانلود فیلم و سریال با کیفیت عالی و لینک مستقیم. 
              جدیدترین فیلم‌ها و سریال‌های روز دنیا را از ما دنبال کنید.
            </p>
            <div className="footer__social">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="footer__social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="footer__links">
            <div className="footer__links-section">
              <h3 className="footer__links-title">شرکت</h3>
              <ul className="footer__links-list">
                {footerLinks.company.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer__link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__links-section">
              <h3 className="footer__links-title">محتوا</h3>
              <ul className="footer__links-list">
                {footerLinks.content.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer__link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__links-section">
              <h3 className="footer__links-title">پشتیبانی</h3>
              <ul className="footer__links-list">
                {footerLinks.support.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer__link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="footer__newsletter">
            <h3 className="footer__newsletter-title">خبرنامه</h3>
            <p className="footer__newsletter-description">
              از جدیدترین فیلم‌ها و سریال‌ها با خبر شوید
            </p>
            <form className="footer__newsletter-form">
              <input
                type="email"
                placeholder="ایمیل شما"
                className="footer__newsletter-input"
                aria-label="ایمیل برای خبرنامه"
              />
              <button type="submit" className="footer__newsletter-button">
                عضویت
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <div className="footer__bottom-content">
            <p className="footer__copyright">
              © {currentYear} مووی کلاب. تمامی حقوق محفوظ است.
            </p>
            <div className="footer__status">
              <div className="footer__status-indicator"></div>
              <span className="footer__status-text">همه سیستم‌ها فعال</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;