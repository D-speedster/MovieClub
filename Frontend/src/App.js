import React, { Suspense, lazy } from 'react';
import { useRoutes, useLocation } from "react-router-dom";
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import MobileNav from './components/Layout/MobileNav/MobileNav';
import Layout from './components/Layout/Layout/Layout';
import './App.css';
import UserDashboard from './pages/UserDashboard';

// Lazy load pages
const Home = lazy(() => import('./Pages/Home/Home.redesigned'));
const Movies = lazy(() => import('./Pages/Movies/Movies'));
const Series = lazy(() => import('./Pages/Series/Series'));
const Login = lazy(() => import('./Pages/Auth/Login'));
const Register = lazy(() => import('./Pages/Auth/Register'));
const Admin = lazy(() => import('./Pages/Admin/Admin'));
const Download = lazy(() => import('./components/M_Download/MoviePage'));
const UserPage = lazy(() => import('./Pages/User/UserPage'));
const About = lazy(() => import('./Pages/About/About'));
const Contact = lazy(() => import('./Pages/Contact/Contact'));
const Categories = lazy(() => import('./Pages/Categories/Categories'));
  const Anime = lazy(() => import('./Pages/Anime/Anime'));
  const Subscription = lazy(() => import('./Pages/Subscription/Subscription'));

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="loading-spinner__content">
      <div className="loading-spinner__circle"></div>
      <div className="loading-spinner__text">در حال بارگذاری...</div>
    </div>
  </div>
);

  const routes = [
  // صفحه اصلی — هدر شفاف روی HeroSection
  { path: '/', element: <Layout transparentHeader={true}><Home /></Layout> },

  // صفحه فیلم
  { path: '/movie/:userId', element: <Layout><Download /></Layout> },
  { path: '/Movie/:userId', element: <Layout><Download /></Layout> },

  // صفحات اصلی
  { path: '/Movies', element: <Layout><Movies /></Layout> },
  { path: '/Series', element: <Layout><Series /></Layout> },
  { path: '/anime', element: <Layout><Anime /></Layout> },
  { path: '/Anime', element: <Layout><Anime /></Layout> },
  { path: '/categories', element: <Layout><Categories /></Layout> },
  { path: '/Categories', element: <Layout><Categories /></Layout> },
  { path: '/about', element: <Layout><About /></Layout> },
  { path: '/contact', element: <Layout><Contact /></Layout> },
  { path: '/subscription', element: <Layout><Subscription /></Layout> },
  { path: '/news', element: (
    <Layout>
      <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#fff' }}>
        <span style={{ fontSize: 64 }}>📰</span>
        <h2 style={{ marginTop: 20 }}>اخبار</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>به زودی...</p>
      </div>
    </Layout>
  )},

  // احراز هویت
  { path: '/auth/register', element: <Layout><Register /></Layout> },
  { path: '/auth/login', element: <Layout><Login /></Layout> },
  { path: '/subscription', element: <Layout><Subscription /></Layout> },

  // ادمین — بدون GlobalHeader
  {
    path: '/admin/*',
    element: <ProtectedRoute adminOnly><Admin /></ProtectedRoute>
  },

  { path: '/User', element: <Layout><UserPage /></Layout> },
  // User dashboard placeholder for regular users
  { path: '/user/dashboard', element: <Layout><UserDashboard /></Layout> },
  { path: '*', element: (
    <Layout>
      <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#fff' }}>
        <span style={{ fontSize: 80 }}>404</span>
        <h2 style={{ marginTop: 16 }}>صفحه مورد نظر یافت نشد</h2>
        <a href="/" style={{ marginTop: 20, color: '#a78bfa', textDecoration: 'none' }}>بازگشت به خانه</a>
      </div>
    </Layout>
  )}
];

function App() {
  let router = useRoutes(routes);
  const location = useLocation();

  // MobileNav فقط برای صفحات عمومی — نه admin، نه login، نه register
  const hideNavPaths = ['/admin', '/auth/login', '/auth/register'];
  const showMobileNav = !hideNavPaths.some(p => location.pathname.startsWith(p));

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <div className="App">
          {router}
          {showMobileNav && <MobileNav />}
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
