import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { createAnalysis } from '../api/reports';

declare global { interface Window { kakao: any; } }

const CATEGORIES = [
  { label: '헬스장 / 체력단련장', value: '체력단련장업' },
  { label: '무도장 (태권도·검도 등)', value: '체육도장업' },
  { label: '수영장 / 교습 시설', value: '체육교습업' },
  { label: '공공 체육시설', value: '공공개방시설' },
];

const SIDO_SIGUNGU: Record<string, string[]> = {
  '서울특별시': ['강남구','강동구','강북구','강서구','관악구','광진구','구로구','금천구','노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구','성동구','성북구','송파구','양천구','영등포구','용산구','은평구','종로구','중구','중랑구'],
  '경기도': ['가평군','고양시 덕양구','고양시 일산동구','고양시 일산서구','과천시','광명시','광주시','구리시','군포시','김포시','남양주시','동두천시','부천시','성남시 분당구','성남시 수정구','성남시 중원구','수원시 권선구','수원시 영통구','수원시 장안구','수원시 팔달구','시흥시','안산시 단원구','안산시 상록구','안성시','안양시 동안구','안양시 만안구','양주시','양평군','여주시','연천군','오산시','용인시 기흥구','용인시 수지구','용인시 처인구','의왕시','의정부시','이천시','파주시','평택시','포천시','하남시','화성시'],
  '부산광역시': ['강서구','금정구','기장군','남구','동구','동래구','부산진구','북구','사상구','사하구','서구','수영구','연제구','영도구','중구','해운대구'],
  '인천광역시': ['강화군','계양구','남동구','동구','미추홀구','부평구','서구','연수구','옹진군','중구'],
  '대구광역시': ['군위군','남구','달서구','달성군','동구','북구','서구','수성구','중구'],
  '광주광역시': ['광산구','남구','동구','북구','서구'],
  '대전광역시': ['대덕구','동구','서구','유성구','중구'],
  '울산광역시': ['남구','동구','북구','울주군','중구'],
  '세종특별자치시': ['세종시'],
  '강원특별자치도': ['강릉시','고성군','동해시','삼척시','속초시','양구군','양양군','영월군','원주시','인제군','정선군','철원군','춘천시','태백시','평창군','홍천군','화천군','횡성군'],
  '충청북도': ['괴산군','단양군','보은군','영동군','옥천군','음성군','제천시','증평군','진천군','청주시 상당구','청주시 서원구','청주시 청원구','청주시 흥덕구','충주시'],
  '충청남도': ['계룡시','공주시','금산군','논산시','당진시','보령시','부여군','서산시','서천군','아산시','예산군','천안시 동남구','천안시 서북구','청양군','태안군','홍성군'],
  '전북특별자치도': ['고창군','군산시','김제시','남원시','무주군','부안군','순창군','완주군','익산시','임실군','장수군','전주시 덕진구','전주시 완산구','정읍시','진안군'],
  '전라남도': ['강진군','고흥군','곡성군','광양시','구례군','나주시','담양군','목포시','무안군','보성군','순천시','신안군','여수시','영광군','영암군','완도군','장성군','장흥군','진도군','함평군','해남군','화순군'],
  '경상북도': ['경산시','경주시','고령군','구미시','군위군','김천시','문경시','봉화군','상주시','성주군','안동시','영덕군','영양군','영주시','영천시','예천군','울릉군','울진군','의성군','청도군','청송군','칠곡군','포항시 남구','포항시 북구'],
  '경상남도': ['거제시','거창군','고성군','김해시','남해군','밀양시','사천시','산청군','양산시','의령군','진주시','창녕군','창원시 마산합포구','창원시 마산회원구','창원시 성산구','창원시 의창구','창원시 진해구','통영시','하동군','함안군','함양군','합천군'],
  '제주특별자치도': ['서귀포시','제주시'],
};

const SIDOS = Object.keys(SIDO_SIGUNGU);

