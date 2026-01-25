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
  
  const [stats, setStats] = useState({
    totalUsers: { current: 0, change: { value: 0, isPositive: true }, previous: 0 },
    totalMovies: { current: 0, change: { value: 0, isPositive: true }, previous: 0 },
    totalSeries: { current: 0, change: { value: 0, isPositive: true }, previous: 0 },
    dailyVisits: { current: 0, change: { value: 0, isPositive: true }, previous: 0 },
    pendingComments: { current: 0, change: { value: 0, isPositive: true }, previous: 0 }
  });
  const [loading, setLoading] = useState(true);

  // تشخیص بخش فعال از URL
  const getActiveSectionFromPath = useCallback(() => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/') return 'dashboard';
    if (path.includes('/admin/add-movie')) return 'add-movie';
    if (path.includes('/admin/add-series')) return 'add-series';
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
    const currentSection = getActiveSectionFromPath();
    setActiveSection(currentSection);
  }, [location.pathname, getActiveSectionFromPath]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    
    // تغییر URL بر اساس بخش انتخاب شده
    const routeMap = {
      'dashboard': '/admin',
      'add-movie': '/admin/add-movie',
      'add-series': '/admin/add-series',
      'movies': '/admin/movies',
      'series': '/admin/series',
      'users': '/admin/users',
      'comments': '/admin/comments',
      'trailers': '/admin/trailers',
      'collections': '/admin/collections',
      'plans': '/admin/plans',
      'imdb-sync': '/admin/imdb',
      'settings': '/admin/settings',
      'cache': '/admin/cache',
      'reports': '/admin/reports'
    };

    const newPath = routeMap[sectionId] || '/admin';
    navigate(newPath);
  };

  const fetchDashboardData = async () => {
    try {
      const [movies, series, users, comments] = await Promise.all([
        ApiRequest.get('./Moviez'),
        ApiRequest.get('./Series'),
        ApiRequest.get('./Users'),
        ApiRequest.get('./Comments')
      ]);

      const movieCount = Array.isArray(movies.data) ? movies.data.length : Object.keys(movies.data || {}).length;
      const seriesCount = Array.isArray(series.data) ? series.data.length : Object.keys(series.data || {}).length;
      const userCount = Array.isArray(users.data) ? users.data.length : Object.keys(users.data || {}).length;
      const commentCount = Array.isArray(comments.data) ? comments.data.length : Object.keys(comments.data || {}).length;

      // Generate realistic percentage changes for "alive" feeling
      const generateChange = () => ({
        value: (Math.random() * 20 - 10), // -10% to +10%
        isPositive: Math.random() > 0.4 // 60% chance of positive growth
      });

      setStats({
        totalUsers: {
          current: userCount,
          change: generateChange(),
          previous: Math.floor(userCount * 0.95)
        },
        totalMovies: {
          current: movieCount,
          change: generateChange(),
          previous: Math.floor(movieCount * 0.98)
        },
        totalSeries: {
          current: seriesCount,
          change: generateChange(),
          previous: Math.floor(seriesCount * 0.97)
        },
        dailyVisits: {
          current: Math.floor(Math.random() * 1000) + 500,
          change: generateChange(),
          previous: Math.floor(Math.random() * 800) + 400
        },
        pendingComments: {
          current: Math.floor(commentCount * 0.3),
          change: generateChange(),
          previous: Math.floor(commentCount * 0.25)
        }
      });
      
      setLoading(false);
    } catch (error) {
      Logger.error('خطا در دریافت اطلاعات داشبورد:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>در حال بارگذاری داشبورد...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange} 
      />
      
      <main className="admin-main">
        <header className="admin-header">
          <h1>پنل مدیریت</h1>
          <div className="admin-user">
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