import React from 'react';
import { FiUsers, FiFilm, FiEye, FiMessageSquare, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const AdminStats = ({ stats }) => {
  const statCards = [
    {
      id: 'users',
      title: 'کاربران',
      value: stats.totalUsers.current,
      change: stats.totalUsers.change,
      icon: FiUsers,
      description: 'کاربران ثبت‌نام شده',
    },
    {
      id: 'content',
      title: 'فیلم + سریال',
      value: stats.totalMovies.current + stats.totalSeries.current,
      change: stats.totalMovies.change,
      icon: FiFilm,
      description: `${stats.totalMovies.current} فیلم · ${stats.totalSeries.current} سریال`,
    },
    {
      id: 'visits',
      title: 'بازدید روزانه',
      value: stats.dailyVisits.current,
      change: stats.dailyVisits.change,
      icon: FiEye,
      description: 'ترافیک امروز',
    },
    {
      id: 'comments',
      title: 'نظرات در انتظار',
      value: stats.pendingComments.current,
      change: stats.pendingComments.change,
      icon: FiMessageSquare,
      description: 'نیاز به بررسی',
      isAlert: stats.pendingComments.current > 10
    }
  ];

  const fmt = (n) => new Intl.NumberFormat('fa-IR').format(n);
  const fmtPct = (c) => `${c.isPositive ? '+' : '-'}${Math.abs(c.value).toFixed(1)}%`;

  return (
    <div className="admin-stats">
      {statCards.map(card => (
        <div key={card.id} className={`stat-card ${card.isAlert ? 'stat-card--alert' : ''}`}>
          <div className="stat-header">
            <h3>{card.title}</h3>
            <card.icon className="stat-icon" />
          </div>
          <div className="stat-main">
            <div className="stat-value">{fmt(card.value)}</div>
            <div className={`stat-change ${card.change.isPositive ? 'stat-change--positive' : 'stat-change--negative'}`}>
              {card.change.isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
              <span>{fmtPct(card.change)}</span>
            </div>
          </div>
          <div className="stat-description">{card.description}</div>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;
