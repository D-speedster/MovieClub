import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchResults from './SearchResults';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery.length >= 2) {
      setIsSearching(true);
      setShowResults(true);
      
      // Simulate API call - replace with actual API
      const timer = setTimeout(() => {
        // Mock search results - replace with actual API call
        setSearchResults([
          {
            id: 1,
            name: 'فیلم نمونه',
            year: '2023',
            rate: '8.5',
            poster: '/img/batman.jpg'
          }
        ]);
        setIsSearching(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setShowResults(false);
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Handle click outside search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
    }
  };

  const navigationItems = [
    { path: '/', label: 'خانه', icon: 'home' },
    { path: '/Movies', label: 'فیلم‌ها', icon: 'movie' },
    { path: '/Series', label: 'سریال‌ها', icon: 'tv' },
    { path: '/anime', label: 'انیمه', icon: 'star' },
    { path: '/news', label: 'اخبار', icon: 'news' }
  ];

  const getIcon = (iconName) => {
    const icons = {
      home: <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>,
      movie: <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>,
      tv: <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5l-1 1v1h8v-1l-1-1h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12H3V5h18v10z"/>,
      star: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>,
      news: <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
    };
    return icons[iconName] || icons.home;
  };

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="container-hero">
        {/* Top Bar */}
        <div className="header__top">
          <div className="header__logo">
            <span className="header__logo-text">MOVIE CLUB</span>
          </div>

          <div className="header__actions">
            <Link to="/auth/login" className="header__login-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              پنل کاربری
            </Link>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="header__nav">
          <div className="header__nav-content">
            {/* Desktop Navigation */}
            <ul className="header__nav-list">
              {navigationItems.map((item) => (
                <li key={item.path} className="header__nav-item">
                  <Link 
                    to={item.path} 
                    className="header__nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      {getIcon(item.icon)}
                    </svg>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Search */}
            <div className="header__search" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="header__search-form">
                <input
                  type="search"
                  placeholder="جستجو کنید..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="header__search-input"
                  aria-label="جستجوی فیلم و سریال"
                />
                <button 
                  type="submit" 
                  className="header__search-button"
                  aria-label="جستجو"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                </button>
              </form>

              {/* Search Results */}
              {showResults && (
                <SearchResults
                  results={searchResults}
                  isLoading={isSearching}
                  query={searchQuery}
                  onClose={() => setShowResults(false)}
                />
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="header__mobile-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="منوی موبایل"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className={`header__mobile-nav ${isMobileMenuOpen ? 'header__mobile-nav--open' : ''}`}>
            <ul className="header__mobile-nav-list">
              {navigationItems.map((item) => (
                <li key={item.path} className="header__mobile-nav-item">
                  <Link 
                    to={item.path} 
                    className="header__mobile-nav-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      {getIcon(item.icon)}
                    </svg>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;