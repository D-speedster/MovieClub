import React from 'react';
import './ThemeExample.css';
import ApiController from '../ApiController/ApiController';

const ThemeExample = () => {
  const sampleMovies = [
    {
      id: 1,
      title: 'فیلم نمونه ۱',
      rating: 8.5,
      genre: 'اکشن، درام',
      description: 'توضیحات کوتاه فیلم که با رنگ متن ثانویه نمایش داده می‌شود.',
      poster: '/img/cinema.jpg'
    },
    {
      id: 2,
      title: 'فیلم نمونه ۲',
      rating: 9.2,
      genre: 'علمی تخیلی',
      description: 'توضیحات کوتاه فیلم دیگر برای نمایش تم تاریک.',
      poster: '/img/cinema.jpg'
    }
  ];

  return (
    <div className="theme-example">
      <div className="container">
        {/* Header Section */}
        <header className="example-header">
          <h1 className="movie-title text-2xl">🎬 نمونه تم تاریک سایت فیلم</h1>
          <p className="text-secondary">
            این نمونه‌ای از پیاده‌سازی تم تاریک جدید است
          </p>
        </header>

        {/* Navigation Example */}
        <nav className="nav">
          <div className="container d-flex justify-between align-center">
            <div className="d-flex gap-4">
              <button className="nav-link active" type="button">خانه</button>
              <button className="nav-link" type="button">فیلم‌ها</button>
              <button className="nav-link" type="button">سریال‌ها</button>
              <button className="nav-link" type="button">دانلود</button>
            </div>
            <button className="btn-cta">ورود / ثبت نام</button>
          </div>
        </nav>

        {/* Movie Grid Example */}
        <section className="section">
          <h2 className="movie-title mb-3">فیلم‌های پیشنهادی</h2>
          <div className="movie-grid">
            {sampleMovies.map(movie => (
              <div key={movie.id} className="movie-card">
                <img 
                  src={movie.poster} 
                  alt={movie.title}
                  className="movie-poster"
                />
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <div className="movie-rating">
                    <span>⭐</span>
                    <span>{movie.rating}</span>
                  </div>
                  <div className="movie-genre">{movie.genre}</div>
                  <p className="movie-description">{movie.description}</p>
                  <button className="btn-cta w-full mt-2">مشاهده جزئیات</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Form Example */}
        <section className="section">
          <div className="form">
            <h3 className="movie-title mb-3">فرم نمونه</h3>
            <div className="form-group">
              <label className="form-label">نام کاربری</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="نام کاربری خود را وارد کنید"
              />
            </div>
            <div className="form-group">
              <label className="form-label">رمز عبور</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="رمز عبور"
              />
            </div>
            <button className="btn-cta w-full">ورود</button>
          </div>
        </section>

        {/* Color Palette Display */}
        <section className="section">
          <h3 className="movie-title mb-3">پالت رنگی تم</h3>
          <div className="color-palette">
            <div className="color-group">
              <h4 className="text-primary mb-2">پس‌زمینه</h4>
              <div className="color-item bg-main">
                <span className="text-primary">#121212 - اصلی</span>
              </div>
              <div className="color-item bg-surface">
                <span className="text-primary">#1A1A1A - سطح</span>
              </div>
              <div className="color-item bg-hover">
                <span className="text-primary">#222222 - هاور</span>
              </div>
            </div>
            
            <div className="color-group">
              <h4 className="text-primary mb-2">طلایی (اطلاعاتی)</h4>
              <div className="color-item" style={{backgroundColor: '#C9A24D'}}>
                <span className="text-primary">#C9A24D - اصلی</span>
              </div>
              <div className="color-item" style={{backgroundColor: '#D6B66A'}}>
                <span className="text-primary">#D6B66A - نرم</span>
              </div>
            </div>
            
            <div className="color-group">
              <h4 className="text-primary mb-2">CTA (مهم)</h4>
              <div className="color-item" style={{backgroundColor: '#B84A2B'}}>
                <span className="text-primary">#B84A2B - اصلی</span>
              </div>
              <div className="color-item" style={{backgroundColor: '#D05A3A'}}>
                <span className="text-primary">#D05A3A - هاور</span>
              </div>
            </div>
          </div>
        </section>

        {/* API Controller */}
        <section className="section">
          <ApiController />
        </section>

        {/* Usage Guidelines */}
        <section className="section">
          <div className="card p-4">
            <h3 className="movie-title mb-3">راهنمای استفاده از رنگ‌ها</h3>
            <div className="guidelines">
              <div className="guideline-item">
                <span className="text-gold">طلایی:</span>
                <span className="text-secondary">فقط برای عنوان فیلم، امتیاز ⭐ و ژانر</span>
              </div>
              <div className="guideline-item">
                <span className="text-primary" style={{color: '#B84A2B'}}>قرمز CTA:</span>
                <span className="text-secondary">برای دکمه‌های مهم و اقدامات اصلی</span>
              </div>
              <div className="guideline-item">
                <span className="text-primary">متن اصلی:</span>
                <span className="text-secondary">برای محتوای اصلی و عناوین</span>
              </div>
              <div className="guideline-item">
                <span className="text-secondary">متن ثانویه:</span>
                <span className="text-muted">برای توضیحات و اطلاعات کمکی</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ThemeExample;