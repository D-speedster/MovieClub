import React from 'react';
import { useLocation } from 'react-router-dom';
import AdminStats from './AdminStats';
import AdminChart from './AdminChart';

// Import existing admin components
import AddMovie from '../addMovie/AddMovie';
import AddTrailer from '../addTrailer/addTrailer';
import Users from '../Users/Users';
import MovieManage from '../Movie_Manage/Movie_mange';
import SeriesManage from '../Series_Manage/Series_Manage';
import EditMovie from '../EditMovie/EditMovie';
import Comments from '../Comments/Comments';
import Settings from '../Settings/Settings';
import Reports from '../Reports/Reports';
import IMDB from '../IMDB/IMDB';
import Plans from '../Plans/Plans';
import Collection from '../Ncollection/Collection';
import FeaturedManager from '../FeaturedManager/FeaturedManager';

const AdminContent = ({ activeSection, stats }) => {
  const location = useLocation();

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <>
            <AdminStats stats={stats} />
            <AdminChart />
          </>
        );
      
      case 'featured':
        return <FeaturedManager />;
      
      case 'movies':
        return <MovieManage />;

      case 'edit-movie':
      case 'edit-series':
        return <EditMovie />;
      
      case 'series':
        return <SeriesManage />;
      
      case 'users':
        return <Users />;
      
      case 'comments':
        return <Comments />;
      
      case 'add-movie':
        return <AddMovie />;
        
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
        return <Reports />;
      
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