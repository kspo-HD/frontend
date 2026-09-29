import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import client from '../api/client';

export default function Navbar() {
  const { isLoggedIn, logout } = useAuthStore();
  const navigate = useNavigate();
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoggedIn) { setCredits(null); return; }
    client.get('/api/v1/credits/remaining')
      .then(r => setCredits(r.data.count ?? 0))
      .catch(() => {});
  }, [isLoggedIn]);

  return (
    <nav className="h-14 bg-white border-b border-gray-200 flex items-center px-6 justify-between shrink-0">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-[#3B6FD4] font-bold text-lg tracking-tight">FitMap</Link>
        <div className="flex gap-6">
          <Link to="/map" className="text-sm text-gray-600 hover:text-gray-900">지도보기</Link>
          <Link to="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">대시보드</Link>
          {isLoggedIn && (
            <Link to="/home" className="text-sm text-gray-600 hover:text-gray-900">마이페이지</Link>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {isLoggedIn && credits !== null && (
          <Link
            to="/payment"
            className="flex items-center gap-1.5 text-[12px] text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors"
          >
            <svg className="w-3.5 h-3.5 text-[#3B6FD4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            크레딧 <strong className="text-gray-900">{credits}개</strong>
          </Link>
        )}
        {isLoggedIn ? (
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            로그아웃
          </button>
        ) : (
          <Link to="/login" className="bg-[#3B6FD4] text-white text-sm px-4 py-1.5 rounded-md hover:bg-[#2e5ec0] transition-colors">
            시작하기
          </Link>
        )}
      </div>
    </nav>
  );
}
