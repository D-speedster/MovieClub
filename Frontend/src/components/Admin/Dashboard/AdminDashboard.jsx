import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminContent from './AdminContent';
import ApiRequest from '../../../Services/Axios/config';
import Logger from '../../../utils/logger';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(() => localStorage.getItem('admin-theme') || 'dark');

  const [stats, setStats] = useState({
    totalUsers: { current: 0, change: { value: 0, isPositive: true } },
    totalMovies: { current: 0, change: { value: 0, isPositive: true } },
    totalSeries: { current: 0, change: { value: 0, isPositive: true } },
    dailyVisits: { current: 0, change: { value: 0, isPositive: true } },
    pendingComments: { current: 0, change: { value: 0, isPositive: true } }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('admin-theme', theme);
  }, [theme]);

  const getActiveSectionFromPath = useCallback(() => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/') return 'dashboard';
    if (path.includes('/admin/add-movie')) return 'add-movie';
    if (path.includes('/admin/movies')) return 'movies';
    if (path.includes('/admin/series')) return 'series';
    if (path.includes('/admin/users')) return 'users';
    if (path.includes('/admin/comments')) return 'comments';
    if (path.includes('/admin/trailers')) return 'trailers';
    if (path.includes('/admin/collections')) return 'collections';
    if (path.includes('/admin/plans')) return 'plans';
    if (path.includes('/admin/imdb')) return 'imdb-sync';
    if (path.includes('/admin/settings')) return 'settings';
    if (path.includes('/admin/cache')) return 'cache';
    if (path.includes('/admin/reports')) return 'reports';
    return 'dashboard';
  }, [location.pathname]);

  const [activeSection, setActiveSection] = useState(getActiveSectionFromPath());

  useEffect(() => {
    setActiveSection(getActiveSectionFromPath());
  }, [location.pathname, getActiveSectionFromPath]);

  useEffect(() => { fetchDashboardData(); }, []);

  const handleSectionChange = (sectionId) => {
    const routeMap = {
      'dashboard': '/admin', 'add-movie': '/admin/add-movie',
      'movies': '/admin/movies', 'series': '/admin/series',
      'users': '/admin/users', 'comments': '/admin/comments',
      'trailers': '/admin/trailers', 'collections': '/admin/collections',
      'plans': '/admin/plans', 'imdb-sync': '/admin/imdb',
      'settings': '/admin/settings', 'cache': '/admin/cache', 'reports': '/admin/reports'
    };
    navigate(routeMap[sectionId] || '/admin');
  };

  const fetchDashboardData = async () => {
    try {
      const [movies, series] = await Promise.all([
        ApiRequest.get('/content/movieList'),
        ApiRequest.get('/content/seriesList'),
      ]);

      const movieCount = Array.isArray(movies.data) ? movies.data.length : 0;
      const seriesCount = Array.isArray(series.data) ? series.data.length : 0;

      setStats({
        totalUsers: { current: 1, change: { value: 0, isPositive: true } },
        totalMovies: { current: movieCount, change: { value: 2.4, isPositive: true } },
        totalSeries: { current: seriesCount, change: { value: 1.1, isPositive: true } },
        dailyVisits: { current: 0, change: { value: 0, isPositive: true } },
        pendingComments: { current: 0, change: { value: 0, isPositive: false } }
      });
    } catch (error) {
      Logger.error('خطا در دریافت اطلاعات داشبورد:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
      <main className="admin-main">
        <header className="admin-header">
          <h1>
            {activeSection === 'dashboard' && 'داشبورد'}
            {activeSection === 'add-movie' && 'افزودن محتوا'}
            {activeSection === 'movies' && 'مدیریت فیلم‌ها'}
            {activeSection === 'series' && 'مدیریت سریال‌ها'}
            {activeSection === 'users' && 'کاربران'}
            {activeSection === 'comments' && 'نظرات'}
            {activeSection === 'trailers' && 'تریلرها'}
            {activeSection === 'settings' && 'تنظیمات'}
            {!['dashboard','add-movie','movies','series','users','comments','trailers','settings'].includes(activeSection) && 'پنل مدیریت'}
          </h1>
          <div className="admin-user">
            <button
              className="theme-toggle"
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              title={theme === 'dark' ? 'تم روشن' : 'تم تاریک'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <span>مدیر سیستم</span>
          </div>
        </header>
        <div className="admin-content">
          <AdminContent activeSection={activeSection} stats={stats} />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
