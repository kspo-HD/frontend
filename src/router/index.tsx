import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

import Landing from '../pages/Landing';
import MapPage from '../pages/Map';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import Onboarding from '../pages/Onboarding';
import Home from '../pages/Home';
import OAuthCallback from '../pages/OAuthCallback';
import PaymentHistory from '../pages/PaymentHistory';
import Terms from '../pages/Terms';
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

  // 소셜 로그인 후 미가입자 온보딩 (signup token 쿠키 필요)
  { path: '/onboarding', element: <Onboarding /> },
  { path: '/auth/callback', element: <OAuthCallback /> },
  { path: '/terms', element: <Terms /> },

  // 창업자 포털 (인증 필요)
  { path: '/home', element: <PrivateRoute><Home /></PrivateRoute> },
  { path: '/payment-history', element: <PrivateRoute><PaymentHistory /></PrivateRoute> },
  { path: '/analysis', element: <PrivateRoute><Analysis /></PrivateRoute> },
  { path: '/reports/:id', element: <PrivateRoute><Report /></PrivateRoute> },
  { path: '/payment/:id', element: <PrivateRoute><Payment /></PrivateRoute> },
  { path: '/reports/:id/competitors', element: <PrivateRoute><Competitors /></PrivateRoute> },
]);
