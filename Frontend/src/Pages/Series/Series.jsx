import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/Layout/PageHeader/PageHeader';
import MovieCard from '../../components/UI/MovieCard/MovieCard';
import Footer from '../../components/Layout/Footer/Footer';
import MobileNav from '../../components/Layout/MobileNav/MobileNav';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import ApiRequest from '../../Services/Axios/config';
import Logger from '../../utils/logger';
import { handleApiError, showErrorToUser } from '../../utils/errorHandler';
import './Series.css';

export default function Series() {
  const [allSeries, setAllSeries] = useState([]);
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    rating: '',
    sort: 'newest'
  });

  const seriesPerPage = 20;

  // Fetch series data
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ApiRequest.get('/content/seriesList');
        const seriesData = Array.isArray(response.data) 
          ? response.data 
          : Object.values(response.data);
        
        setAllSeries(seriesData);
        setFilteredSeries(seriesData);
        Logger.log('Series loaded successfully:', seriesData.length, 'series');
      } catch (err) {
        const handledError = handleApiError(err, 'Series API');
        setError(handledError.message);
        Logger.error('Error fetching series:', handledError);
        showErrorToUser(handledError, false);
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...allSeries];

    // Genre filter
    if (filters.genre && filters.genre !== 'all') {
      filtered = filtered.filter(series => 
        series.genre && series.genre.includes(filters.genre)
      );
    }

    // Year filter
    if (filters.year && filters.year !== 'all') {
      filtered = filtered.filter(series => series.year === filters.year);
    }

    // Rating filter
    if (filters.rating && filters.rating !== 'all') {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter(series => parseFloat(series.rate || 0) >= minRating);
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

    setFilteredSeries(filtered);
    setCurrentPage(1);
  }, [filters, allSeries]);

  // Get current page series
  const indexOfLastSeries = currentPage * seriesPerPage;
  const indexOfFirstSeries = indexOfLastSeries - seriesPerPage;
  const currentSeries = filteredSeries.slice(indexOfFirstSeries, indexOfLastSeries);
  const totalPages = Math.ceil(filteredSeries.length / seriesPerPage);

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get unique years from series
  const getUniqueYears = () => {
    const years = allSeries
      .map(series => series.year)
      .filter(year => year)
      .sort((a, b) => b - a);
    return [...new Set(years)];
  };

  // Get unique genres from series
  const getUniqueGenres = () => {
    const genres = allSeries
      .flatMap(series => series.genre || [])
      .filter(genre => genre);
    return [...new Set(genres)];
  };

  if (loading) {
    return (
      <div className="series-page">
        <PageHeader />
        <div className="series-static-hero">
          <div className="series-static-hero__content">
            <h1>سریال</h1>
          </div>
        </div>
        <div className="series-content">
          <div className="container-fluid">
            <LoadingSpinner size="large" message="در حال بارگذاری سریال‌ها..." />
          </div>
        </div>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  if (error) {
    return (
      <div className="series-page">
        <PageHeader />
        <div className="series-static-hero">
          <div className="series-static-hero__content">
            <h1>سریال</h1>
          </div>
        </div>
        <div className="series-content">
          <div className="container-fluid">
            <div className="error-state">
              <h3>خطا در بارگذاری سریال‌ها</h3>
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
    <div className="series-page">
      <PageHeader />
      
      {/* Static Hero Section */}
      <div className="series-static-hero">
        <div className="series-static-hero__background"></div>
        <div className="series-static-hero__overlay"></div>
        <div className="series-static-hero__content">
          <h1>سریال</h1>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="series-content">
        <div className="container-fluid">
          {/* Filters */}
          <div className="series-filters">
            <div className="series-filters__row">
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
                  <option value="name">نام سریال</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="series-results-info">
              <span>{filteredSeries.length} سریال یافت شد</span>
            </div>
          </div>

          {/* Series Grid */}
          <div className="series-grid">
            {currentSeries.map((series, index) => (
              <MovieCard
                key={series.id || index}
                id={series.id}
                poster={series.poster}
                name={series.name}
                year={series.year}
                rate={series.rate}
                genre={series.genre}
                description={series.TranslateText}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="series-pagination">
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