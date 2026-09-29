import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

import Landing from '../pages/Landing';
import MapPage from '../pages/Map';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Home from '../pages/Home';
import Analysis from '../pages/Analysis';
import Report from '../pages/Report';
import Payment from '../pages/Payment';
import Competitors from '../pages/Competitors';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
}

export const router = createBrowserRouter([
  // 공개 영역
  { path: '/', element: <Landing /> },
  { path: '/map', element: <MapPage /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },

  // 창업자 포털 (인증 필요)
  { path: '/home', element: <PrivateRoute><Home /></PrivateRoute> },
  { path: '/analysis', element: <PrivateRoute><Analysis /></PrivateRoute> },
  { path: '/reports/:id', element: <PrivateRoute><Report /></PrivateRoute> },
  { path: '/payment/:id', element: <PrivateRoute><Payment /></PrivateRoute> },
  { path: '/reports/:id/competitors', element: <PrivateRoute><Competitors /></PrivateRoute> },
]);
