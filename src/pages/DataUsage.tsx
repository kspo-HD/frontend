import Sidebar from '../components/Sidebar';

const DATASETS = [
  {
    name: '전국 스포츠시설업 신고 현황',
    org: '국민체육진흥공단 (KSPO)',
    description: '헬스장·무도장·수영장 등 민간 스포츠시설의 등록·폐업 현황. 입지 분석 경쟁 강도·폐업률 산출에 사용.',
    count: '41,000+건',
    category: '체력단련장업 · 체육도장업 · 체육교습업',
    color: '#2552FE',
    bg: '#EEF2FF',
  },
  {
    name: '전국 공공체육시설 개방 정보',
    org: '문화체육관광부 · 각 지자체',
    description: '학교·공공체육관 등 공공개방 스포츠시설 위치 및 운영 정보. 공공시설 경쟁 압력 지표 산출에 사용.',
    count: '10,000+건',
    category: '공공개방시설',
    color: '#059669',
    bg: '#E1F8E8',
  },
  {
    name: '행정구역별 인구 통계',
    org: '통계청 (KOSIS)',
    description: '시도·시군구 단위 인구 데이터. 입지 점수 산출 시 배후 수요 추정 기반 데이터.',
    count: '255개 행정구역',
    category: '시도 · 시군구',
    color: '#7C3AED',
    bg: '#F3E8FF',
  },
  {
    name: '전국 지하철역 위치 정보',
    org: '국토교통부 · 한국철도공사 (KORAIL)',
    description: '전국 지하철·도시철도 역사 위치(위경도). 입지 분석 유동인구·접근성 지표에 활용.',
    count: '1,108개 역사',
    category: '수도권 · 광역시 도시철도',
    color: '#0891B2',
    bg: '#E0F2FE',
  },
];

export default function DataUsage() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="fm-main">
        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', letterSpacing: '-0.5px' }}>사용 데이터</h1>
            <p style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
              FitMap 입지 분석에 활용된 공공데이터 출처 목록입니다.
            </p>
          </div>

          {/* 요약 배너 */}
          <div style={{ background: '#EEF2FF', border: '1.5px solid #C7D2FE', borderRadius: 16, padding: '18px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: '전체 시설', value: '51,334개' },
              { label: '행정구역', value: '255개' },
              { label: '지하철역', value: '1,108개' },
              { label: '데이터 출처', value: '4종' },
            ].map(m => (
              <div key={m.label} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 20, fontWeight: 800, color: '#1E3A8A', letterSpacing: '-0.5px' }}>{m.value}</p>
                <p style={{ fontSize: 12, color: '#4B5563', marginTop: 2 }}>{m.label}</p>
              </div>
            ))}
          </div>

          {/* 데이터 카드 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {DATASETS.map((d) => (
              <div key={d.name} className="glass-card" style={{ padding: '20px 24px', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: d.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={d.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6"/>
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{d.name}</h3>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: d.bg, color: d.color }}>{d.count}</span>
                  </div>
                  <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>{d.org}</p>
                  <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.6 }}>{d.description}</p>
                  <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6 }}>분류 · {d.category}</p>
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center', paddingBottom: 8 }}>
            데이터는 공공데이터포털(data.go.kr) 및 각 기관 API를 통해 수집·정제하였습니다.
          </p>
        </div>
      </main>
    </div>
  );
}
