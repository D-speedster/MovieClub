import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../Layout/PageHeader/PageHeader';
import Footer from '../Layout/Footer/Footer';
import MobileNav from '../Layout/MobileNav/MobileNav';
import ApiRequest from '../../Services/Axios/config';
import Logger from '../../utils/logger';
import './MoviePage.css';

const MoviePage = () => {
  const { userId } = useParams();
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMovieData();
  }, [userId]);

  const fetchMovieData = async () => {
    try {
      setLoading(true);
      const response = await ApiRequest.get('/content/movieList');
      const movies = Object.entries(response).map(entry => entry[1]);
      const movie = movies[0]?.find(movie => movie.id === userId);
      
      if (movie) {
        setMovieData(movie);
      } else {
        setError('فیلم مورد نظر یافت نشد');
      }
    } catch (err) {
      Logger.error('Error fetching movie data:', err);
      setError('خطا در بارگذاری اطلاعات فیلم');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="movie-page">
        <PageHeader />
        <div className="movie-page__loading">
          <div className="loading-spinner"></div>
          <p>در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error || !movieData) {
    return (
      <div className="movie-page">
        <PageHeader />
        <div className="movie-page__error">
          <h2>خطا</h2>
          <p>{error || 'فیلم مورد نظر یافت نشد'}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="movie-page">
      <PageHeader />
      
      {/* Hero Section */}
      <section className="movie-hero">
        <div className="movie-hero__background">
          {movieData.BackgroundImage && (
            <img 
              src={movieData.BackgroundImage} 
              alt={`پس‌زمینه ${movieData.name}`}
              className="movie-hero__bg-image"
            />
          )}
          <div className="movie-hero__overlay"></div>
        </div>
        
        <div className="container">
          <div className="movie-hero__content">
            <div className="movie-hero__poster">
              <img 
                src={movieData.poster} 
                alt={`پوستر ${movieData.name}`}
                className="movie-hero__poster-image"
              />
            </div>
            
            <div className="movie-hero__info">
              <h1 className="movie-hero__title">{movieData.name || 'نام فیلم نامشخص'}</h1>
              
              <div className="movie-hero__meta">
                <span className="movie-hero__rating">
                  ⭐ {movieData.rate || 'N/A'}
                </span>
                <span className="movie-hero__year">{movieData.year || 'نامشخص'}</span>
                <span className="movie-hero__duration">{movieData.time || 'نامشخص'}</span>
              </div>
              
              <div className="movie-hero__genres">
                {movieData.genre && typeof movieData.genre === 'string' ? 
                  movieData.genre.split(',').map((genre, index) => (
                    <span key={index} className="movie-hero__genre">
                      {genre.trim()}
                    </span>
                  )) : 
                  movieData.genre && Array.isArray(movieData.genre) ?
                    movieData.genre.map((genre, index) => (
                      <span key={index} className="movie-hero__genre">
                        {genre}
                      </span>
                    )) :
                    <span className="movie-hero__genre">نامشخص</span>
                }
              </div>
              
              <div className="movie-hero__actions">
                <button className="btn btn-primary movie-hero__download-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                  </svg>
                  دانلود فیلم
                </button>
                <button className="btn btn-secondary movie-hero__trailer-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  تریلر
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Movie Details */}
      <section className="movie-details">
        <div className="container">
          <div className="movie-details__grid">
            {/* Left Column - Movie Info */}
            <div className="movie-details__info">
              <div className="movie-details__section">
                <h2 className="movie-details__section-title">اطلاعات فیلم</h2>
                <div className="movie-details__info-grid">
                  <div className="movie-details__info-item">
                    <span className="movie-details__info-label">کارگردان:</span>
                    <span className="movie-details__info-value">{movieData.director || 'نامشخص'}</span>
                  </div>
                  <div className="movie-details__info-item">
                    <span className="movie-details__info-label">بازیگران:</span>
                    <span className="movie-details__info-value">{movieData.stars || 'نامشخص'}</span>
                  </div>
                  <div className="movie-details__info-item">
                    <span className="movie-details__info-label">کشور سازنده:</span>
                    <span className="movie-details__info-value">{movieData.countries || 'نامشخص'}</span>
                  </div>
                  <div className="movie-details__info-item">
                    <span className="movie-details__info-label">زبان:</span>
                    <span className="movie-details__info-value">اصلی + دوبله فارسی</span>
                  </div>
                  <div className="movie-details__info-item">
                    <span className="movie-details__info-label">کیفیت:</span>
                    <span className="movie-details__info-value">1080p BluRay</span>
                  </div>
                  <div className="movie-details__info-item">
                    <span className="movie-details__info-label">زیرنویس:</span>
                    <span className="movie-details__info-value">فارسی چسبیده</span>
                  </div>
                </div>
              </div>

              {/* Story Section */}
              <div className="movie-details__section">
                <h2 className="movie-details__section-title">خلاصه داستان</h2>
                <p className="movie-details__story">
                  {movieData.story || movieData.TranslateText || 'خلاصه داستان موجود نیست.'}
                </p>
              </div>
            </div>

            {/* Right Column - Gallery */}
            <div className="movie-details__gallery">
              <h2 className="movie-details__section-title">تصاویر فیلم</h2>
              <div className="movie-gallery">
                {movieData.Image_Moviez && typeof movieData.Image_Moviez === 'object' ? 
                  Object.values(movieData.Image_Moviez).map((image, index) => (
                    <div key={index} className="movie-gallery__item">
                      <img 
                        src={image} 
                        alt={`تصویر ${index + 1} از ${movieData.name || 'فیلم'}`}
                        className="movie-gallery__image"
                      />
                    </div>
                  )) :
                  <div className="movie-gallery__item">
                    <div className="movie-gallery__placeholder">
                      تصویری موجود نیست
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="movie-download">
        <div className="container">
          <div className="movie-download__content">
            <h2 className="movie-download__title">دانلود فیلم {movieData.name || 'نامشخص'}</h2>
            <div className="movie-download__options">
              <div className="download-option">
                <div className="download-option__info">
                  <h3 className="download-option__title">کیفیت 1080p</h3>
                  <p className="download-option__details">BluRay • 2.5 GB • دوبله فارسی</p>
                </div>
                <button className="btn btn-primary download-option__btn">
                  دانلود مستقیم
                </button>
              </div>
              <div className="download-option">
                <div className="download-option__info">
                  <h3 className="download-option__title">کیفیت 720p</h3>
                  <p className="download-option__details">BluRay • 1.2 GB • دوبله فارسی</p>
                </div>
                <button className="btn btn-secondary download-option__btn">
                  دانلود مستقیم
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default MoviePage;