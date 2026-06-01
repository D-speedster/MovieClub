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
  const [loggingOut, setLoggingOut] = useState(false);

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
    if (path.match(/\/admin\/movies\/.+/)) return 'edit-movie';
    if (path.match(/\/admin\/series\/.+/)) return 'edit-series';
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
    if (path.includes('/admin/featured')) return 'featured';
    if (path.includes('/admin/hero-images')) return 'hero-images';
    if (path.includes('/admin/downloads')) return 'downloads';
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
      'settings': '/admin/settings', 'cache': '/admin/cache', 'reports': '/admin/reports',
      'featured': '/admin/featured',
      'hero-images': '/admin/hero-images',
      'downloads': '/admin/downloads'
    };
    navigate(routeMap[sectionId] || '/admin');
  };

  // ── Logout ────────────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      // به backend بگو cookie را پاک کند
      await ApiRequest.post('/auth/logout');
    } catch (err) {
      Logger.warn('Logout API call failed, clearing local state anyway');
    } finally {
      // در هر صورت localStorage را پاک کن
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      setLoggingOut(false);
      navigate('/auth/login');
    }
  };

  const fetchDashboardData = async () => {
    try {
      const [statsRes, pendingRes] = await Promise.all([
        ApiRequest.get('/content/stats').catch(() => null),
        ApiRequest.get('/comments/count/pending').catch(() => null),
      ]);

      const movieCount   = statsRes?.data?.movieCount  ?? 0;
      const seriesCount  = statsRes?.data?.seriesCount ?? 0;
      const userCount    = statsRes?.data?.userCount   ?? 0;
      const pendingCount = pendingRes?.data?.count     ?? 0;

      setStats({
        totalUsers:      { current: userCount,    change: { value: 0,   isPositive: true  } },
        totalMovies:     { current: movieCount,   change: { value: 0,   isPositive: true  } },
        totalSeries:     { current: seriesCount,  change: { value: 0,   isPositive: true  } },
        dailyVisits:     { current: 0,            change: { value: 0,   isPositive: true  } },
        pendingComments: { current: pendingCount, change: { value: 0,   isPositive: false } }
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

  const sectionTitles = {
    'dashboard': 'داشبورد',
    'add-movie': 'افزودن محتوا',
    'movies': 'مدیریت فیلم‌ها',
    'series': 'مدیریت سریال‌ها',
    'users': 'کاربران',
    'comments': 'نظرات',
    'trailers': 'تریلرها',
    'settings': 'تنظیمات',
    'featured': 'مدیریت پیشنهادی‌ها',
    'hero-images': 'تصویر Hero صفحات',
    'reports': 'گزارش‌ها',
    'plans': 'اشتراک‌ها',
    'collections': 'کالکشن‌ها',
    'imdb-sync': 'همگام‌سازی IMDb',
    'cache': 'حافظه موقت',
    'downloads': 'لینک‌های دانلود',
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
      <main className="admin-main">
        <header className="admin-header">
          <h1>{sectionTitles[activeSection] || 'پنل مدیریت'}</h1>
          <div className="admin-user">
            <button
              className="theme-toggle"
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              title={theme === 'dark' ? 'تم روشن' : 'تم تاریک'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <span className="admin-user__name">
              {localStorage.getItem('role') || 'Admin'}
            </span>
            <button
              className="admin-logout-btn"
              onClick={handleLogout}
              disabled={loggingOut}
              title="خروج از حساب"
            >
              {loggingOut ? '...' : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
              )}
            </button>
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
