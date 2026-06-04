import React, { useState } from 'react';
import {
  FiHome,
  FiFilm,
  FiPlay,
  FiFolder,
  FiUsers,
  FiMessageSquare,
  FiFlag,
  FiDatabase,
  FiHardDrive,
  FiSettings,
  FiChevronDown,
  FiChevronRight,
  FiStar,
  FiDownload,
} from 'react-icons/fi';
import './AdminSidebar.css';

const AdminSidebar = ({ activeSection, onSectionChange }) => {
  const [expandedGroups, setExpandedGroups] = useState({
    content: false,
    moderation: false,
    system: false
  });

  const toggleGroup = (group) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  // Configuration array for dynamic rendering
  const menuGroups = [
    // 1. Dashboard (standalone)
    {
      id: 'dashboard',
      label: 'داشبورد',
      icon: FiHome,
      single: true,
    },
    // 2. مدیریت محتوا
    {
      id: 'content',
      label: 'مدیریت محتوا',
      icon: FiFolder,
      items: [
        { id: 'movies', label: 'مدیریت فیلم‌ها', icon: FiFilm },
        { id: 'series', label: 'مدیریت سریال‌ها', icon: FiFilm },
        { id: 'add-movie', label: 'افزودن محتوا', icon: FiFilm },
        { id: 'trailers', label: 'تریلرها', icon: FiPlay },
        { id: 'downloads', label: 'لینک‌های دانلود', icon: FiDownload },
        { id: 'collections', label: 'کالکشن‌ها', icon: FiFolder },
        { id: 'featured', label: 'پیشنهادی‌ها', icon: FiStar },
        { id: 'hero-images', label: 'تصویر Hero صفحات', icon: FiFilm },
      ],
    },
    // 3. تعاملات و کاربران
    {
      id: 'interactions',
      label: 'تعاملات و کاربران',
      icon: FiUsers,
      items: [
        { id: 'users', label: 'کاربران', icon: FiUsers },
        { id: 'comments', label: 'نظرات', icon: FiMessageSquare },
        { id: 'reports', label: 'گزارش‌ها', icon: FiFlag },
        { id: 'plans', label: 'اشتراک‌ها', icon: FiUsers },
      ],
    },
    // 4. تنظیمات سیستم
    {
      id: 'system',
      label: 'تنظیمات سیستم',
      icon: FiSettings,
      items: [
        { id: 'imdb-sync', label: 'همگام‌سازی IMDb', icon: FiDatabase },
        { id: 'cache', label: 'حافظه موقت', icon: FiHardDrive },
        { id: 'settings', label: 'تنظیمات عمومی', icon: FiSettings },
      ],
    },
  ];

  const handleItemClick = (itemId) => {
    onSectionChange(itemId);
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2>مووی کلاب</h2>
        <span className="sidebar-subtitle">پنل مدیریت</span>
      </div>

      <nav className="sidebar-nav">
        {menuGroups.map(group => (
          <div key={group.id} className="nav-group">
            {group.single ? (
              <button
                className={`nav-item ${activeSection === group.id ? 'active' : ''}`}
                onClick={() => handleItemClick(group.id)}
              >
                <group.icon className="nav-icon" />
                <span>{group.label}</span>
              </button>
            ) : (
              <>
                <button
                  className="nav-group-header"
                  onClick={() => toggleGroup(group.id)}
                >
                  <div className="nav-group-title">
                    <group.icon className="nav-icon" />
                    <span>{group.label}</span>
                  </div>
                  {expandedGroups[group.id] ? 
                    <FiChevronDown className="expand-icon" /> : 
                    <FiChevronRight className="expand-icon" />
                  }
                </button>
                
                {expandedGroups[group.id] && (
                  <div className="nav-group-items">
                    {group.items.map(item => (
                      <button
                        key={item.id}
                        className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                        onClick={() => handleItemClick(item.id)}
                      >
                        <item.icon className="nav-icon" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
