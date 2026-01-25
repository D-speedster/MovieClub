import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminChart = () => {
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState(12); // months

  useEffect(() => {
    generateChartData(timeRange);
  }, [timeRange]);

  const generateChartData = (months) => {
    const persianMonths = [
      'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
      'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
    ];
    
    const data = [];
    let peak = { value: 0, month: '' };
    let lowest = { value: Infinity, month: '' };
    
    for (let i = months - 1; i >= 0; i--) {
      const monthIndex = (new Date().getMonth() - i + 12) % 12;
      const users = Math.floor(Math.random() * 200) + 50;
      const monthData = {
        month: persianMonths[monthIndex],
        users: users,
        monthIndex: monthIndex
      };
      
      if (users > peak.value) {
        peak = { value: users, month: persianMonths[monthIndex] };
      }
      if (users < lowest.value) {
        lowest = { value: users, month: persianMonths[monthIndex] };
      }
      
      data.push(monthData);
    }
    
    setChartData(data.map(item => ({
      ...item,
      isPeak: item.users === peak.value,
      isLowest: item.users === lowest.value
    })));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="chart-tooltip">
          <p className="tooltip-title">{label}</p>
          <p className="tooltip-value">{payload[0].value} کاربر جدید</p>
          {data.isPeak && <p className="tooltip-note">بالاترین میزان</p>}
          {data.isLowest && <p className="tooltip-note">کمترین میزان</p>}
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    if (payload.isPeak) {
      return <circle cx={cx} cy={cy} r={6} fill="#22C55E" stroke="#FFFFFF" strokeWidth={2} />;
    }
    if (payload.isLowest) {
      return <circle cx={cx} cy={cy} r={6} fill="#EF4444" stroke="#FFFFFF" strokeWidth={2} />;
    }
    return <circle cx={cx} cy={cy} r={4} fill="#4A90E2" />;
  };

  return (
    <div className="admin-chart">
      <div className="chart-header">
        <div className="chart-title-section">
          <h3>کاربران جدید – {timeRange} ماه گذشته</h3>
          <p className="chart-subtitle">روند رشد کاربران در بازه زمانی انتخابی</p>
        </div>
        <div className="chart-controls">
          <button 
            className={`chart-range-btn ${timeRange === 3 ? 'active' : ''}`}
            onClick={() => setTimeRange(3)}
          >
            ۳ ماه
          </button>
          <button 
            className={`chart-range-btn ${timeRange === 6 ? 'active' : ''}`}
            onClick={() => setTimeRange(6)}
          >
            ۶ ماه
          </button>
          <button 
            className={`chart-range-btn ${timeRange === 12 ? 'active' : ''}`}
            onClick={() => setTimeRange(12)}
          >
            ۱۲ ماه
          </button>
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
            <XAxis 
              dataKey="month" 
              stroke="#8A8A8A"
              fontSize={12}
              tick={{ fontFamily: 'IRANSans, sans-serif' }}
            />
            <YAxis 
              stroke="#8A8A8A"
              fontSize={12}
              tick={{ fontFamily: 'IRANSans, sans-serif' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="users" 
              stroke="#4A90E2" 
              strokeWidth={2}
              dot={<CustomDot />}
              activeDot={{ r: 6, stroke: '#4A90E2', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminChart;