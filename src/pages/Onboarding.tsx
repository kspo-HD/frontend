import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const FACILITY_TYPES = [
  { value: '체력단련장', label: '헬스장 / 체력단련장' },
  { value: '태권도', label: '태권도장' },
  { value: '권투', label: '복싱 / 킥복싱' },
  { value: '검도', label: '검도장' },
  { value: '합기도', label: '합기도장' },
  { value: '유도', label: '유도장' },
  { value: '축구', label: '축구 / 풋살장' },
  { value: '배드민턴', label: '배드민턴장' },
  { value: '체육관', label: '복합 체육관' },
  { value: '복합', label: '복합 스포츠센터' },
  { value: '테니스장', label: '테니스장' },
  { value: '농구', label: '농구장' },
];

const SIDOS = [
  '서울특별시', '경기도', '부산광역시', '인천광역시',
  '대구광역시', '광주광역시', '대전광역시', '울산광역시',
  '세종특별자치시', '강원특별자치도', '충청북도', '충청남도',
  '전북특별자치도', '전라남도', '경상북도', '경상남도', '제주특별자치도',
];

const BUDGET_RANGES = [
  '3천만원 미만',
  '3천만원 ~ 5천만원',
  '5천만원 ~ 1억원',
  '1억원 ~ 3억원',
  '3억원 ~ 5억원',
  '5억원 이상',
];

export default function Onboarding() {
  const [nickname, setNickname] = useState('');
  const [interestCategory, setInterestCategory] = useState('');
  const [interestSido, setInterestSido] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const loginWithToken = useAuthStore((s) => s.loginWithToken);

  const handleSubmit = async () => {
    if (!nickname.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/signup`,
        { nickname, interestCategory, interestSido, budgetRange },
        { withCredentials: true }
      );
      const token = res.headers['authorization']?.replace('Bearer ', '');
      if (token) loginWithToken(token);
      navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white border border-gray-200 w-full max-w-[560px] p-10 flex flex-col gap-8">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-bold text-gray-900">거의 다 됐어요!</h1>
          <p className="text-[13px] text-gray-500 leading-relaxed">
            창업 분석에 활용할 간단한 정보를 알려주세요.
          </p>
        </div>

        {/* 닉네임 */}
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

        {/* 관심 업종 */}
        <div className="flex flex-col gap-2.5">
          <label className="text-[13px] font-bold text-gray-900">관심 업종 <span className="text-gray-400 font-normal">(선택)</span></label>
          <div className="flex flex-wrap gap-2">
            {FACILITY_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setInterestCategory(interestCategory === t.value ? '' : t.value)}
                className={`px-3.5 py-2 text-[13px] border transition-colors ${
                  interestCategory === t.value
                    ? 'bg-[#3B6FD4] border-[#3B6FD4] text-white font-semibold'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-[#3B6FD4] hover:text-[#3B6FD4]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 관심 지역 */}
        <div className="flex flex-col gap-2.5">
          <label className="text-[13px] font-bold text-gray-900">창업 희망 지역 <span className="text-gray-400 font-normal">(선택)</span></label>
          <div className="flex flex-wrap gap-2">
            {SIDOS.map((sido) => (
              <button
                key={sido}
                type="button"
                onClick={() => setInterestSido(interestSido === sido ? '' : sido)}
                className={`px-3.5 py-2 text-[13px] border transition-colors ${
                  interestSido === sido
                    ? 'bg-[#3B6FD4] border-[#3B6FD4] text-white font-semibold'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-[#3B6FD4] hover:text-[#3B6FD4]'
                }`}
              >
                {sido.replace('특별시', '').replace('광역시', '').replace('특별자치시', '').replace('특별자치도', '').replace('특별시', '')}
              </button>
            ))}
          </div>
        </div>

        {/* 창업 예산 */}
        <div className="flex flex-col gap-2.5">
          <label className="text-[13px] font-bold text-gray-900">창업 예산 <span className="text-gray-400 font-normal">(선택)</span></label>
          <div className="flex flex-wrap gap-2">
            {BUDGET_RANGES.map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setBudgetRange(budgetRange === range ? '' : range)}
                className={`px-3.5 py-2 text-[13px] border transition-colors ${
                  budgetRange === range
                    ? 'bg-[#3B6FD4] border-[#3B6FD4] text-white font-semibold'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-[#3B6FD4] hover:text-[#3B6FD4]'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!nickname.trim() || loading}
          className="w-full h-12 bg-[#3B6FD4] text-white text-[15px] font-bold hover:bg-[#2e5ec0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? '처리 중...' : '시작하기'}
        </button>
      </div>
    </div>
  );
}
