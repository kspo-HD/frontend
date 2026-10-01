import { Link } from 'react-router-dom';

const features = [
  {
    title: '전국 시설 지도',
    desc: '전국 5만여 개 피트니스 시설의 위치, 업종, 운영 상태를 지도에서 한눈에 확인하세요.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2552FE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
        <line x1="9" y1="3" x2="9" y2="18"/>
        <line x1="15" y1="6" x2="15" y2="21"/>
      </svg>
    ),
  },
  {
    title: '창업 입지 분석',
    desc: '원하는 위치와 반경을 설정하면 경쟁 강도, 폐업률, 공공시설 압박 등을 종합한 입지 점수를 제공합니다.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2552FE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  {
    title: '공공 데이터 환원',
    desc: '국민체육진흥공단·체육시설업 등록 데이터를 정제하여 누구나 활용할 수 있도록 공개합니다.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2552FE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
];

const stats = [
  { value: '12,847', label: '등록 운동시설' },
  { value: '17개', label: '광역시·도 전체' },
  { value: '42,000+', label: '공개 운동 데이터 건수' },
];

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F4F6FB' }}>
      {/* Nav */}
      <header style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.9)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight" style={{ color: '#2552FE' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            FitMap
          </div>
          <div className="flex items-center gap-6">
            <Link to="/map" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">지도보기</Link>
            <Link to="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">대시보드</Link>
            <Link
              to="/login"
              style={{ background: '#2552FE', color: '#fff', padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600 }}
              className="hover:opacity-90 transition-opacity"
            >
              시작하기
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 py-24 gap-6">
        <span style={{ background: '#EEF2FF', color: '#2552FE', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
          피트니스 창업자를 위한 데이터
        </span>
        <h1 className="font-bold leading-tight max-w-2xl" style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', color: '#111827', letterSpacing: '-0.5px' }}>
          내 창업 지역에 경쟁 시설이<br />얼마나 있을까?
        </h1>
        <p className="text-base max-w-xl leading-relaxed" style={{ color: '#4B5563' }}>
          전국 피트니스 시설 데이터 기반으로 입지를 분석하고,<br />
          AI + 공공 데이터로 창업 점수를 산정해 드립니다.
        </p>
        <div className="flex gap-3 mt-2 flex-wrap justify-center">
          <Link
            to="/map"
            style={{ background: '#2552FE', color: '#fff', padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 600 }}
            className="hover:opacity-90 transition-opacity"
          >
            지도로 시설 탐색
          </Link>
          <Link
            to="/login"
            style={{ background: '#fff', color: '#2552FE', padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 600, border: '1.5px solid #2552FE' }}
            className="hover:bg-[#EEF2FF] transition-colors"
          >
            창업분석 시작하기
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="glass-card p-6 text-center">
              <div className="text-3xl font-bold" style={{ color: '#2552FE', letterSpacing: '-0.5px' }}>{s.value}</div>
              <div className="text-sm mt-1" style={{ color: '#9CA3AF' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <h2 className="text-center text-2xl font-bold mb-10" style={{ color: '#111827', letterSpacing: '-0.3px' }}>주요 기능</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="glass-card p-6">
              <div className="mb-4 p-2.5 rounded-xl inline-flex" style={{ background: '#EEF2FF' }}>
                {f.icon}
              </div>
              <h3 className="font-semibold mb-2 text-base" style={{ color: '#111827' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto glass-card p-10 text-center" style={{ background: 'linear-gradient(135deg, #2552FE 0%, #1738B5 100%)', border: 'none' }}>
          <h2 className="text-2xl font-bold text-white mb-3">지금 바로 시작해보세요</h2>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.75)' }}>소셜 로그인 하나로 바로 입지 분석을 받을 수 있어요.</p>
          <Link
            to="/login"
            style={{ background: '#fff', color: '#2552FE', padding: '12px 28px', borderRadius: 12, fontSize: 14, fontWeight: 700, display: 'inline-block' }}
            className="hover:opacity-90 transition-opacity"
          >
            무료로 시작하기
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-sm mt-auto" style={{ borderTop: '1px solid #E5E7EB', color: '#9CA3AF' }}>
        <span className="font-semibold mr-2" style={{ color: '#2552FE' }}>FitMap</span>
        피트니스 창업 입지 분석 서비스 · 데이터 출처: 국민체육진흥공단, 체육시설업 공공데이터
      </footer>
    </div>
  );
}
