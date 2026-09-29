import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const { isLoggedIn, logout } = useAuthStore();
  const navigate = useNavigate();

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
