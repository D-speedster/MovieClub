import React, { useState, useEffect } from 'react'
import Header from '../../components/Home/Header/Header'
import Latest_Trailers from '../../components/Home/Latest_Trailers/Latest_Trailers'
import SliderMovie from '../../components/Home/SliderMovie/SliderMovie'
import MobileNav from '../../components/Home/MobileNav/MobileNav'
import './Home.css';
import './Home.improved.css';
import Footer from '../../components/Home/Footer/Footer'
import Boxoffice from '../../components/Home/Boxofiice/Boxoffice'
import Header_MovieSeries from '../../components/Home/Header_MovieSeries/Header_MovieSeries'
import ApiRequest from '../../Services/Axios/config';
import { BiArrowToTop } from 'react-icons/bi';
import { MdError } from 'react-icons/md';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import SkeletonLoader from '../../components/Loading/SkeletonLoader';
import Logger from '../../utils/logger';
import { handleApiError, showErrorToUser } from '../../utils/errorHandler';

export default function Home() {
  const [BoxOffice, SetBoxOffice] = useState(null);
  const [Moviez, SetMoviez] = useState([]);
  const [loading, setLoading] = useState(true);
  const [boxOfficeLoading, setBoxOfficeLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Fetch BoxOffice data
  useEffect(() => {
    const fetchBoxOffice = async () => {
      try {
        setBoxOfficeLoading(true);
        const response = await ApiRequest.get('/content/boxoffice');
        SetBoxOffice(response.data['0']);
        Logger.log('BoxOffice data loaded successfully');
      } catch (err) {
        const handledError = handleApiError(err, 'BoxOffice API');
        Logger.error('Error fetching BoxOffice:', handledError);
        // BoxOffice خطا critical نیست، فقط لاگ می‌کنیم
      } finally {
        setBoxOfficeLoading(false);
      }
    };

    fetchBoxOffice();
  }, []);

  // Fetch Movies data
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ApiRequest.get('/content/movieList');
        const MovieZa = response.data;
        SetMoviez(MovieZa.reverse());
        Logger.log('Movies data loaded successfully:', MovieZa.length, 'movies');
      } catch (err) {
        const handledError = handleApiError(err, 'Movies API');
        setError(handledError.message);
        Logger.error('Error fetching movies:', handledError);
        showErrorToUser(handledError, false); // بدون alert، فقط در UI نمایش می‌دهیم
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Back to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Genre movies renderer with loading state
  function GenreMoviez(genre, title) {
    if (loading) {
      return (
        <div className='genre-section fade-in'>
          <SkeletonLoader type="slider" count={1} />
        </div>
      );
    }

    if (!Moviez || Moviez.length === 0) return null;
    
    const movies = Object.entries(Moviez).map(i => i[1]);
    const firstMovieWithGenre = movies.filter(movie => 
      movie.genre && Array.isArray(movie.genre) && movie.genre.includes(genre)
    );

    return firstMovieWithGenre.length > 0 ? (
      <div className='genre-section fade-in'>
        <SliderMovie {...firstMovieWithGenre} Title={title} />
      </div>
    ) : null;
  }

  // Retry function
  const retryFetch = () => {
    window.location.reload();
  };

  // Error state renderer
  if (error) {
    return (
      <div className='body'>
        <Header />
        <div className='error-state'>
          <MdError size={48} />
          <h3>خطا در بارگذاری</h3>
          <p>{error}</p>
          <button className="btn-cta" onClick={retryFetch}>
            تلاش مجدد
          </button>
        </div>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className='body'>
      <Header />
      <Header_MovieSeries />
      
      <div className='hero-section'>
        {boxOfficeLoading ? (
          <LoadingSpinner size="large" message="در حال بارگذاری تریلرها..." />
        ) : (
          <Latest_Trailers {...BoxOffice} />
        )}
      </div>

      <div className='content-wrapper'>
        {GenreMoviez('ماجراجویی', 'فیلم های ماجراجویی')}
        {GenreMoviez('اکشن', 'فیلم های اکشن')}
        {GenreMoviez('درام', 'فیلم های درام')}
        {GenreMoviez('جنایی', 'فیلم های جنایی')}
        {GenreMoviez('کمدی', 'فیلم های کمدی')}
        {GenreMoviez('علمی تخیلی', 'فیلم های علمی تخیلی')}
      </div>

      {/* Back to Top Button */}
      <button 
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="بازگشت به بالا"
      >
        <BiArrowToTop />
      </button>

      <Footer />
      <MobileNav />
    </div>
  )
}
