import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = ({ type = 'movie', count = 1 }) => {
  const renderMovieSkeleton = () => (
    <div className="skeleton-movie-card">
      <div className="skeleton-poster"></div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-rating"></div>
        <div className="skeleton-genre"></div>
        <div className="skeleton-description"></div>
        <div className="skeleton-description short"></div>
      </div>
    </div>
  );

  const renderListSkeleton = () => (
    <div className="skeleton-list-item">
      <div className="skeleton-avatar"></div>
      <div className="skeleton-list-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-subtitle"></div>
      </div>
    </div>
  );

  const renderSliderSkeleton = () => (
    <div className="skeleton-slider">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="skeleton-slide">
          <div className="skeleton-slide-image"></div>
        </div>
      ))}
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'movie':
        return renderMovieSkeleton();
      case 'list':
        return renderListSkeleton();
      case 'slider':
        return renderSliderSkeleton();
      default:
        return renderMovieSkeleton();
    }
  };

  return (
    <div className="skeleton-container">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-item">
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;