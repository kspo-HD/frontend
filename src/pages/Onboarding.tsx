import { useState } from 'react';

export default function Onboarding() {
  const [nickname, setNickname] = useState('');
  const [interest, setInterest] = useState('');
  const [region, setRegion] = useState('');

  const handleSubmit = () => {
    // TODO: POST /api/v1/auth/signup { nickname }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white border border-gray-200 w-full max-w-[480px] p-10 flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-bold text-gray-900">거의 다 됐어요!</h1>
          <p className="text-[13px] text-gray-500 leading-relaxed">
            창업 분석에 활용할 간단한 정보를 알려주세요.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-gray-900">
            닉네임 <span className="text-red-400">*</span>
          </label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="서비스에서 사용할 이름"
            className="h-11 bg-gray-50 border border-gray-200 px-3.5 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#3B6FD4] focus:border-transparent"
          />
        </div>

        <div className="bg-gray-50 p-4 flex flex-col gap-4">
          <span className="text-xs font-bold text-gray-400">추가 정보 (선택)</span>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-gray-900">관심 업종</label>
            <input
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              placeholder="예: 당구장, 헬스장"
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

        <button
          onClick={handleSubmit}
          disabled={!nickname.trim()}
          className="w-full h-12 bg-[#3B6FD4] text-white text-[15px] font-bold hover:bg-[#2e5ec0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          시작하기
        </button>
      </div>
    </div>
  );
}
