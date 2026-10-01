import Sidebar from '../components/Sidebar';

const DATASETS = [
  {
    name: '전국 체육시설업 신고 현황',
    org: '국민체육진흥공단 (KSPO) · SFMS',
    date: '2026년 7월 기준',
    description: '헬스장·무도장·수영장 등 민간 스포츠시설 등록·폐업 현황. 경쟁 강도 및 폐업률 산출에 사용.',
    count: '~41,000건',
    category: '체력단련장업 · 체육도장업 · 체육교습업',
    color: '#2552FE',
    bg: '#EEF2FF',
    icon: 'db',
  },
  {
    name: '전국 공공시설 개방 정보',
    org: '행정안전부 · 각 지자체',
    date: '2026년 6월 기준',
    description: '공원·공공체육관·학교 등 공공개방 시설 위치 및 운영 정보. 공공시설 경쟁 압력 지표에 활용.',
    count: '~7,300건',
    category: '공공개방시설',
    color: '#059669',
    bg: '#E1F8E8',
    icon: 'db',
  },
  {
    name: '행정동별 성별·연령별 주민등록 인구',
    org: '행정안전부',
    date: '2026년 8월 기준',
    description: '행정동 단위 성별·연령별 주민등록 인구. 시군구로 집계하여 배후 수요(20~49세) 추정에 활용.',
    count: '255개 시군구',
    category: '0~110세 연령별 · 시군구 집계',
    color: '#7C3AED',
    bg: '#F3E8FF',
    icon: 'people',
  },
  {
    name: '행정동별 1인 가구 현황',
    org: '행정안전부',
    date: '2026년 8월 기준',
    description: '시도별 20·30·40대 1인 가구 수. 피트니스 핵심 수요층 추정 지표.',
    count: '17개 시도',
    category: '20대 · 30대 · 40대 1인 가구',
    color: '#0891B2',
    bg: '#E0F2FE',
    icon: 'people',
  },
  {
    name: '상업용 부동산 층별 임대료',
    org: '국토교통부 (한국부동산원 임대동향)',
    date: '2026년 2분기 기준',
    description: '집합 상가 1층 기준 시도별 평균 월 임대료(천원/㎡). 창업 비용 추정 및 예산 분석에 활용.',
    count: '17개 시도',
    category: '1층 집합상가 · 2024 Q3 ~ 2026 Q2',
    color: '#D97706',
    bg: '#FFFBEB',
    icon: 'building',
  },
  {
    name: '지역사회 건강통계 (2025)',
    org: '질병관리청',
    date: '2025년 조사 기준',
    description: '시군구별 유산소운동 실천율·걷기 실천율·비만율. 잠재 고객 건강 관심도 및 피트니스 수요 지표.',
    count: '250개 시군구',
    category: '운동 실천율 · 비만율',
    color: '#EA580C',
    bg: '#FFF7ED',
    icon: 'health',
  },
  {
    name: '전국 지하철역 위치 정보',
    org: '국토교통부 (공공데이터포털 API)',
    date: '2026년 기준',
    description: '전국 지하철·도시철도 역사 명칭·노선·위경도. 접근성 및 유동인구 지표 산출에 활용.',
    count: '1,108개 역사',
    category: '수도권 · 광역시 도시철도',
    color: '#6B7280',
    bg: '#F3F4F6',
    icon: 'train',
  },
];

function Icon({ type, color }: { type: string; color: string }) {
  if (type === 'people') return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
  if (type === 'building') return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  );
  if (type === 'health') return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  );
  if (type === 'train') return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="16" rx="2"/>
      <path d="M9 19l-2 3"/><path d="M15 19l2 3"/>
      <line x1="4" y1="11" x2="20" y2="11"/>
      <line x1="9" y1="7" x2="9" y2="11"/><line x1="15" y1="7" x2="15" y2="11"/>
    </svg>
  );
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/>
      <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/>
      <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6"/>
    </svg>
  );
}

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

          <div style={{ background: '#EEF2FF', border: '1.5px solid #C7D2FE', borderRadius: 16, padding: '18px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: '전체 시설', value: '51,334개' },
              { label: '행정구역 건강통계', value: '250개' },
              { label: '지하철역', value: '1,108개' },
              { label: '공공데이터 출처', value: '7종' },
            ].map(m => (
              <div key={m.label} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 20, fontWeight: 800, color: '#1E3A8A', letterSpacing: '-0.5px' }}>{m.value}</p>
                <p style={{ fontSize: 12, color: '#4B5563', marginTop: 2 }}>{m.label}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {DATASETS.map((d) => (
              <div key={d.name} className="glass-card" style={{ padding: '18px 22px', display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: d.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon type={d.icon} color={d.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{d.name}</h3>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: d.bg, color: d.color, whiteSpace: 'nowrap' }}>{d.count}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
                    <p style={{ fontSize: 12, color: '#6B7280' }}>{d.org}</p>
                    <p style={{ fontSize: 12, color: '#9CA3AF' }}>· {d.date}</p>
                  </div>
                  <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.6 }}>{d.description}</p>
                  <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 5 }}>분류 · {d.category}</p>
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center', paddingBottom: 8 }}>
            데이터는 공공데이터포털(data.go.kr) 및 각 기관 공개 API·파일을 통해 수집·정제하였습니다.
          </p>
        </div>
      </main>
    </div>
  );
}