const BUDGET_OPTIONS = [
  { label: '3천만원 미만',  sub: 'PT샵·소규모 도장',  value: '3,000만원 미만' },
  { label: '3천~8천만원',   sub: '소형 헬스장·도장',   value: '3,000만원~8,000만원' },
  { label: '8천만~1.5억',  sub: '중소형 헬스장',      value: '8,000만원~1억5,000만원' },
  { label: '1.5억~3억',    sub: '중형 헬스장',        value: '1억5,000만원~3억원' },
  { label: '3억~6억',      sub: '대형 헬스장',        value: '3억원~6억원' },
  { label: '6억 이상',     sub: '특대형·수영장',       value: '6억원 이상' },
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

const dropdownStyle = (open: boolean): React.CSSProperties => ({
  width: '100%',
  height: 44,
  border: `1.5px solid ${open ? '#2552FE' : '#E5E7EB'}`,
  borderRadius: 12,
  padding: '0 14px',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  background: open ? '#EEF2FF' : '#F9FAFB',
  cursor: 'pointer',
  transition: 'all 0.15s',
});

export default function Analysis() {
  const navigate = useNavigate();
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sido, setSido] = useState('');
  const [sidoOpen, setSidoOpen] = useState(false);
  const [sigungu, setSigungu] = useState('');
  const [sigunguOpen, setSigunguOpen] = useState(false);
  const [budget, setBudget] = useState('');
  const [radius, setRadius] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedCategory = CATEGORIES.find(c => c.value === category)!;
  const radiusLabel = RADIUS_OPTIONS.find(r => r.value === radius)?.label;

  const handleSubmit = async () => {
    if (!sido || !sigungu) {
      setError('광역시·도와 시·군·구를 모두 선택해주세요.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const address = `${sido} ${sigungu}`;
      const { lat, lng } = await geocode(address);
      const res = await createAnalysis({ category, lat, lng, radiusM: radius, address, budgetRange: budget || undefined }) as any;
      navigate(`/reports/${res.reportId ?? res.id}`);
    } catch (e: any) {
      setError(e.message ?? '분석 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="fm-main">
        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
          {/* Header */}
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', letterSpacing: '-0.5px' }}>창업 입지 분석</h1>
            <p style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>업종과 지역을 선택하면 경쟁 지수·폐업률·입지 점수 리포트를 제공합니다</p>
          </div>

          <div style={{ display: 'flex', gap: 24, flex: 1, minHeight: 0 }}>
            {/* Form */}
            <div className="glass-card" style={{ width: 380, flexShrink: 0, padding: 24, display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto' }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>분석 조건 입력</h2>

              {/* 업종 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>업종 선택</label>
                <button onClick={() => setDropdownOpen(!dropdownOpen)} style={dropdownStyle(dropdownOpen)}>
                  <span style={{ flex: 1, textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#2552FE' }}>{selectedCategory.label}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2552FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={dropdownOpen ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'}/>
                  </svg>
                </button>
                {dropdownOpen && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', background: '#fff', border: '1.5px solid #2552FE', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', zIndex: 20, marginTop: 4, overflow: 'hidden' }}>
                    {CATEGORIES.map((c) => (
                      <button key={c.value} onClick={() => { setCategory(c.value); setDropdownOpen(false); }}
                        style={{ width: '100%', padding: '11px 14px', textAlign: 'left', fontSize: 13, borderBottom: '1px solid #F3F4F6', background: c.value === category ? '#EEF2FF' : '#fff', color: c.value === category ? '#2552FE' : '#111827', fontWeight: c.value === category ? 600 : 400, cursor: 'pointer' }}
                        className="hover:bg-gray-50">
                        {c.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 광역시·도 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>광역시·도</label>
                <button onClick={() => setSidoOpen(!sidoOpen)} style={dropdownStyle(sidoOpen)}>
                  <span style={{ flex: 1, textAlign: 'left', fontSize: 13, color: sido ? '#111827' : '#9CA3AF' }}>{sido || '선택하세요'}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={sidoOpen ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'}/>
                  </svg>
                </button>
                {sidoOpen && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', background: '#fff', border: '1.5px solid #E5E7EB', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', zIndex: 20, marginTop: 4, maxHeight: 200, overflowY: 'auto' }}>
                    {SIDOS.map((s) => (
                      <button key={s} onClick={() => { setSido(s); setSidoOpen(false); setSigungu(''); }}
                        style={{ width: '100%', padding: '10px 14px', textAlign: 'left', fontSize: 13, borderBottom: '1px solid #F3F4F6', background: s === sido ? '#EEF2FF' : '#fff', color: s === sido ? '#2552FE' : '#111827', fontWeight: s === sido ? 600 : 400, cursor: 'pointer' }}
                        className="hover:bg-gray-50">
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 시·군·구 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>시·군·구</label>
                <button onClick={() => { if (sido) setSigunguOpen(!sigunguOpen); }} disabled={!sido}
                  style={{ ...dropdownStyle(sigunguOpen), opacity: sido ? 1 : 0.5, cursor: sido ? 'pointer' : 'not-allowed' }}>
                  <span style={{ flex: 1, textAlign: 'left', fontSize: 13, color: sigungu ? '#111827' : '#9CA3AF' }}>{sigungu || '선택하세요'}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={sigunguOpen ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'}/>
                  </svg>
                </button>
                {sigunguOpen && sido && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', background: '#fff', border: '1.5px solid #E5E7EB', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', zIndex: 20, marginTop: 4, maxHeight: 200, overflowY: 'auto' }}>
                    {SIDO_SIGUNGU[sido]?.map((sg) => (
                      <button key={sg} onClick={() => { setSigungu(sg); setSigunguOpen(false); }}
                        style={{ width: '100%', padding: '10px 14px', textAlign: 'left', fontSize: 13, borderBottom: '1px solid #F3F4F6', background: sg === sigungu ? '#EEF2FF' : '#fff', color: sg === sigungu ? '#2552FE' : '#111827', fontWeight: sg === sigungu ? 600 : 400, cursor: 'pointer' }}
                        className="hover:bg-gray-50">
                        {sg}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 창업 예산 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                  창업 예산 <span style={{ fontSize: 11, fontWeight: 400, color: '#9CA3AF' }}>(선택)</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {BUDGET_OPTIONS.map((b) => (
                    <button key={b.value} onClick={() => setBudget(budget === b.value ? '' : b.value)}
                      style={{ padding: '10px 6px', borderRadius: 10, border: `1.5px solid ${budget === b.value ? '#2552FE' : '#E5E7EB'}`, background: budget === b.value ? '#EEF2FF' : '#F9FAFB', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: budget === b.value ? '#1E3A8A' : '#374151', lineHeight: 1.3 }}>{b.label}</div>
                      <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{b.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 반경 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>분석 반경</label>
                <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: 12, overflow: 'hidden', border: '1.5px solid #E5E7EB' }}>
                  {RADIUS_OPTIONS.map((r) => (
                    <button key={r.value} onClick={() => setRadius(r.value)}
                      style={{ flex: 1, height: 40, fontSize: 13, fontWeight: r.value === radius ? 700 : 400, color: r.value === radius ? '#2552FE' : '#6B7280', background: r.value === radius ? '#fff' : 'transparent', border: r.value === radius ? '1.5px solid #2552FE' : 'none', borderRadius: r.value === radius ? 10 : 0, cursor: 'pointer', transition: 'all 0.15s', margin: r.value === radius ? 2 : 0 }}>
                      {r.label}
                    </button>
                  ))}
                </div>
                <span style={{ fontSize: 11, color: '#9CA3AF' }}>중심점 기준 원형 반경 — 1km 추천 (도심 기준)</span>
              </div>

              {error && <p style={{ fontSize: 13, color: '#EF4444' }}>{error}</p>}

              <button onClick={handleSubmit} disabled={loading || !sido || !sigungu}
                style={{ width: '100%', height: 48, background: '#2552FE', color: '#fff', borderRadius: 12, border: 'none', fontSize: 14, fontWeight: 700, cursor: loading || !sido || !sigungu ? 'not-allowed' : 'pointer', opacity: loading || !sido || !sigungu ? 0.4 : 1, transition: 'all 0.2s' }}>
                {loading ? '분석 중...' : '입지 점수 분석 시작'}
              </button>
            </div>

            {/* Preview */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontSize: 12, color: '#9CA3AF' }}>조건을 입력하면 리포트 페이지에서 결과를 확인할 수 있습니다</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {[
                  { title: '경쟁 시설 수', sub: `반경 ${radiusLabel} 내` },
                  { title: '폐업률', sub: '낮을수록 안정적인 시장' },
                  { title: '입지 점수', sub: '100점 만점' },
                ].map((c) => (
                  <div key={c.title} className="glass-card" style={{ padding: 20 }}>
                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>{c.title}</span>
                    <p style={{ fontSize: 28, fontWeight: 800, color: '#E5E7EB', letterSpacing: '-0.5px', margin: '6px 0' }}>–</p>
                    <span style={{ fontSize: 11, color: '#9CA3AF' }}>{c.sub}</span>
                  </div>
                ))}
              </div>
              <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#E5E7EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
                <span style={{ fontSize: 13, color: '#9CA3AF' }}>분석 조건을 입력하고 시작 버튼을 눌러주세요</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
