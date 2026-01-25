import React from 'react';
import MovieCard from '../MovieCard/MovieCard';
import './FeaturedSection.css';

const FeaturedSection = ({ movies = [], loading = false }) => {
  if (loading) {
    return (
      <section className="featured-section featured-section--loading">
        <div className="container">
          <div className="featured-section__header">
            <div className="featured-section__title-skeleton"></div>
            <div className="featured-section__subtitle-skeleton"></div>
          </div>
          <div className="featured-section__grid">
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
      </section>
    );
  }

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className="featured-section">
      <div className="container">
        <div className="featured-section__header">
          <h2 className="featured-section__title">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            برترین فیلم‌ها
          </h2>
          <p className="featured-section__subtitle">
            بهترین فیلم‌های امسال با بالاترین امتیازات
          </p>
        </div>

        <div className="featured-section__grid">
          {movies.slice(0, 6).map((movie, index) => (
            <div key={movie.id || index} className="featured-section__item">
              <div className="featured-section__rank">
                {index + 1}
              </div>
              <MovieCard
                id={movie.id}
                poster={movie.poster}
                name={movie.name}
                year={movie.year}
                rate={movie.rate}
                genre={movie.genre}
                description={movie.TranslateText}
                size="default"
                showDescription={false}
                className="featured-section__card"
              />
            </div>
          ))}
        </div>

        <div className="featured-section__footer">
          <button className="btn btn-secondary featured-section__view-all">
            مشاهده همه فیلم‌های برتر
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;