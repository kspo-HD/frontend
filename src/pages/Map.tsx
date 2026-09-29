import { useState } from 'react';
import Navbar from '../components/Navbar';

const facilityTypes = ['전체 (당구장, 실내운동장 등)', '헬스장 / PT 스튜디오', '수영장', '당구장', '배드민턴장', '요가·필라테스'];
const regions = ['전국', '서울', '경기', '부산', '인천', '대구', '광주', '대전'];
const publicTypes = ['구분 없음', '공공', '사설'];

const gradColors = ['#4575B4', '#74ADD1', '#ABD9E9', '#FEE090', '#F46D43', '#D73027'];

export default function Map() {
  const [facilityType] = useState(facilityTypes[0]);
  const [region] = useState(regions[0]);
  const [publicType] = useState(publicTypes[0]);
  const [viewMode, setViewMode] = useState<'heatmap' | 'marker'>('heatmap');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[280px] shrink-0 bg-white border-r border-gray-200 flex flex-col gap-4 p-5">
          <h2 className="text-sm font-bold text-gray-900">필터</h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500">시설 종류</label>
            <div className="h-9 bg-gray-50 border border-gray-200 flex items-center px-3 gap-2">
              <span className="flex-1 text-[13px] text-gray-900 truncate">{facilityType}</span>
              <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500">지역</label>
            <div className="h-9 bg-gray-50 border border-gray-200 flex items-center px-3 gap-2">
              <span className="flex-1 text-[13px] text-gray-900">{region}</span>
              <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500">공공/사설</label>
            <div className="h-9 bg-gray-50 border border-gray-200 flex items-center px-3 gap-2">
              <span className="flex-1 text-[13px] text-gray-900">{publicType}</span>
              <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <hr className="border-gray-200" />

          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-500">포화도 범례</span>
            <div className="flex h-3 overflow-hidden">
              {gradColors.map((c) => (
                <div key={c} className="flex-1" style={{ backgroundColor: c }} />
              ))}
            </div>
            <div className="flex justify-between">
              <span className="text-[11px] text-gray-400">낮음</span>
              <span className="text-[11px] text-gray-400">높음</span>
            </div>
          </div>

          <span className="text-xs text-[#3B6FD4] mt-auto">검색 결과: 12,847개 시설</span>
        </aside>

        {/* Map area */}
        <div className="flex-1 relative bg-[#EDE8DF] overflow-hidden">
          {/* Korea map placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-[560px] h-[620px]">
              {/* Sea */}
              <div className="absolute inset-0 bg-[#C8DCE8]" />
              {/* Land */}
              <div className="absolute left-[25%] top-[10%] w-[44%] h-[60%] bg-[#EAE3D4]" />
              {/* Heatmaps */}
              <div className="absolute left-[26%] top-[17%] w-[18%] h-[14%] rounded-full bg-[#FF3D3D] opacity-30" />
              <div className="absolute left-[55%] top-[57%] w-[11%] h-[8%] rounded-full bg-[#FF8C00] opacity-28" />
              <div className="absolute left-[50%] top-[43%] w-[9%] h-[7%] rounded-full bg-[#FFC300] opacity-25" />
              <div className="absolute left-[40%] top-[38%] w-[8%] h-[6%] rounded-full bg-[#FFC300] opacity-22" />
              <div className="absolute left-[34%] top-[50%] w-[7%] h-[6%] rounded-full bg-[#4CADE0] opacity-22" />
              {/* Jeju */}
              <div className="absolute left-[37%] top-[84%] w-[8%] h-[5%] rounded-full bg-[#D8D0C0]" />
              {/* City dots */}
              <div className="absolute left-[27%] top-[20%] w-2.5 h-2.5 rounded-full bg-white border-2 border-[#CC4040]" />
              <div className="absolute left-[57%] top-[59%] w-2 h-2 rounded-full bg-white border-2 border-[#CC7000]" />
              {/* Labels */}
              <span className="absolute left-[27%] top-[17%] text-[11px] font-bold text-gray-700">서울</span>
              <span className="absolute left-[58%] top-[57%] text-[10px] font-semibold text-gray-500">부산</span>
              <span className="absolute left-[52%] top-[42%] text-[10px] font-semibold text-gray-500">대구</span>
              <span className="absolute left-[40%] top-[37%] text-[10px] font-semibold text-gray-500">대전</span>
              <span className="absolute left-[33%] top-[49%] text-[10px] font-semibold text-gray-500">광주</span>
              <span className="absolute left-[26%] top-[23%] text-[9px] font-medium text-gray-500">인천</span>
              <span className="absolute left-[38%] top-[84%] text-[9px] font-medium text-gray-500">제주</span>
            </div>
          </div>

          {/* View toggle */}
          <div className="absolute top-5 left-5 flex rounded-lg overflow-hidden border border-[#DDD] shadow-sm">
            <button
              onClick={() => setViewMode('heatmap')}
              className={`px-3.5 py-2 text-xs font-semibold transition-colors ${viewMode === 'heatmap' ? 'bg-[#3B6FD4] text-white' : 'bg-white text-gray-600'}`}
            >
              히트맵
            </button>
            <button
              onClick={() => setViewMode('marker')}
              className={`px-3.5 py-2 text-xs font-medium transition-colors ${viewMode === 'marker' ? 'bg-[#3B6FD4] text-white' : 'bg-white text-gray-600'}`}
            >
              마커
            </button>
          </div>

          {/* Tooltip */}
          <div className="absolute top-[90px] left-[380px] bg-white rounded-xl border border-gray-200 shadow-md p-3 min-w-[220px]">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[13px] font-bold text-gray-900">서울 마포구 · 상암동</span>
              <span className="text-[11px] font-semibold text-[#D45A00] bg-[#FFEDE0] px-2 py-0.5 rounded">포화</span>
            </div>
            {[
              ['반경 1km 시설 수', '39개'],
              ['폐업률', '18.4%'],
              ['공공시설 비율', '12%'],
              ['입지 점수', '42 / 100'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-0.5">
                <span className="text-[11px] text-gray-500">{k}</span>
                <span className="text-[11px] font-semibold text-gray-900">{v}</span>
              </div>
            ))}
          </div>

          {/* Zoom controls */}
          <div className="absolute right-5 top-1/2 -translate-y-1/2 bg-white border border-[#DDD] rounded-lg shadow-sm flex flex-col">
            <button className="px-3 py-2 text-base font-light text-gray-700 hover:bg-gray-50">+</button>
            <div className="h-px bg-gray-200" />
            <button className="px-3 py-2 text-base font-light text-gray-700 hover:bg-gray-50">−</button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-5 right-16 bg-white border border-[#DDD] rounded-lg shadow-sm p-2.5 flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold text-gray-900">시설 밀도</span>
            <div className="flex h-2.5 rounded overflow-hidden w-40">
              {['#4CADE0', '#7BC8A4', '#FFC300', '#FF8C00', '#FF3D3D'].map((c) => (
                <div key={c} className="flex-1" style={{ backgroundColor: c }} />
              ))}
            </div>
            <div className="flex justify-between w-40">
              <span className="text-[9px] text-gray-400">낮음</span>
              <span className="text-[9px] text-gray-400">높음</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
