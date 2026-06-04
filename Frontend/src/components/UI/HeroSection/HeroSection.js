import React, { useState, useEffect } from 'react';
import './HeroSection.css';

const BG_IMAGES = [
  '/img/hero/star-wars-the-phantom-menace-hd-wallpaper-uhdpaper.com-29@5@l.jpg',
  '/img/hero/tron-ares-jared-leto-hd-wallpaper-uhdpaper.com-418@5@i.jpg',
  '/img/hero/varang-avatar-fire-and-ash-hd-wallpaper-uhdpaper.com-552@5@k.jpg',
  '/img/hero/zootopia-2-nick-wilde-judy-hopps-de-snake-hd-wallpaper-uhdpaper.com-531@5@k.jpg',
];

const HeroSection = ({ trailers = [], loading = false }) => {
  const [bgIndex, setBgIndex] = useState(0);

  // rotate background
  useEffect(() => {
    const id = setInterval(() => setBgIndex(p => (p + 1) % BG_IMAGES.length), 10000);
    return () => clearInterval(id);
  }, []);

  if (loading) {
    return (
      <section className="hero-section hero-section--loading">
        <div className="hero-section__loading-skeleton" />
      </section>
    );
  }

  return (
    <section className="hero-section">
      {/* Background */}
      <div
        className="hero-section__background"
        style={{ backgroundImage: `url(${BG_IMAGES[bgIndex]})` }}
      >
        <div className="hero-section__overlay" />
      </div>

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
  );
};

export default HeroSection;
