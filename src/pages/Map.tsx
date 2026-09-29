import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';

declare global {
  interface Window {
    kakao: any;
  }
}

const facilityTypes = ['전체 (당구장, 실내운동장 등)', '헬스장 / PT 스튜디오', '수영장', '당구장', '배드민턴장', '요가·필라테스'];
const regions = ['전국', '서울', '경기', '부산', '인천', '대구', '광주', '대전'];
const publicTypes = ['구분 없음', '공공', '사설'];

const gradColors = ['#4575B4', '#74ADD1', '#ABD9E9', '#FEE090', '#F46D43', '#D73027'];

export default function Map() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [facilityType, setFacilityType] = useState(facilityTypes[0]);
  const [region, setRegion] = useState(regions[0]);
  const [publicType, setPublicType] = useState(publicTypes[0]);
  const [viewMode, setViewMode] = useState<'heatmap' | 'marker'>('heatmap');

  useEffect(() => {
    if (!mapRef.current || !window.kakao) return;

    window.kakao.maps.load(() => {
      const options = {
        center: new window.kakao.maps.LatLng(36.5, 127.5),
        level: 13,
      };
      new window.kakao.maps.Map(mapRef.current, options);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[280px] shrink-0 bg-white border-r border-gray-200 flex flex-col gap-4 p-5">
          <h2 className="text-sm font-bold text-gray-900">필터</h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500">시설 종류</label>
            <select
              value={facilityType}
              onChange={(e) => setFacilityType(e.target.value)}
              className="h-9 bg-gray-50 border border-gray-200 px-3 text-[13px] text-gray-900 outline-none"
            >
              {facilityTypes.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500">지역</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="h-9 bg-gray-50 border border-gray-200 px-3 text-[13px] text-gray-900 outline-none"
            >
              {regions.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500">공공/사설</label>
            <select
              value={publicType}
              onChange={(e) => setPublicType(e.target.value)}
              className="h-9 bg-gray-50 border border-gray-200 px-3 text-[13px] text-gray-900 outline-none"
            >
              {publicTypes.map((p) => <option key={p}>{p}</option>)}
            </select>
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
        <div className="flex-1 relative overflow-hidden">
          <div ref={mapRef} className="w-full h-full" />

          {/* View toggle */}
          <div className="absolute top-5 left-5 flex rounded-lg overflow-hidden border border-[#DDD] shadow-sm z-10">
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
        </div>
      </div>
    </div>
  );
}
