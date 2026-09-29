import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [interest, setInterest] = useState('');
  const [region, setRegion] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white border border-gray-200 w-full max-w-[520px] p-12 flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-bold text-gray-900">피트니스 창업자로 시작하기</h1>
            <p className="text-[13px] text-gray-500 leading-relaxed">
              헬스장·PT 스튜디오·클라이밍 등 피트니스 시설 창업을 준비 중인 분만 가입할 수 있습니다.
            </p>
          </div>

          {/* 유형 선택 - 창업자만 */}
          <div className="flex gap-3">
            <div className="flex-1 bg-[#EFF6FF] border-2 border-[#3B6FD4] p-4 flex flex-col items-center gap-2">
              <span className="text-2xl">🏢</span>
              <span className="text-[13px] font-bold text-[#3B6FD4]">사업자</span>
              <span className="text-[11px] text-gray-400 text-center leading-relaxed">
                창업 분석·시설 관리{'\n'}입지 점수 및 운영 통계
              </span>
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-gray-900">이름</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="실명 입력"
              className="h-11 bg-gray-50 border border-gray-200 px-3.5 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#3B6FD4] focus:border-transparent"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-gray-900">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 주소"
              className="h-11 bg-gray-50 border border-gray-200 px-3.5 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#3B6FD4] focus:border-transparent"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-gray-900">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8자 이상, 영문+숫자"
              className="h-11 bg-gray-50 border border-gray-200 px-3.5 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#3B6FD4] focus:border-transparent"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-gray-900">비밀번호 확인</label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="비밀번호 재입력"
              className="h-11 bg-gray-50 border border-gray-200 px-3.5 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#3B6FD4] focus:border-transparent"
            />
          </div>

          {/* 추가 정보 */}
          <div className="bg-gray-50 p-4 flex flex-col gap-4">
            <span className="text-xs font-bold text-gray-400">추가 정보 (선택)</span>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-gray-900">관심 업종</label>
              <input
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                placeholder="예: 당구장"
                className="h-11 bg-white border border-gray-200 px-3.5 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#3B6FD4] focus:border-transparent"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-gray-900">분석 희망 지역</label>
              <input
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="예: 서울특별시 강남구"
                className="h-11 bg-white border border-gray-200 px-3.5 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#3B6FD4] focus:border-transparent"
              />
            </div>
          </div>

          <button className="w-full h-12 bg-[#3B6FD4] text-white text-[15px] font-bold hover:bg-[#2e5ec0] transition-colors">
            가입 완료
          </button>

          <div className="flex items-center justify-center gap-1.5">
            <span className="text-[13px] text-gray-400">이미 계정이 있으신가요?</span>
            <Link to="/login" className="text-[13px] font-bold text-[#3B6FD4] hover:underline">
              로그인
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
