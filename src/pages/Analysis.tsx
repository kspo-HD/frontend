import { useState } from 'react';
import Navbar from '../components/Navbar';

const categories = [
  '헬스장 / PT 스튜디오',
  '클라이밍 / 볼더링',
  '수영장',
  '필라테스 스튜디오',
  '요가 스튜디오',
  '복싱 / 격투기',
  '기타 피트니스 시설',
];

const radii = ['500m', '1km', '3km', '5km'];

export default function Analysis() {
  const [category, setCategory] = useState(categories[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sido, setSido] = useState('');
  const [sigungu, setSigungu] = useState('');
  const [radius, setRadius] = useState('1km');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="bg-white border-b border-gray-200 px-16 py-8">
        <h1 className="text-2xl font-bold text-gray-900">창업 입지 분석</h1>
        <p className="text-sm text-gray-500 mt-2">
          업종과 지역을 선택하면 경쟁 지수·수요 추정·입지 점수 리포트를 제공합니다
        </p>
      </div>

      <div className="flex-1 flex gap-6 px-16 py-8">
        {/* Form panel */}
        <div className="w-[400px] shrink-0 bg-white border border-gray-200 p-8 flex flex-col gap-6">
          <h2 className="text-base font-bold text-gray-900">분석 조건 입력</h2>

          {/* 업종 */}
          <div className="flex flex-col gap-1.5 relative">
            <label className="text-[13px] font-bold text-gray-900">업종 선택</label>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full h-11 bg-[#EFF6FF] border border-[#3B6FD4] rounded px-3.5 flex items-center gap-2"
            >
              <span className="flex-1 text-left text-[13px] font-bold text-[#1E3A8A]">{category}</span>
              <svg className="w-4 h-4 text-[#3B6FD4] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={dropdownOpen ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute top-full left-0 w-full bg-white border border-[#3B6FD4] rounded shadow-md z-10 mt-0.5">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCategory(c); setDropdownOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 border-b border-gray-100 text-left hover:bg-gray-50 ${c === category ? 'bg-[#EFF6FF]' : 'bg-white'}`}
                  >
                    <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 ${c === category ? 'bg-[#3B6FD4]' : 'bg-gray-200'}`}>
                      {c === category && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-[13px] ${c === category ? 'font-bold text-[#1E3A8A]' : 'text-gray-900'}`}>{c}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 광역시·도 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-gray-900">광역시·도</label>
            <div className="h-11 bg-gray-50 border border-gray-200 px-3.5 flex items-center">
              <input
                value={sido}
                onChange={(e) => setSido(e.target.value)}
                placeholder="선택 — 예: 서울특별시"
                className="flex-1 bg-transparent text-[13px] text-gray-900 placeholder:text-gray-400 outline-none"
              />
            </div>
          </div>

          {/* 시·군·구 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-gray-900">시·군·구</label>
            <div className="h-11 bg-gray-50 border border-gray-200 px-3.5 flex items-center">
              <input
                value={sigungu}
                onChange={(e) => setSigungu(e.target.value)}
                placeholder="선택 — 예: 강남구"
                disabled={!sido}
                className="flex-1 bg-transparent text-[13px] text-gray-900 placeholder:text-gray-400 outline-none disabled:cursor-not-allowed"
              />
            </div>
            <span className="text-[11px] text-gray-400">상위 지역 선택 후 활성화됩니다</span>
          </div>

          {/* 분석 반경 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-gray-900">분석 반경</label>
            <div className="h-11 bg-gray-100 border border-gray-200 rounded flex overflow-hidden">
              {radii.map((r) => (
                <button
                  key={r}
                  onClick={() => setRadius(r)}
                  className={`flex-1 h-full flex items-center justify-center text-[13px] transition-colors ${
                    radius === r
                      ? 'bg-white border border-[#3B6FD4] text-[#3B6FD4] font-bold rounded'
                      : 'text-gray-500'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-gray-400">중심점 기준 원형 반경 — 1km 추천 (도심 기준)</span>
          </div>

          <button className="w-full h-12 bg-[#3B6FD4] text-white text-[15px] font-bold flex items-center justify-center hover:bg-[#2e5ec0] transition-colors mt-2">
            입지 점수 분석 시작
          </button>
        </div>

        {/* Preview panel */}
        <div className="flex-1 flex flex-col gap-6">
          <p className="text-xs text-gray-400">조건을 입력하면 아래 결과가 실시간으로 업데이트됩니다</p>

          <div className="grid grid-cols-3 gap-4">
            {[
              { title: '경쟁 시설 수', value: '–', sub: `반경 ${radius} 내` },
              { title: '포화도 지수', value: '–', sub: '0~100, 낮을수록 기회', accent: true },
              { title: '입지 점수', value: '–', sub: '100점 만점' },
            ].map((c) => (
              <div key={c.title} className="bg-white border border-gray-200 p-5 flex flex-col gap-1.5">
                <span className="text-xs text-gray-400">{c.title}</span>
                <span className={`text-[28px] font-bold ${c.accent ? 'text-[#3B6FD4]' : 'text-gray-900'}`}>{c.value}</span>
                <span className="text-[11px] text-gray-400">{c.sub}</span>
              </div>
            ))}
          </div>

          <div className="flex-1 bg-white border border-gray-200 flex flex-col items-center justify-center gap-3 min-h-[300px]">
            <svg className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-sm text-gray-400">분석 결과 차트</span>
            <span className="text-xs text-gray-400">조건 입력 후 경쟁 시설 분포 차트가 표시됩니다</span>
          </div>
        </div>
      </div>
    </div>
  );
}
