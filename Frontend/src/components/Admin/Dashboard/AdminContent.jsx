import React from 'react';
import AdminStats from './AdminStats';
import AdminChart from './AdminChart';

// Import existing admin components
import AddMovie from '../addMovie/AddMovie';
import AddSeries from '../addSeries/addSeries';
import AddTrailer from '../addTrailer/addTrailer';
import Users from '../Users/Users';
import MovieManage from '../Movie_Manage/Movie_mange';
import SeriesManage from '../Series_Manage/Series_Manage';
import Comments from '../Comments/Comments';
import Settings from '../Settings/Settings';
import IMDB from '../IMDB/IMDB';
import Plans from '../Plans/Plans';
import Collection from '../Ncollection/Collection';

const AdminContent = ({ activeSection, stats }) => {
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <>
            <AdminStats stats={stats} />
            <AdminChart />
          </>
        );
      
      case 'movies':
        return <MovieManage />;
      
      case 'series':
        return <SeriesManage />;
      
      case 'users':
        return <Users />;
      
      case 'comments':
        return <Comments />;
      
      case 'add-movie':
        return <AddMovie />;
        
      case 'add-series':
        return <AddSeries />;
        
      case 'trailers':
        return <AddTrailer />;
        
      case 'collections':
        return <Collection />;
        
      case 'plans':
        return <Plans />;
      
      case 'imdb-sync':
        return <IMDB />;
      
      case 'settings':
        return <Settings />;
        
      case 'cache':
        return (
          <div className="content-section">
            <div className="section-header">
              <h2>مدیریت حافظه موقت</h2>
              <p>پاک‌سازی و بهینه‌سازی حافظه موقت سیستم</p>
            </div>
            <div className="placeholder-content">
              <p>رابط مدیریت حافظه موقت در اینجا پیاده‌سازی خواهد شد.</p>
              <p>امکانات: پاک‌سازی cache، بهینه‌سازی عملکرد، مدیریت فضای ذخیره‌سازی.</p>
            </div>
          </div>
        );
        
      case 'reports':
        return (
          <div className="content-section">
            <div className="section-header">
              <h2>گزارش‌ها</h2>
              <p>مشاهده گزارش‌های کاربران و سیستم</p>
            </div>
            <div className="placeholder-content">
              <p>رابط مشاهده گزارش‌ها در اینجا پیاده‌سازی خواهد شد.</p>
              <p>امکانات: گزارش‌های کاربران، گزارش‌های سیستم، آمار و تحلیل.</p>
            </div>
          </div>
        );
      
      default:
        return (
          <>
            <AdminStats stats={stats} />
            <AdminChart />
          </>
        );
    }
  };

  return <div className="admin-content-wrapper">{renderContent()}</div>;
};

export default AdminContent;