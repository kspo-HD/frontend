import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate('/home', { replace: true });
  }, [isLoggedIn, navigate]);

  const handleKakao = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/auth/oauth2/kakao/authorize`;
  };

  const handleGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/auth/oauth2/google/authorize`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: '#F4F6FB' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl tracking-tight" style={{ color: '#2552FE' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            FitMap
          </Link>
        </div>

        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold" style={{ color: '#111827', letterSpacing: '-0.5px' }}>시작하기</h1>
            <p className="text-sm mt-2" style={{ color: '#6B7280' }}>
              소셜 로그인으로 바로 시작하세요.<br />
              처음이시면 자동으로 가입됩니다.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleKakao}
              className="flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: '#FEE500', color: '#191919' }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M9 1.5C4.86 1.5 1.5 4.16 1.5 7.43c0 2.07 1.3 3.88 3.26 4.95L3.9 15.3a.28.28 0 0 0 .4.31l3.66-2.44A8.6 8.6 0 0 0 9 13.36c4.14 0 7.5-2.66 7.5-5.93S13.14 1.5 9 1.5Z" fill="#191919"/>
              </svg>
              카카오로 시작하기
            </button>
            <button
              onClick={handleGoogle}
              className="flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-semibold transition-colors hover:bg-gray-50"
              style={{ background: '#fff', color: '#374151', border: '1.5px solid #E5E7EB' }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
              </svg>
              Google로 시작하기
            </button>
          </div>
        </div>

        <p className="text-center text-xs mt-5" style={{ color: '#9CA3AF' }}>
          계속하면 <Link to="/terms" className="underline" style={{ color: '#2552FE' }}>이용약관</Link>에 동의하는 것으로 간주됩니다.
        </p>
      </div>
    </div>
  );
}
