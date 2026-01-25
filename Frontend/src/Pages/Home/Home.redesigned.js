import React, { useState, useEffect } from 'react';
import HeroSection from '../../components/UI/HeroSection/HeroSection';
import MovieSlider from '../../components/UI/MovieSlider/MovieSlider';
import Footer from '../../components/Layout/Footer/Footer';
import MobileNav from '../../components/Layout/MobileNav/MobileNav';
import BackToTop from '../../components/UI/BackToTop/BackToTop';
import ApiRequest from '../../Services/Axios/config';
import Logger from '../../utils/logger';
import { handleApiError, showErrorToUser } from '../../utils/errorHandler';
import './Home.redesigned.css';

const Home = () => {
  // State management
  const [movies, setMovies] = useState([]);
  const [boxOfficeData, setBoxOfficeData] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroLoading, setHeroLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch movies
        const moviesResponse = await ApiRequest.get('/Moviez');
        const moviesData = moviesResponse.data;
        setMovies(Array.isArray(moviesData) ? moviesData.reverse() : Object.values(moviesData).reverse());
        
        Logger.log('Movies data loaded successfully:', moviesData.length, 'movies');
      } catch (err) {
        const handledError = handleApiError(err, 'Movies API');
        setError(handledError.message);
        Logger.error('Error fetching movies:', handledError);
        showErrorToUser(handledError, false);
      } finally {
        setLoading(false);
      }
    };

    const fetchHeroData = async () => {
      try {
        setHeroLoading(true);
        
        // Fetch box office data
        const boxOfficeResponse = await ApiRequest.get('/BoxOffice');
        const boxOfficeArray = Array.isArray(boxOfficeResponse.data) 
          ? boxOfficeResponse.data 
          : Object.values(boxOfficeResponse.data);
        setBoxOfficeData(boxOfficeArray);

        // Mock trailers data - replace with actual API
        const mockTrailers = [
          {
            id: 1,
            title: 'تریلر جدید فیلم اکشن',
            description: 'هیجان‌انگیزترین فیلم سال با بازی ستاره‌های مطرح سینما',
            image: '/img/Last_Trailer/Trailer_Background.jpg',
            thumbnail: '/img/Last_Trailer/t_poster1.jpg'
          },
          {
            id: 2,
            title: 'فیلم درام برتر',
            description: 'داستانی تأثیرگذار از زندگی و امید',
            image: '/img/Last_Trailer/t_poster2.jpg',
            thumbnail: '/img/Last_Trailer/t_poster2.jpg'
          },
          {
            id: 3,
            title: 'کمدی سال',
            description: 'خنده‌های بی‌پایان در انتظار شماست',
            image: '/img/Last_Trailer/t_poster3.jpg',
            thumbnail: '/img/Last_Trailer/t_poster3.jpg'
          }
        ];
        setTrailers(mockTrailers);

        Logger.log('Hero data loaded successfully');
      } catch (err) {
        Logger.error('Error fetching hero data:', err);
      } finally {
        setHeroLoading(false);
      }
    };

    fetchData();
    fetchHeroData();
  }, []);

  // Filter movies by genre
  const getMoviesByGenre = (genre, limit = 12) => {
    if (!movies || movies.length === 0) return [];
    
    return movies
      .filter(movie => 
        movie.genre && 
        Array.isArray(movie.genre) && 
        movie.genre.includes(genre)
      )
      .slice(0, limit);
  };

  // Get featured movies (highest rated)
  const getFeaturedMovies = (limit = 6) => {
    if (!movies || movies.length === 0) return [];
    
    return movies
      .filter(movie => movie.rate && parseFloat(movie.rate) >= 8.0)
      .sort((a, b) => parseFloat(b.rate) - parseFloat(a.rate))
      .slice(0, limit);
  };

  // Get trending movies (most recent)
  const getTrendingMovies = (limit = 12) => {
    if (!movies || movies.length === 0) return [];
    
    return movies
      .filter(movie => movie.year && parseInt(movie.year) >= 2022)
      .slice(0, limit);
  };

  // Error state
  if (error) {
    return (
      <div className="home-page">
        <div className="error-state">
          <div className="container">
            <div className="error-state__content">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <h2>خطا در بارگذاری</h2>
              <p>{error}</p>
              <button 
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
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
    <div className="home-page">
      {/* Hero Section with integrated header */}
      <HeroSection 
        trailers={trailers}
        boxOfficeData={boxOfficeData}
        loading={heroLoading}
      />

      {/* Rest of the content with dark theme */}
      <div className="home-content-wrapper">
        {/* Modern Movie Sliders */}
        <main className="home-content">
          <MovieSlider
            title="در حال اکران"
            movies={getTrendingMovies()}
            loading={loading}
            showViewAll={true}
            onViewAll={() => console.log('View all trending')}
          />

          <MovieSlider
            title="فیلم‌های اکشن"
            movies={getMoviesByGenre('اکشن')}
            loading={loading}
            showViewAll={true}
            onViewAll={() => console.log('View all action')}
          />

          <MovieSlider
            title="فیلم‌های درام"
            movies={getMoviesByGenre('درام')}
            loading={loading}
            showViewAll={true}
            onViewAll={() => console.log('View all drama')}
          />

          <MovieSlider
            title="فیلم‌های کمدی"
            movies={getMoviesByGenre('کمدی')}
            loading={loading}
            showViewAll={true}
            onViewAll={() => console.log('View all comedy')}
          />

          <MovieSlider
            title="فیلم‌های ماجراجویی"
            movies={getMoviesByGenre('ماجراجویی')}
            loading={loading}
            showViewAll={true}
            onViewAll={() => console.log('View all adventure')}
          />

          <MovieSlider
            title="فیلم‌های علمی تخیلی"
            movies={getMoviesByGenre('علمی تخیلی')}
            loading={loading}
            showViewAll={true}
            onViewAll={() => console.log('View all sci-fi')}
          />
        </main>

        <BackToTop />
        <Footer />
      </div>
      
      <MobileNav />
    </div>
  );
};

export default Home;