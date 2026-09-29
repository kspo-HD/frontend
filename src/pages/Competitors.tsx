import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const infoRows = [
  { label: '위도/경도', value: '37.4979° N, 127.0276° E' },
  { label: '공공시설 코드', value: '해당 없음 (사설)' },
  { label: '시설 규모', value: '소규모 (50㎡ 미만 추정)' },
  { label: '데이터 최종 확인', value: '2026-09-18 (공공데이터 포털)' },
];

const nearbyFacilities = [
  { name: '역삼 스포츠센터', type: '복합 (공공)', distance: '340m' },
  { name: '선릉 큐스포츠', type: '당구장', distance: '480m' },
  { name: '삼성동 포켓볼', type: '당구장', distance: '620m' },
];

export default function Competitors() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-16 py-3 flex items-center gap-1.5 text-xs">
        <Link to="/map" className="text-[#3B6FD4] hover:underline">전국 운동시설 지도</Link>
        <span className="text-gray-400">›</span>
        <span className="text-[#3B6FD4] cursor-pointer hover:underline">강남구</span>
        <span className="text-gray-400">›</span>
        <span className="text-gray-900">강남 당구클럽</span>
      </div>

      <div className="flex flex-1">
        {/* Left col */}
        <div className="w-[640px] shrink-0 bg-gray-50 flex flex-col gap-6 px-10 py-8">
          {/* Facility header */}
          <div className="bg-white border border-gray-200 flex flex-col gap-3 p-6">
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#3B6FD4] bg-[#EEF2FF] px-2.5 py-1">당구장</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1">사설</span>
            </div>
            <h1 className="text-[22px] font-bold text-gray-900">강남 당구클럽</h1>
            <p className="text-[13px] text-gray-500">서울특별시 강남구 역삼동 123-45</p>
          </div>

          {/* Info table */}
          <div className="bg-white border border-gray-200 flex flex-col">
            {infoRows.map((row, i) => (
              <div key={row.label} className={`flex items-center h-11 ${i > 0 ? 'border-t border-gray-200' : ''}`}>
                <div className="w-[180px] shrink-0 h-11 bg-gray-50 px-4 flex items-center">
                  <span className="text-xs font-bold text-gray-400">{row.label}</span>
                </div>
                <div className="flex-1 h-11 px-4 flex items-center">
                  <span className="text-xs text-gray-900">{row.value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA button */}
          <Link
            to="/analysis"
            className="w-full h-12 bg-[#3B6FD4] text-white flex items-center justify-center gap-2 text-sm font-bold hover:bg-[#2e5ec0] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            창업 분석에 이 시설 포함
          </Link>
        </div>

        {/* Right col */}
        <div className="flex-1 bg-white border-l border-gray-200 flex flex-col gap-6 p-8">
          <h2 className="text-sm font-bold text-gray-900">위치 지도</h2>

          {/* Map placeholder */}
          <div className="h-[250px] bg-[#E8F0F8] flex items-center justify-center relative">
            <div className="absolute w-5 h-5 rounded-full bg-[#3B6FD4]" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
            <span className="text-[13px] text-[#5A7A9A] mt-20">지도 위치 표시</span>
          </div>

          <h3 className="text-sm font-bold text-gray-900">인근 경쟁 시설 (500m 이내)</h3>

          <div className="flex flex-col gap-2">
            {nearbyFacilities.map((f) => (
              <div key={f.name} className="h-[52px] bg-gray-50 border border-gray-200 flex items-center gap-3 px-4">
                <div className="flex-1 flex flex-col gap-0.5">
                  <span className="text-[13px] font-bold text-gray-900">{f.name}</span>
                  <span className="text-[11px] text-gray-400">{f.type}</span>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{f.distance}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
