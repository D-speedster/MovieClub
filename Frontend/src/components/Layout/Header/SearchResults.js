import React from 'react';
import { Link } from 'react-router-dom';

const SearchResults = ({ results, isLoading, query, onClose }) => {
  if (isLoading) {
    return (
      <div className="search-results">
        <div className="search-results__loading">
          <div className="search-results__spinner"></div>
          <span>در حال جستجو...</span>
        </div>
      </div>
    );
  }

  if (results.length === 0 && query.length >= 2) {
    return (
      <div className="search-results">
        <div className="search-results__empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <p>نتیجه‌ای برای "{query}" یافت نشد</p>
          <span>کلمات کلیدی دیگری امتحان کنید</span>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="search-results__header">
        <span className="search-results__count">
          {results.length} نتیجه برای "{query}"
        </span>
        <button 
          className="search-results__close"
          onClick={onClose}
          aria-label="بستن نتایج جستجو"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>

      <div className="search-results__list">
        {results.slice(0, 8).map((movie) => (
          <Link
            key={movie.id}
            to={`/Movie/${movie.id}`}
            className="search-result-item"
            onClick={onClose}
          >
            <div className="search-result-item__poster">
              <img 
                src={movie.poster} 
                alt={movie.name}
                loading="lazy"
              />
            </div>
            <div className="search-result-item__info">
              <h4 className="search-result-item__title">{movie.name}</h4>
              <div className="search-result-item__meta">
                {movie.year && (
                  <span className="search-result-item__year">{movie.year}</span>
                )}
                {movie.rate && (
                  <span className="search-result-item__rating">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    {movie.rate}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {results.length > 8 && (
        <div className="search-results__footer">
          <Link 
            to={`/search?q=${encodeURIComponent(query)}`}
            className="search-results__view-all"
            onClick={onClose}
          >
            مشاهده همه نتایج ({results.length})
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SearchResults;