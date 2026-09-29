import Navbar from '../components/Navbar';

const metrics = [
  { value: '42,318건', label: '총 운동 기록', sub: '누적 공개 기록' },
  { value: '186개', label: '참여 시설', sub: '전국 등록 시설' },
  { value: '23종', label: '활동 종목', sub: '등록 종목 수' },
  { value: '1,204건', label: '금주 신규', sub: '이번 주 추가분' },
];

const barData = [
  { label: '헬스·웨이트', value: 8420, maxWidth: 400 },
  { label: '수영', value: 6210, maxWidth: 295 },
  { label: '당구', value: 5830, maxWidth: 277 },
  { label: '배드민턴', value: 4950, maxWidth: 235 },
  { label: '요가·필라테스', value: 4210, maxWidth: 200 },
  { label: '탁구', value: 3680, maxWidth: 175 },
  { label: '복싱·격투', value: 2940, maxWidth: 140 },
  { label: '기타', value: 5088, maxWidth: 242 },
];

const regionData = [
  { region: '서울', facilities: 42, records: '11,230', share: '26.5%' },
  { region: '경기', facilities: 31, records: '8,640', share: '20.4%' },
  { region: '부산', facilities: 18, records: '4,910', share: '11.6%' },
  { region: '인천', facilities: 14, records: '3,820', share: '9.0%' },
  { region: '대구', facilities: 11, records: '2,950', share: '7.0%' },
  { region: '광주', facilities: 8, records: '2,100', share: '5.0%' },
  { region: '대전', facilities: 7, records: '1,840', share: '4.3%' },
  { region: '울산', facilities: 6, records: '1,620', share: '3.8%' },
  { region: '경남', facilities: 9, records: '1,580', share: '3.7%' },
  { region: '충남', facilities: 7, records: '1,200', share: '2.8%' },
];

const MAX_BAR = 400;

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="bg-white border-b border-gray-200 px-16 py-7">
        <h1 className="text-[22px] font-bold text-gray-900">공공 환원 데이터 대시보드</h1>
        <p className="text-sm text-gray-500 mt-1">
          운동시설 참여 회원의 익명 운동 기록을 집계·공개합니다 (최종 업데이트: 2026-09-18)
        </p>
      </div>

      <div className="flex-1 px-16 py-8 flex flex-col gap-6">
        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="bg-white border border-gray-200 p-5 flex flex-col gap-1">
              <span className="text-[26px] font-bold text-[#3B6FD4]">{m.value}</span>
              <span className="text-xs text-gray-900">{m.label}</span>
              <span className="text-[11px] text-gray-400">{m.sub}</span>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="flex gap-6 flex-1">
          {/* Bar chart */}
          <div className="flex-1 bg-white border border-gray-200 p-6 flex flex-col gap-4">
            <h2 className="text-sm font-bold text-gray-900">종목별 운동 기록 현황</h2>
            <div className="flex flex-col gap-2.5">
              {barData.map((d) => (
                <div key={d.label} className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-400 w-28 shrink-0">{d.label}</span>
                  <div className="flex-1 h-[18px] bg-gray-100 relative">
                    <div
                      className="absolute left-0 top-0 h-full bg-[#3B6FD4]"
                      style={{ width: `${(d.maxWidth / MAX_BAR) * 100}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-gray-400 w-12 text-right shrink-0">
                    {d.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Region table */}
          <div className="w-[400px] bg-white border border-gray-200 p-6 flex flex-col gap-4 shrink-0">
            <h2 className="text-sm font-bold text-gray-900">지역별 데이터 현황 (상위 10)</h2>
            <div>
              <div className="flex items-center h-[30px] bg-gray-50 px-2">
                <span className="text-[11px] font-bold text-gray-400 w-[140px]">지역</span>
                <span className="text-[11px] font-bold text-gray-400 w-[60px]">시설</span>
                <span className="text-[11px] font-bold text-gray-400 w-[80px]">기록</span>
                <span className="text-[11px] font-bold text-gray-400 w-[72px]">비중</span>
              </div>
              {regionData.map((r) => (
                <div key={r.region} className="flex items-center h-8 border-t border-gray-200 px-2">
                  <span className="text-[11px] text-gray-900 w-[140px]">{r.region}</span>
                  <span className="text-[11px] text-gray-900 w-[60px]">{r.facilities}</span>
                  <span className="text-[11px] text-gray-900 w-[80px]">{r.records}</span>
                  <span className="text-[11px] text-gray-900 w-[72px]">{r.share}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
