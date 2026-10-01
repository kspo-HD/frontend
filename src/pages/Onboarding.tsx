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
  '3천만원 미만', '3천만원 ~ 5천만원', '5천만원 ~ 1억원',
  '1억원 ~ 3억원', '3억원 ~ 5억원', '5억원 이상',
];

const chipStyle = (active: boolean): React.CSSProperties => ({
  padding: '8px 14px',
  fontSize: 13,
  borderRadius: 10,
  border: `1.5px solid ${active ? '#2552FE' : '#E5E7EB'}`,
  background: active ? '#EEF2FF' : '#fff',
  color: active ? '#1E3A8A' : '#374151',
  fontWeight: active ? 600 : 400,
  cursor: 'pointer',
  transition: 'all 0.15s',
});

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
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: '#F4F6FB' }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 font-bold text-xl tracking-tight" style={{ color: '#2552FE' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            FitMap
          </span>
        </div>

        <div className="glass-card" style={{ padding: 36 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', letterSpacing: '-0.5px', marginBottom: 8 }}>거의 다 됐어요!</h1>
            <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>창업 분석에 활용할 간단한 정보를 알려주세요.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* 닉네임 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                닉네임 <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="서비스에서 사용할 이름"
                style={{ height: 44, border: '1.5px solid #E5E7EB', borderRadius: 12, padding: '0 14px', fontSize: 13, color: '#111827', outline: 'none', background: '#F9FAFB' }}
                onFocus={e => (e.target.style.borderColor = '#2552FE')}
                onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
              />
            </div>

            {/* 관심 업종 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                관심 업종 <span style={{ fontSize: 12, fontWeight: 400, color: '#9CA3AF' }}>(선택)</span>
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {FACILITY_TYPES.map((t) => (
                  <button key={t.value} type="button"
                    onClick={() => setInterestCategory(interestCategory === t.value ? '' : t.value)}
                    style={chipStyle(interestCategory === t.value)}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 관심 지역 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                창업 희망 지역 <span style={{ fontSize: 12, fontWeight: 400, color: '#9CA3AF' }}>(선택)</span>
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {SIDOS.map((sido) => (
                  <button key={sido} type="button"
                    onClick={() => setInterestSido(interestSido === sido ? '' : sido)}
                    style={chipStyle(interestSido === sido)}>
                    {sido.replace('특별시', '').replace('광역시', '').replace('특별자치시', '').replace('특별자치도', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* 창업 예산 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                창업 예산 <span style={{ fontSize: 12, fontWeight: 400, color: '#9CA3AF' }}>(선택)</span>
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {BUDGET_RANGES.map((range) => (
                  <button key={range} type="button"
                    onClick={() => setBudgetRange(budgetRange === range ? '' : range)}
                    style={chipStyle(budgetRange === range)}>
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleSubmit} disabled={!nickname.trim() || loading}
              style={{ width: '100%', height: 48, background: '#2552FE', color: '#fff', borderRadius: 12, border: 'none', fontSize: 15, fontWeight: 700, cursor: !nickname.trim() || loading ? 'not-allowed' : 'pointer', opacity: !nickname.trim() || loading ? 0.4 : 1, marginTop: 4 }}>
              {loading ? '처리 중...' : '시작하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
