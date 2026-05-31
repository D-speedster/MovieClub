import React, { useState, useEffect, useCallback } from 'react';
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
  const [featured, setFeatured] = useState([]);
  const [top10, setTop10] = useState([]);
  const [updatedSeries, setUpdatedSeries] = useState([]);
  const [randomContent, setRandomContent] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroLoading, setHeroLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // همه درخواست‌ها رو موازی بزن
      const [
        featuredRes,
        top10Res,
        updatedSeriesRes,
        randomRes
      ] = await Promise.allSettled([
        ApiRequest.get('/content/featured'),
        ApiRequest.get('/content/top10'),
        ApiRequest.get('/content/updated-series'),
        ApiRequest.get('/content/random')
      ]);

      // پیشنهادی‌ها
      if (featuredRes.status === 'fulfilled') {
        const data = Array.isArray(featuredRes.value.data)
          ? featuredRes.value.data
          : Object.values(featuredRes.value.data);
        setFeatured(data);
      }

      // 10 عنوان برتر
      if (top10Res.status === 'fulfilled') {
        const data = Array.isArray(top10Res.value.data)
          ? top10Res.value.data
          : Object.values(top10Res.value.data);
        setTop10(data);
      }

      // سریال‌های بروز شده
      if (updatedSeriesRes.status === 'fulfilled') {
        const data = Array.isArray(updatedSeriesRes.value.data)
          ? updatedSeriesRes.value.data
          : Object.values(updatedSeriesRes.value.data);
        setUpdatedSeries(data);
      }

      // به انتخاب خودت
      if (randomRes.status === 'fulfilled') {
        const data = Array.isArray(randomRes.value.data)
          ? randomRes.value.data
          : Object.values(randomRes.value.data);
        setRandomContent(data);
      }

    } catch (err) {
      const handledError = handleApiError(err, 'Home API');
      setError(handledError.message);
      Logger.error('Error fetching home data:', handledError);
      showErrorToUser(handledError, false);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHeroData = useCallback(async () => {
    try {
      setHeroLoading(true);
      const trailersRes = await ApiRequest.get('/content/trailers');
      const trailersArray = Array.isArray(trailersRes.data)
        ? trailersRes.data
        : Object.values(trailersRes.data);
      setTrailers(trailersArray);
    } catch (err) {
      Logger.warn('Trailers endpoint not available');
      setTrailers([]);
    } finally {
      setHeroLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
    fetchHeroData();
  }, [fetchAllData, fetchHeroData]);


  if (error) {
    return (
      <div className="home-page">
        <div className="error-state">
          <div className="container">
            <div className="error-state__content">
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
      {/* Hero Section */}
      <HeroSection
        trailers={trailers}
        loading={heroLoading}
      />

      <div className="home-content-wrapper">
        <main className="home-content">

          {/* 1. پیشنهادی‌ها - ست شده توسط ادمین */}
          <MovieSlider
            title="پیشنهادی‌ها"
            movies={featured}
            loading={loading}
            showViewAll={false}
          />

          {/* 2. 10 عنوان برتر */}
          <MovieSlider
            title="۱۰ عنوان برتر"
            movies={top10}
            loading={loading}
            showViewAll={true}
            onViewAll={() => window.location.href = '/Movies'}
          />

          {/* 3. سریال‌های بروز شده */}
          <MovieSlider
            title="سریال‌های بروز شده"
            movies={updatedSeries}
            loading={loading}
            showViewAll={true}
            onViewAll={() => window.location.href = '/Series'}
          />

          {/* 4. به انتخاب خودت */}
          <MovieSlider
            title="به انتخاب خودت"
            movies={randomContent}
            loading={loading}
            showViewAll={false}
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
