import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const scoreDims = [
  { label: '경쟁 희소성', value: 65, pct: 65 },
  { label: '수요 잠재력', value: 80, pct: 80 },
  { label: '접근성', value: 70, pct: 70 },
  { label: '임대 시세', value: 74, pct: 74 },
];

const competitors = [
  { name: '강남 당구클럽', type: '당구장', distance: '210m', size: '소', public: '사설' },
  { name: '역삼 스포츠센터', type: '복합', distance: '340m', size: '대', public: '공공' },
  { name: '선릉 큐스포츠', type: '당구장', distance: '480m', size: '중', public: '사설' },
  { name: '삼성동 포켓볼', type: '당구장', distance: '620m', size: '소', public: '사설' },
  { name: '코엑스 스포츠', type: '복합', distance: '750m', size: '대', public: '사설' },
];

const insights = [
  '반경 1km 내 동종 시설 5곳 — 경쟁 수준 \'중간\'',
  '공공 시설 1곳 포함 (역삼 스포츠센터) — 가격 경쟁에 주의',
  '수요 잠재력 80점: 유동인구 밀도 높음',
  '권장: 차별화된 프리미엄 포지셔닝',
];

export default function Report() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Report header */}
      <div className="bg-white border-b border-gray-200 px-16 py-5 flex items-center gap-6">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">입지 점수 리포트</h1>
          <p className="text-[13px] text-gray-500 mt-1">
            업종: 당구장 · 지역: 서울특별시 강남구 · 반경: 1km · 분석일: 2026-09-18
          </p>
        </div>
        <button className="flex items-center gap-1.5 bg-gray-100 text-gray-500 px-4 py-2.5 text-[13px] cursor-not-allowed">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          PDF 다운로드 (잠금)
        </button>
      </div>

      <div className="flex flex-1">
        {/* Left col */}
        <div className="w-[680px] shrink-0 bg-gray-50 flex flex-col gap-6 px-10 py-8">
          {/* Score card */}
          <div className="bg-white border border-gray-200 flex items-center gap-8 px-7 py-7">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[56px] font-bold text-[#3B6FD4] leading-none">72</span>
              <span className="text-base text-gray-400">/ 100</span>
              <span className="text-[13px] text-gray-400 mt-1">★★★★☆ 양호</span>
            </div>

            {/* Blurred score dims */}
            <div className="flex-1 flex flex-col gap-3 opacity-40 blur-[6px] pointer-events-none select-none">
              <span className="text-[13px] font-bold text-gray-900">세부 점수</span>
              {scoreDims.map((d) => (
                <div key={d.label} className="flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">{d.label}</span>
                    <span className="text-xs font-bold text-gray-900">{d.value}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 w-full">
                    <div className="h-full bg-[#3B6FD4]" style={{ width: `${d.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Lock badge */}
            <div className="flex items-center gap-1.5 bg-[#FEF3C7] border border-[#F59E0B] text-[#92400E] text-xs px-3.5 py-2 self-end rounded shrink-0">
              <svg className="w-3.5 h-3.5 text-[#D97706]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              세부 점수는 결제 후 확인 가능합니다
            </div>
          </div>

          {/* Blurred competitor table */}
          <div className="bg-white border border-gray-200 opacity-30 blur-[8px] pointer-events-none select-none">
            <div className="flex items-center h-9 bg-gray-50 px-4">
              {['시설명', '종류', '거리', '규모', '공공'].map((h, i) => (
                <span key={h} className={`text-xs font-bold text-gray-400 ${i === 0 ? 'w-[200px]' : i === 1 ? 'w-[100px]' : 'w-[80px]'}`}>{h}</span>
              ))}
            </div>
            {competitors.map((c) => (
              <div key={c.name} className="flex items-center h-10 border-t border-gray-200 px-4">
                <span className="text-xs text-gray-900 w-[200px]">{c.name}</span>
                <span className="text-xs text-gray-900 w-[100px]">{c.type}</span>
                <span className="text-xs text-gray-900 w-[80px]">{c.distance}</span>
                <span className="text-xs text-gray-900 w-[80px]">{c.size}</span>
                <span className="text-xs text-gray-900 w-[80px]">{c.public}</span>
              </div>
            ))}
          </div>

          {/* Pay gate */}
          <div className="bg-white border-2 border-[#3B6FD4] rounded-xl p-8 flex flex-col items-center gap-5">
            <div className="flex flex-col items-center gap-2">
              <svg className="w-8 h-8 text-[#3B6FD4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h2 className="text-lg font-bold text-gray-900">전체 리포트 잠금 해제</h2>
              <p className="text-[13px] text-gray-500 text-center max-w-[360px] leading-relaxed">
                경쟁 시설 상세 분포, 세부 입지 점수, 경쟁 강도 분석, PDF 다운로드를 모두 열람하세요.
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full">
              {[
                '세부 점수 (경쟁 희소성·수요 잠재력·접근성·임대 시세)',
                '경쟁 시설 상세 조회 (공공/사설 구분)',
                '입지 추천 등급 + 한 줄 이유',
                'PDF 리포트 다운로드',
              ].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-[#059669] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[13px] text-gray-500">{f}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[28px] font-bold text-[#3B6FD4]">₩ 24,900</span>
              <span className="text-xs text-gray-400">3건 묶음 추천 · 건당 8,300원</span>
            </div>
            <Link
              to={`/payment/${id}`}
              className="w-full flex items-center justify-center gap-2 bg-[#3B6FD4] text-white rounded-lg py-3.5 text-[15px] font-bold hover:bg-[#2e5ec0] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              결제하고 전체 리포트 보기
            </Link>
          </div>
        </div>

        {/* Right col */}
        <div className="flex-1 bg-white border-l border-gray-200 flex flex-col gap-6 p-8">
          <h2 className="text-sm font-bold text-gray-900">경쟁 시설 분포 지도 (잠금)</h2>

          {/* Locked mini map */}
          <div className="h-[260px] bg-gradient-to-br from-[#D6E8F5] to-[#B8D4ED] flex flex-col items-center justify-center gap-2.5 blur-[10px]">
            <svg className="w-8 h-8 text-[#5A7A9A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-[14px] font-bold text-[#2D4A6A]">지도 잠금됨</p>
            <p className="text-xs text-[#5A7A9A] text-center max-w-[240px] leading-relaxed">
              결제 후 경쟁 시설 분포와<br />공공·사설 위치를 확인하세요
            </p>
          </div>

          {/* Blurred AI insights */}
          <div className="flex flex-col gap-3 opacity-35 blur-[5px] pointer-events-none select-none">
            <h3 className="text-sm font-bold text-gray-900">AI 인사이트</h3>
            {insights.map((ins) => (
              <div key={ins} className="flex gap-2">
                <span className="text-[13px] text-[#3B6FD4] shrink-0">•</span>
                <span className="text-xs text-gray-900 leading-relaxed">{ins}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
