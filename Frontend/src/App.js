import React, { Suspense, lazy } from 'react';
import { useRoutes } from "react-router-dom";
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import './App.css';

// Lazy load pages
const Home = lazy(() => import('./Pages/Home/Home.redesigned'));
const Movies = lazy(() => import('./Pages/Movies/Movies'));
const Series = lazy(() => import('./Pages/Series/Series'));
const Login = lazy(() => import('./Pages/Login/Login'));
const Register = lazy(() => import('./Pages/Register/Register'));
const Admin = lazy(() => import('./Pages/Admin/Admin'));
const Download = lazy(() => import('./components/M_Download/MoviePage'));
const UserPage = lazy(() => import('./Pages/User/UserPage'));
const About = lazy(() => import('./Pages/About/About'));
const Contact = lazy(() => import('./Pages/Contact/Contact'));
const Categories = lazy(() => import('./Pages/Categories/Categories'));
const Anime = lazy(() => import('./Pages/Anime/Anime'));

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="loading-spinner__content">
      <div className="loading-spinner__circle"></div>
      <div className="loading-spinner__text">در حال بارگذاری...</div>
    </div>
  </div>
);

const routes = [
  { path: '/', element: <Home /> },
  { path: '/movie/:userId', element: <Download /> },
  { path: '/Movie/:userId', element: <Download /> },
  { path: '/Movies', element: <Movies /> },
  { path: '/Series', element: <Series /> },
  { path: '/anime', element: <Anime /> },
  { path: '/Anime', element: <Anime /> },
  { path: '/categories', element: <Categories /> },
  { path: '/Categories', element: <Categories /> },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },
  { path: '/news', element: (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#fff' }}>
      <span style={{ fontSize: 64 }}>📰</span>
      <h2 style={{ marginTop: 20 }}>اخبار</h2>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>به زودی...</p>
    </div>
  )},
  { path: '/auth/register', element: <Register /> },
  { path: '/auth/login', element: <Login /> },
  {
    path: '/admin/*',
    element: <ProtectedRoute adminOnly><Admin /></ProtectedRoute>
  },
  { path: '/User', element: <UserPage /> },
  { path: '*', element: (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#fff' }}>
      <span style={{ fontSize: 80 }}>404</span>
      <h2 style={{ marginTop: 16 }}>صفحه مورد نظر یافت نشد</h2>
      <a href="/" style={{ marginTop: 20, color: '#a78bfa', textDecoration: 'none' }}>بازگشت به خانه</a>
    </div>
  )}
];

function App() {
  let router = useRoutes(routes);

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <div className="App">
          {router}
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
