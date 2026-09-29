import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Login() {
  const [tab, setTab] = useState<'founder' | 'general'>('founder');

  const handleKakao = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/auth/oauth2/kakao/authorize`;
  };

  const handleGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/auth/oauth2/google/authorize`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full max-w-md p-8">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">로그인</h1>

          {/* Tab */}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden mb-6">
            <button
              onClick={() => setTab('founder')}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                tab === 'founder' ? 'bg-[#3B6FD4] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              창업자
            </button>
            <button
              onClick={() => setTab('general')}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                tab === 'general' ? 'bg-[#3B6FD4] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              일반 회원
            </button>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">이메일</label>
              <input
                type="email"
                placeholder="이메일을 입력하세요"
                className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B6FD4] focus:border-transparent"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">비밀번호</label>
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B6FD4] focus:border-transparent"
              />
            </div>
            <div className="text-right">
              <button className="text-xs text-gray-400 hover:text-gray-600">비밀번호를 잊으셨나요?</button>
            </div>
            <button className="bg-[#3B6FD4] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#2e5ec0] transition-colors">
              로그인
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">또는</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleKakao}
              className="flex items-center justify-center gap-2 bg-[#FEE500] text-[#191919] py-3 rounded-lg text-sm font-medium hover:bg-[#f0d900] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M9 1.5C4.86 1.5 1.5 4.16 1.5 7.43c0 2.07 1.3 3.88 3.26 4.95L3.9 15.3a.28.28 0 0 0 .4.31l3.66-2.44A8.6 8.6 0 0 0 9 13.36c4.14 0 7.5-2.66 7.5-5.93S13.14 1.5 9 1.5Z" fill="#191919"/>
              </svg>
              카카오로 로그인
            </button>
            <button
              onClick={handleGoogle}
              className="flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
              </svg>
              Google로 로그인
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            아직 계정이 없으신가요?{' '}
            <Link to="/signup" className="text-[#3B6FD4] hover:underline">회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
