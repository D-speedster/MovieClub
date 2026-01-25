
import React, { Suspense, lazy } from 'react';
import { useRoutes } from "react-router-dom";
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import './App.css';

// Lazy load pages
const Home = lazy(() => import('./Pages/Home/Home.redesigned'));
const Movies = lazy(() => import('./Pages/Movies/Movies'));
const Series = lazy(() => import('./Pages/Series/Series'));
const Login = lazy(() => import('./Pages/Login/Login'));
const Register = lazy(() => import('./Pages/Register/Register'));
const Admin = lazy(() => import('./Pages/Admin/Admin'));
const Download = lazy(() => import('./components/M_Download/MoviePage'));
const ThemeExample = lazy(() => import('./components/ThemeExample/ThemeExample'));

// Admin components
const AddMovie = lazy(() => import('./components/Admin/addMovie/AddMovie'));
const AddSeries = lazy(() => import('./components/Admin/addSeries/addSeries'));
const AddTrailer = lazy(() => import('./components/Admin/addTrailer/addTrailer'));
const Users = lazy(() => import('./components/Admin/Users/Users'));
const Movie_mange = lazy(() => import('./components/Admin/Movie_Manage/Movie_mange'));
const Collection = lazy(() => import('./components/Admin/Ncollection/Collection'));
const InfoAdmin = lazy(() => import('./components/Admin/InfoAdmin/InfoAdmin'));
const EditMovie = lazy(() => import('./components/Admin/EditMovie/EditMovie'));
const Plans_Admin = lazy(() => import('./components/Admin/Plans/Plans'));
const News = lazy(() => import('./components/Admin/News/News'));
const Settings = lazy(() => import('./components/Admin/Settings/Settings'));
const Other = lazy(() => import('./components/Admin/Settings/other'));
const Box_ofiice = lazy(() => import('./components/Admin/Settings/Box_ofiice'));
const Slider = lazy(() => import('./components/Admin/Settings/Slider'));
const Home_Setting = lazy(() => import('./components/Admin/Settings/Home'));
const Comments = lazy(() => import('./components/Admin/Comments/Comments'));
const Movie_Series = lazy(() => import('./components/Admin/Series_Manage/Series_Manage'));
const Top250 = lazy(() => import('./components/Admin/Settings/Top250'));
const IMDB = lazy(() => import('./components/Admin/IMDB/IMDB'));

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
  { path: '/theme-demo', element: <ThemeExample /> },
  { path: '/Movie/:userId', element: <Download /> },
  { path: '/Movies', element: <Movies /> },
  { path: '/Series', element: <Series /> },
  { path: '/auth/register', element: <Register /> },
  { path: '/auth/login', element: <Login /> },
  {
    path: '/admin/*', 
    element: <Admin />, 
    children: [
      { path: '', element: <InfoAdmin /> },
      { path: 'add-movie', element: <AddMovie /> },
      { path: 'add-series', element: <AddSeries /> },
      { path: 'movies', element: <Movie_mange /> },
      { path: 'series', element: <Movie_Series /> },
      { path: 'users', element: <Users /> },
      { path: 'comments', element: <Comments /> },
      { path: 'trailers', element: <AddTrailer /> },
      { path: 'collections', element: <Collection /> },
      { path: 'plans', element: <Plans_Admin /> },
      { path: 'imdb', element: <IMDB /> },
      { path: 'settings', element: <Settings /> },
      { path: 'cache', element: <div className="text-center text-primary">مدیریت حافظه موقت</div> },
      { path: 'reports', element: <div className="text-center text-primary">گزارش‌ها</div> },
      // Legacy routes for backward compatibility
      { path: 'addMovie', element: <AddMovie /> },
      { path: 'addSerie', element: <AddSeries /> },
      { path: 'addTrailer', element: <AddTrailer /> },
      { path: 'addNews', element: <News /> },
      { path: 'User-Management', element: <Users /> },
      { path: 'Series-Management', element: <Movie_Series /> },
      { path: 'Movies-Management', element: <Movie_mange /> },
      { path: 'Movies-Management/:userId', element: <EditMovie /> },
      { path: 'newCollection', element: <Collection /> },
      { path: 'Comments-Management', element: <Comments /> },
      { path: 'Plans', element: <Plans_Admin /> },
      { path: 'IMDB', element: <IMDB /> },
      {
        path: 'setting/*', 
        element: <Settings />, 
        children: [
          { path: '', element: <Home_Setting /> },
          { path: 'Home', element: <Home_Setting /> },
          { path: 'Movie', element: <div className="text-center text-primary">تنظیمات فیلم</div> },
          { path: 'Series', element: <div className="text-center text-primary">تنظیمات سریال</div> },
          { path: 'Slider', element: <Slider /> },
          { path: 'Box-Office', element: <Box_ofiice /> },
          { path: 'other', element: <Other /> },
          { path: 'Top250', element: <Top250 /> }
        ]
      }
    ]
  },
  { path: '/User', element: <div className="text-center text-white">پنل کاربری</div> },
  { path: '*', element: <div className="error-404">صفحه مورد نظر یافت نشد - 404</div> }
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
