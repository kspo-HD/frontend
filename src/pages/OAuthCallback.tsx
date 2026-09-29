import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function OAuthCallback() {
  const loginWithToken = useAuthStore((s) => s.loginWithToken);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('access_token');
    if (token) {
      loginWithToken(token);
      navigate('/home', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [loginWithToken, navigate]);

  return null;
}
