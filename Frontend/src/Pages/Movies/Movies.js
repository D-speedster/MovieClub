import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/Layout/PageHeader/PageHeader';
import MovieCard from '../../components/UI/MovieCard/MovieCard';
import Footer from '../../components/Layout/Footer/Footer';
import MobileNav from '../../components/Layout/MobileNav/MobileNav';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import ApiRequest from '../../Services/Axios/config';
import Logger from '../../utils/logger';
import { handleApiError, showErrorToUser } from '../../utils/errorHandler';
import './Movies.css';

export default function Movies() {
  const [allMovies, setAllMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    rating: '',
    sort: 'newest'
  });

  const moviesPerPage = 20;

  // Fetch movies data
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ApiRequest.get('/content/movieList');
        
        const moviesData = Array.isArray(response.data) 
          ? response.data 
          : Object.values(response.data);
        
        setAllMovies(moviesData);
        setFilteredMovies(moviesData);
        Logger.log('Movies loaded successfully:', moviesData.length, 'movies');
      } catch (err) {
        const handledError = handleApiError(err, 'Movies API');
        setError(handledError.message);
        Logger.error('Error fetching movies:', handledError);
        showErrorToUser(handledError, false);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...allMovies];

    // Genre filter
    if (filters.genre && filters.genre !== 'all') {
      filtered = filtered.filter(movie => 
        movie.genre && movie.genre.includes(filters.genre)
      );
    }

    // Year filter
    if (filters.year && filters.year !== 'all') {
      filtered = filtered.filter(movie => movie.year === filters.year);
    }

    // Rating filter
    if (filters.rating && filters.rating !== 'all') {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter(movie => parseFloat(movie.rate || 0) >= minRating);
    }

    // Sort
    switch (filters.sort) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.CreatedAt || 0) - new Date(a.CreatedAt || 0));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.CreatedAt || 0) - new Date(b.CreatedAt || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => parseFloat(b.rate || 0) - parseFloat(a.rate || 0));
        break;
      case 'name':
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      default:
        break;
    }

    setFilteredMovies(filtered);
    setCurrentPage(1);
  }, [filters, allMovies]);

  // Get current page movies
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get unique years from movies
  const getUniqueYears = () => {
    const years = allMovies
      .map(movie => movie.year)
      .filter(year => year)
      .sort((a, b) => b - a);
    return [...new Set(years)];
  };

  // Get unique genres from movies
  const getUniqueGenres = () => {
    const genres = allMovies
      .flatMap(movie => movie.genres || movie.genre || [])
      .filter(genre => genre);
    return [...new Set(genres)];
  };

  if (loading) {
    return (
      <div className="movies-page">
        <PageHeader />
        <div className="movies-static-hero">
          <div className="movies-static-hero__content">
            <h1>فیلم</h1>
          </div>
        </div>
        <div className="movies-content">
          <div className="container-fluid">
            <LoadingSpinner size="large" message="در حال بارگذاری فیلم‌ها..." />
          </div>
        </div>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  if (error) {
    return (
      <div className="movies-page">
        <PageHeader />
        <div className="movies-static-hero">
          <div className="movies-static-hero__content">
            <h1>فیلم</h1>
          </div>
        </div>
        <div className="movies-content">
          <div className="container-fluid">
            <div className="error-state">
              <h3>خطا در بارگذاری فیلم‌ها</h3>
              <p>{error}</p>
              <button className="btn-retry" onClick={() => window.location.reload()}>
                تلاش مجدد
              </button>
            </div>
          </div>
        </div>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="movies-page">
      <PageHeader />
      
      {/* Static Hero Section */}
      <div className="movies-static-hero">
        <div className="movies-static-hero__background"></div>
        <div className="movies-static-hero__overlay"></div>
        <div className="movies-static-hero__content">
          <h1>فیلم</h1>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="movies-content">
        <div className="container-fluid">
          {/* Filters */}
          <div className="movies-filters">
            <div className="movies-filters__row">
              {/* Genre Filter */}
              <div className="filter-group">
                <label>ژانر</label>
                <select 
                  value={filters.genre} 
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                >
                  <option value="all">همه</option>
                  {getUniqueGenres().map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div className="filter-group">
                <label>سال تولید</label>
                <select 
                  value={filters.year} 
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                >
                  <option value="all">همه</option>
                  {getUniqueYears().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div className="filter-group">
                <label>امتیاز</label>
                <select 
                  value={filters.rating} 
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                >
                  <option value="all">همه</option>
                  <option value="8">بالای 8</option>
                  <option value="7">بالای 7</option>
                  <option value="6">بالای 6</option>
                  <option value="5">بالای 5</option>
                </select>
              </div>

              {/* Sort Filter */}
              <div className="filter-group">
                <label>مرتب‌سازی</label>
                <select 
                  value={filters.sort} 
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                >
                  <option value="newest">جدیدترین</option>
                  <option value="oldest">قدیمی‌ترین</option>
                  <option value="rating">بالاترین امتیاز</option>
                  <option value="name">نام فیلم</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="movies-results-info">
              <span>{filteredMovies.length} فیلم یافت شد</span>
            </div>
          </div>

          {/* Movies Grid */}
          <div className="movies-grid">
            {currentMovies.map((movie, index) => (
              <MovieCard
                key={movie._id || movie.id || index}
                id={movie._id || movie.id}
                poster={movie.poster}
                name={movie.title || movie.name}
                year={movie.year}
                rate={movie.rate}
                genre={movie.genres || movie.genre}
                description={movie.description || movie.TranslateText}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="movies-pagination">
              <button 
                className="pagination-btn pagination-btn--prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                قبلی
              </button>
              
              <div className="pagination-numbers">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        className={`pagination-number ${currentPage === pageNumber ? 'active' : ''}`}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === currentPage - 3 ||
                    pageNumber === currentPage + 3
                  ) {
                    return <span key={pageNumber} className="pagination-dots">...</span>;
                  }
                  return null;
                })}
              </div>

              <button 
                className="pagination-btn pagination-btn--next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                بعدی
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
}