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
      <section className={`movie-slider ${className}`}>
        <div className="container-fluid">
          <div className="movie-slider__header">
            <div className="movie-slider__title-skeleton"></div>
            {showViewAll && <div className="movie-slider__view-all-skeleton"></div>}
          </div>
          <div className="movie-slider__content">
            <div className="movie-slider__grid">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="movie-card movie-card--loading">
                  <div className="movie-card__poster-container"></div>
                  <div className="movie-card__content">
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line skeleton-line--short"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className={`movie-slider ${className}`}>
      <div className="container-fluid">
        <div className="movie-slider__header">
          <h2 className="movie-slider__title">{title}</h2>
          {showViewAll && (
            <button
              className="movie-slider__view-all"
              onClick={onViewAll}
              type="button"
            >
              مشاهده همه
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              </svg>
            </button>
          )}
        </div>

        <div className="movie-slider__content">
          <button
            className="movie-slider__nav movie-slider__nav--prev"
            onClick={handlePrevClick}
            type="button"
            aria-label="فیلم قبلی"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>

          <Swiper
            ref={swiperRef}
            modules={[Navigation, FreeMode]}
            spaceBetween={20}
            slidesPerView="auto"
            freeMode={true}
            grabCursor={true}
            className="movie-slider__swiper"
            breakpoints={{
              320: {
                slidesPerView: 1.5,
                spaceBetween: 20,
              },
              480: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 2.5,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
              1280: {
                slidesPerView: 5,
                spaceBetween: 20,
              },
            }}
          >
            {Array.isArray(movies) && movies.map((movie, index) => (
              <SwiperSlide
                key={movie.id || `movie-${index}`}
                className="movie-slider__slide"
              >
                <MovieCard
                  id={movie._id || movie.id}
                  poster={movie.poster}
                  name={movie.title || movie.name}
                  year={movie.year}
                  rate={movie.rate}
                  genre={movie.genres || movie.genre}
                  description={movie.description || movie.TranslateText}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            className="movie-slider__nav movie-slider__nav--next"
            onClick={handleNextClick}
            type="button"
            aria-label="فیلم بعدی"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default MovieSlider;