import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper';
import MovieCard from '../MovieCard/MovieCard';
import './MovieSlider.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

const MovieSlider = ({
  title,
  movies = [],
  showViewAll = true,
  onViewAll,
  loading = false,
  className = ''
}) => {
  const swiperRef = useRef(null);

  const handlePrevClick = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNextClick = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  if (loading) {
    return (
      <section className={`ms-section ${className}`}>
        <div className="ms-wrap">
          <div className="ms-header">
            <div className="ms-title-skeleton"></div>
            {showViewAll && <div className="ms-viewall-skeleton"></div>}
          </div>
          <div className="ms-grid-skeleton">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="ms-card-skeleton" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className={`ms-section ${className}`}>
      <div className="ms-wrap">
        {/* Header */}
        <div className="ms-header">
          <h2 className="ms-title">{title}</h2>
          {showViewAll && (
            <button
              className="ms-viewall"
              onClick={onViewAll}
              type="button"
            >
              مشاهده همه
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              </svg>
            </button>
          )}
        </div>

        {/* Slider */}
        <div className="ms-slider-wrap">
          <button
            className="ms-nav ms-nav--prev"
            onClick={handlePrevClick}
            type="button"
            aria-label="قبلی"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>

          <Swiper
            ref={swiperRef}
            modules={[Navigation, FreeMode]}
            freeMode={true}
            grabCursor={true}
            watchSlidesProgress={true}
            className="ms-swiper"
            breakpoints={{
              320:  { slidesPerView: 2,   spaceBetween: 12 },
              480:  { slidesPerView: 2.5, spaceBetween: 14 },
              640:  { slidesPerView: 3,   spaceBetween: 16 },
              768:  { slidesPerView: 3.5, spaceBetween: 18 },
              1024: { slidesPerView: 4,   spaceBetween: 20 },
              1280: { slidesPerView: 5,   spaceBetween: 20 },
              1536: { slidesPerView: 6,   spaceBetween: 20 },
            }}
          >
            {Array.isArray(movies) && movies.map((movie, index) => (
              <SwiperSlide key={movie._id || movie.id || `movie-${index}`} className="ms-slide">
                <MovieCard
                  id={movie._id || movie.id}
                  slug={movie.slug}
                  poster={movie.poster}
                  name={movie.title || movie.name}
                  year={movie.year}
                  rate={movie.imdb?.rating || movie.rate}
                  genre={movie.genres || movie.genre}
                  description={movie.description || movie.TranslateText}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            className="ms-nav ms-nav--next"
            onClick={handleNextClick}
            type="button"
            aria-label="بعدی"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default MovieSlider;