import React from 'react';
import './ComingSoonSection.css';

const ComingSoonSection = ({ loading = false }) => {
  const comingSoonMovies = [
    {
      id: 1,
      title: 'فیلم اکشن جدید',
      poster: '/img/C_391.webp',
      releaseDate: 'بهار 1403'
    },
    {
      id: 2,
      title: 'فلش',
      poster: '/img/flash.jpg',
      releaseDate: 'تابستان 1403'
    },
    {
      id: 3,
      title: 'آمستردام',
      poster: '/img/amsterdam-poster.jpg',
      releaseDate: 'پاییز 1403'
    }
  ];

  const newSeries = [
    {
      id: 1,
      title: 'سریال وایکینگ‌ها',
      poster: '/img/777.jpg',
      episode: 'قسمت 6 فصل 6 اضافه شد',
      isNew: true
    },
    {
      id: 2,
      title: 'Breaking Bad',
      poster: '/img/888.webp',
      episode: 'قسمت 8 فصل 5 اضافه شد',
      isNew: true
    },
    {
      id: 3,
      title: 'Game of Thrones',
      poster: '/img/999.jpg',
      episode: 'قسمت 10 فصل 8 اضافه شد',
      isNew: false
    },
    {
      id: 4,
      title: 'The Crown',
      poster: '/img/666.jpg',
      episode: 'قسمت 4 فصل 6 اضافه شد',
      isNew: true
    }
  ];

  if (loading) {
    return (
      <section className="coming-soon-section coming-soon-section--loading">
        <div className="container">
          <div className="coming-soon-section__content">
            <div className="coming-soon-section__movies">
              <div className="coming-soon-section__title-skeleton"></div>
              <div className="coming-soon-movies">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="coming-soon-movie coming-soon-movie--loading">
                    <div className="coming-soon-movie__poster-skeleton"></div>
                    <div className="coming-soon-movie__badge-skeleton"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="coming-soon-section__series">
              <div className="coming-soon-section__title-skeleton"></div>
              <div className="new-series-list">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="new-series-item new-series-item--loading">
                    <div className="new-series-item__poster-skeleton"></div>
                    <div className="new-series-item__content-skeleton">
                      <div className="skeleton-line"></div>
                      <div className="skeleton-line skeleton-line--short"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="coming-soon-section">
      <div className="container">
        <div className="coming-soon-section__content">
          {/* Coming Soon Movies */}
          <div className="coming-soon-section__movies">
            <h2 className="coming-soon-section__title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              به زودی
            </h2>
            
            <div className="coming-soon-movies">
              {comingSoonMovies.map((movie) => (
                <div key={movie.id} className="coming-soon-movie">
                  <div className="coming-soon-movie__poster">
                    <img 
                      src={movie.poster} 
                      alt={movie.title}
                      loading="lazy"
                    />
                    <div className="coming-soon-movie__overlay">
                      <div className="coming-soon-movie__info">
                        <h3 className="coming-soon-movie__title">{movie.title}</h3>
                        <span className="coming-soon-movie__date">{movie.releaseDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="coming-soon-movie__badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    بزودی
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Series Episodes */}
          <div className="coming-soon-section__series">
            <h2 className="coming-soon-section__title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5l-1 1v1h8v-1l-1-1h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12H3V5h18v10z"/>
              </svg>
              قسمت‌های جدید
            </h2>
            
            <div className="new-series-list">
              {newSeries.map((series) => (
                <div key={series.id} className="new-series-item">
                  <div className="new-series-item__poster">
                    <img 
                      src={series.poster} 
                      alt={series.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="new-series-item__content">
                    <h4 className="new-series-item__title">{series.title}</h4>
                    <p className="new-series-item__episode">{series.episode}</p>
                    {series.isNew && (
                      <span className="new-series-item__badge">جدید</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComingSoonSection;