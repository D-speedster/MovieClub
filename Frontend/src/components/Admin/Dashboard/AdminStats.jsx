import React from 'react';
import { FiUsers, FiFilm, FiTv, FiEye, FiMessageSquare, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const AdminStats = ({ stats }) => {
  const statCards = [
    {
      id: 'users',
      title: 'کل کاربران',
      value: stats.totalUsers.current,
      change: stats.totalUsers.change,
      icon: FiUsers,
      description: 'کاربران ثبت‌نام شده',
      actionHint: 'مشاهده فعالیت کاربران'
    },
    {
      id: 'content',
      title: 'فیلم + سریال',
      value: stats.totalMovies.current + stats.totalSeries.current,
      change: {
        value: ((stats.totalMovies.change.value + stats.totalSeries.change.value) / 2),
        isPositive: stats.totalMovies.change.isPositive && stats.totalSeries.change.isPositive
      },
      icon: FiFilm,
      description: `${stats.totalMovies.current} فیلم، ${stats.totalSeries.current} سریال`,
      actionHint: 'افزودن محتوای جدید'
    },
    {
      id: 'visits',
      title: 'بازدید روزانه',
      value: stats.dailyVisits.current,
      change: stats.dailyVisits.change,
      icon: FiEye,
      description: 'ترافیک امروز',
      actionHint: 'مشاهده آمار تفصیلی'
    },
    {
      id: 'comments',
      title: 'نظرات در انتظار',
      value: stats.pendingComments.current,
      change: stats.pendingComments.change,
      icon: FiMessageSquare,
      description: 'نیاز به بررسی',
      actionHint: 'بررسی و تایید نظرات',
      isAlert: stats.pendingComments.current > 10
    }
  ];

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fa-IR').format(num);
  };

  const formatPercentage = (change) => {
    const absValue = Math.abs(change.value).toFixed(1);
    return `${change.isPositive ? '+' : '-'}${absValue}%`;
  };

  return (
    <div className="admin-stats">
      {statCards.map(card => (
        <div key={card.id} className={`stat-card ${card.isAlert ? 'stat-card--alert' : ''}`}>
          <div className="stat-header">
            <h3>{card.title}</h3>
            <card.icon className="stat-icon" />
          </div>
          
          <div className="stat-main">
            <div className="stat-value">{formatNumber(card.value)}</div>
            <div className={`stat-change ${card.change.isPositive ? 'stat-change--positive' : 'stat-change--negative'}`}>
              {card.change.isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
              <span>{formatPercentage(card.change)}</span>
            </div>
          </div>
          
          <div className="stat-description">{card.description}</div>
          
          {card.actionHint && (
            <div className="stat-action-hint">{card.actionHint}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminStats;