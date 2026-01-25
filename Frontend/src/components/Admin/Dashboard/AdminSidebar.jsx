import React, { useState } from 'react';
import { 
  FiHome, 
  FiFilm, 
  FiTv, 
  FiPlay, 
  FiFolder,
  FiUsers, 
  FiMessageSquare, 
  FiFlag,
  FiDatabase,
  FiHardDrive,
  FiSettings,
  FiChevronDown,
  FiChevronRight
} from 'react-icons/fi';

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

  const menuGroups = [
    {
      id: 'dashboard',
      label: 'داشبورد',
      icon: FiHome,
      single: true
    },
    {
      id: 'content',
      label: 'محتوا',
      icon: FiFolder,
      items: [
        { id: 'movies', label: 'مدیریت فیلم‌ها', icon: FiFilm },
        { id: 'series', label: 'مدیریت سریال‌ها', icon: FiTv },
        { id: 'add-movie', label: 'افزودن فیلم', icon: FiFilm },
        { id: 'add-series', label: 'افزودن سریال', icon: FiTv },
        { id: 'trailers', label: 'تریلرها', icon: FiPlay },
        { id: 'collections', label: 'کالکشن‌ها', icon: FiFolder }
      ]
    },
    {
      id: 'moderation',
      label: 'کاربران و نظارت',
      icon: FiUsers,
      items: [
        { id: 'users', label: 'کاربران', icon: FiUsers },
        { id: 'comments', label: 'نظرات', icon: FiMessageSquare },
        { id: 'reports', label: 'گزارش‌ها', icon: FiFlag },
        { id: 'plans', label: 'اشتراک‌ها', icon: FiUsers }
      ]
    },
    {
      id: 'system',
      label: 'سیستم',
      icon: FiSettings,
      items: [
        { id: 'imdb-sync', label: 'همگام‌سازی IMDb', icon: FiDatabase },
        { id: 'cache', label: 'حافظه موقت', icon: FiHardDrive },
        { id: 'settings', label: 'تنظیمات', icon: FiSettings }
      ]
    }
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