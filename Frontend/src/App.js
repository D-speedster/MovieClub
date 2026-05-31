
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
const ThemeExample = lazy(() => import('./components/ThemeExample/ThemeExample'));

// Admin components
const AddMovie = lazy(() => import('./components/Admin/addMovie/AddMovie'));
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
const Reports = lazy(() => import('./components/Admin/Reports/Reports'));
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
  { path: '/movie/:userId', element: <Download /> },
  { path: '/Movie/:userId', element: <Download /> },
  { path: '/Movies', element: <Movies /> },
  { path: '/Series', element: <Series /> },
  { path: '/auth/register', element: <Register /> },
  { path: '/auth/login', element: <Login /> },
  {
    path: '/admin/*', 
    element: <ProtectedRoute adminOnly><Admin /></ProtectedRoute>
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
