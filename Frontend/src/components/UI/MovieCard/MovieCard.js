import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({
  id,
  poster,
  name,
  year,
  rate,
  genre,
  description,
  className = ''
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const formatRating = (rating) => {
    if (!rating) return '0.0';
    const numRating = parseFloat(rating);
    return isNaN(numRating) ? '0.0' : numRating.toFixed(1);
  };

  return (
    <div className={`netflix-movie-card ${className}`}>
      <Link to={`/movie/${id}`} className="netflix-movie-card__link">
        {/* Movie Poster */}
        <div className="netflix-movie-card__poster-container">
          {!imageLoaded && !imageError && (
            <div className="netflix-movie-card__poster-skeleton">
              <div className="skeleton-animation"></div>
            </div>
          )}
          
          {imageError ? (
            <div className="netflix-movie-card__poster-error">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
              <span>تصویر موجود نیست</span>
            </div>
          ) : (
            <img
              src={poster}
              alt={name}
              className={`netflix-movie-card__poster ${imageLoaded ? 'loaded' : ''}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
          )}

          {/* Year Badge - Top Left */}
          <div className="netflix-movie-card__year-badge">
            {year}
          </div>

          {/* Bottom Overlay with Info */}
          <div className="netflix-movie-card__bottom-overlay">
            {/* Movie Title */}
            <h3 className="netflix-movie-card__title">{name}</h3>
            
            {/* Description */}
            {description && (
              <p className="netflix-movie-card__description">
                {description.length > 120 
                  ? `${description.substring(0, 120)}...` 
                  : description
                }
              </p>
            )}

            {/* Bottom Info Row */}
            <div className="netflix-movie-card__bottom-info">
              {/* Rating */}
              <div className="netflix-movie-card__rating">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>{formatRating(rate)}</span>
              </div>

              {/* Quality Badge */}
              <div className="netflix-movie-card__quality">
                HD
              </div>

              {/* Play Button */}
              <div className="netflix-movie-card__play-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;