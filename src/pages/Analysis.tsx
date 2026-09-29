import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import client from '../api/client';

declare global { interface Window { kakao: any; } }

const CATEGORIES = [
  { label: '헬스장 / 체력단련장', value: '체력단련장업' },
  { label: '무도장 (태권도·검도 등)', value: '체육도장업' },
  { label: '수영장 / 교습 시설', value: '체육교습업' },
  { label: '공공 체육시설', value: '공공개방시설' },
];

const SIDOS = [
  '서울특별시', '경기도', '부산광역시', '인천광역시', '대구광역시',
  '광주광역시', '대전광역시', '울산광역시', '세종특별자치시',
  '강원특별자치도', '충청북도', '충청남도', '전북특별자치도',
  '전라남도', '경상북도', '경상남도', '제주특별자치도',
];

const RADIUS_OPTIONS = [
  { label: '500m', value: 500 },
  { label: '1km', value: 1000 },
  { label: '3km', value: 3000 },
  { label: '5km', value: 5000 },
];

function geocode(address: string): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!window.kakao?.maps?.services) {
      reject(new Error('카카오맵 서비스가 준비되지 않았습니다'));
      return;
    }
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
        resolve({ lat: parseFloat(result[0].y), lng: parseFloat(result[0].x) });
      } else {
        reject(new Error('주소를 찾을 수 없습니다. 시·군·구를 다시 확인해주세요.'));
      }
    });
  });
}

export default function Analysis() {
  const navigate = useNavigate();
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sido, setSido] = useState('');
  const [sidoOpen, setSidoOpen] = useState(false);
  const [sigungu, setSigungu] = useState('');
  const [radius, setRadius] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedCategory = CATEGORIES.find(c => c.value === category)!;

  const handleSubmit = async () => {
    if (!sido || !sigungu.trim()) {
      setError('광역시·도와 시·군·구를 모두 입력해주세요.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const address = `${sido} ${sigungu}`;
      const { lat, lng } = await geocode(address);
      const res = await client.post('/api/v1/analyses', { category, lat, lng, radiusM: radius, address });
      navigate(`/reports/${res.data.reportId}`);
    } catch (e: any) {
      setError(e.message ?? '분석 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="bg-white border-b border-gray-200 px-16 py-8">
        <h1 className="text-2xl font-bold text-gray-900">창업 입지 분석</h1>
        <p className="text-sm text-gray-500 mt-2">
          업종과 지역을 선택하면 경쟁 지수·폐업률·입지 점수 리포트를 제공합니다
        </p>
      </div>

      <div className="flex-1 flex gap-6 px-16 py-8">
        {/* Form */}
        <div className="w-[400px] shrink-0 bg-white border border-gray-200 p-8 flex flex-col gap-6">
          <h2 className="text-base font-bold text-gray-900">분석 조건 입력</h2>

          {/* 업종 */}
          <div className="flex flex-col gap-1.5 relative">
            <label className="text-[13px] font-bold text-gray-900">업종 선택</label>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full h-11 bg-[#EFF6FF] border border-[#3B6FD4] rounded px-3.5 flex items-center gap-2"
            >
              <span className="flex-1 text-left text-[13px] font-bold text-[#1E3A8A]">{selectedCategory.label}</span>
              <svg className="w-4 h-4 text-[#3B6FD4] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={dropdownOpen ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute top-full left-0 w-full bg-white border border-[#3B6FD4] rounded shadow-md z-10 mt-0.5">
                {CATEGORIES.map((c) => (
                  <button key={c.value} onClick={() => { setCategory(c.value); setDropdownOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 border-b border-gray-100 text-left hover:bg-gray-50 ${c.value === category ? 'bg-[#EFF6FF]' : ''}`}>
                    <span className={`text-[13px] ${c.value === category ? 'font-bold text-[#1E3A8A]' : 'text-gray-900'}`}>{c.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 광역시·도 */}
          <div className="flex flex-col gap-1.5 relative">
            <label className="text-[13px] font-bold text-gray-900">광역시·도</label>
            <button
              onClick={() => setSidoOpen(!sidoOpen)}
              className="w-full h-11 bg-gray-50 border border-gray-200 rounded px-3.5 flex items-center gap-2"
            >
              <span className={`flex-1 text-left text-[13px] ${sido ? 'text-gray-900' : 'text-gray-400'}`}>{sido || '선택하세요'}</span>
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidoOpen ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
              </svg>
            </button>
            {sidoOpen && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded shadow-md z-10 mt-0.5 max-h-48 overflow-y-auto">
                {SIDOS.map((s) => (
                  <button key={s} onClick={() => { setSido(s); setSidoOpen(false); setSigungu(''); }}
                    className={`w-full px-3.5 py-2.5 text-left text-[13px] border-b border-gray-100 hover:bg-gray-50 ${s === sido ? 'font-bold text-[#3B6FD4] bg-[#EFF6FF]' : 'text-gray-900'}`}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 시·군·구 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-gray-900">시·군·구</label>
            <input
              value={sigungu}
              onChange={(e) => setSigungu(e.target.value)}
              placeholder="예: 강남구"
              disabled={!sido}
              className="h-11 bg-gray-50 border border-gray-200 px-3.5 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#3B6FD4] disabled:cursor-not-allowed"
            />
          </div>

          {/* 반경 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-gray-900">분석 반경</label>
            <div className="h-11 bg-gray-100 border border-gray-200 rounded flex overflow-hidden">
              {RADIUS_OPTIONS.map((r) => (
                <button key={r.value} onClick={() => setRadius(r.value)}
                  className={`flex-1 h-full text-[13px] transition-colors ${radius === r.value ? 'bg-white border border-[#3B6FD4] text-[#3B6FD4] font-bold rounded' : 'text-gray-500'}`}>
                  {r.label}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-gray-400">중심점 기준 원형 반경 — 1km 추천 (도심 기준)</span>
          </div>

          {error && <p className="text-[13px] text-red-500">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading || !sido || !sigungu.trim()}
            className="w-full h-12 bg-[#3B6FD4] text-white text-[15px] font-bold hover:bg-[#2e5ec0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-2"
          >
            {loading ? '분석 중...' : '입지 점수 분석 시작'}
          </button>
        </div>

        {/* Preview */}
        <div className="flex-1 flex flex-col gap-6">
          <p className="text-xs text-gray-400">조건을 입력하면 리포트 페이지에서 결과를 확인할 수 있습니다</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { title: '경쟁 시설 수', sub: `반경 ${RADIUS_OPTIONS.find(r=>r.value===radius)?.label} 내` },
              { title: '폐업률', sub: '낮을수록 안정적인 시장' },
              { title: '입지 점수', sub: '100점 만점' },
            ].map((c) => (
              <div key={c.title} className="bg-white border border-gray-200 p-5 flex flex-col gap-1.5">
                <span className="text-xs text-gray-400">{c.title}</span>
                <span className="text-[28px] font-bold text-gray-300">–</span>
                <span className="text-[11px] text-gray-400">{c.sub}</span>
              </div>
            ))}
          </div>
          <div className="flex-1 bg-white border border-gray-200 flex flex-col items-center justify-center gap-3 min-h-[300px]">
            <svg className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-sm text-gray-400">분석 조건을 입력하고 시작 버튼을 눌러주세요</span>
          </div>
        </div>
      </div>
    </div>
  );
}
