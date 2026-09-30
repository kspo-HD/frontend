import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
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
  { label: '3천만원 미만',   sub: 'PT샵·소규모 도장',  value: '3,000만원 미만' },
  { label: '3천~8천만원',    sub: '소형 헬스장·도장',   value: '3,000만원~8,000만원' },
  { label: '8천만~1.5억',   sub: '중소형 헬스장',      value: '8,000만원~1억5,000만원' },
  { label: '1.5억~3억',     sub: '중형 헬스장',        value: '1억5,000만원~3억원' },
  { label: '3억~6억',       sub: '대형 헬스장',        value: '3억원~6억원' },
  { label: '6억 이상',      sub: '특대형·수영장',       value: '6억원 이상' },
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
      const res = await createAnalysis({ category, lat, lng, radiusM: radius, address, budgetRange: budget || undefined });
      navigate(`/reports/${res.reportId}`);
    } catch (e: any) {
      setError(e.message ?? '분석 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="bg-white border-b border-gray-200 px-16 py-8">
        <h1 className="text-2xl font-bold text-gray-900">창업 입지 분석</h1>
        <p className="text-sm text-gray-500 mt-2">
          업종과 지역을 선택하면 경쟁 지수·폐업률·입지 점수 리포트를 제공합니다
        </p>
      </div>

      <div className="flex-1 flex gap-6 px-16 py-8">
        {/* Form */}
        <div className="w-[400px] shrink-0 bg-white border border-gray-200 p-8 flex flex-col gap-6">
          <h2 className="text-base font-bold text-gray-900">분석 조건 입력</h2>

          {/* 업종 */}
          <div className="flex flex-col gap-1.5 relative">
            <label className="text-[13px] font-bold text-gray-900">업종 선택</label>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full h-11 bg-[#EFF6FF] border border-[#3B6FD4] rounded px-3.5 flex items-center gap-2"
            >
              <span className="flex-1 text-left text-[13px] font-bold text-[#1E3A8A]">{selectedCategory.label}</span>
              <svg className="w-4 h-4 text-[#3B6FD4] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={dropdownOpen ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute top-full left-0 w-full bg-white border border-[#3B6FD4] rounded shadow-md z-10 mt-0.5">
                {CATEGORIES.map((c) => (
                  <button key={c.value} onClick={() => { setCategory(c.value); setDropdownOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 border-b border-gray-100 text-left hover:bg-gray-50 ${c.value === category ? 'bg-[#EFF6FF]' : ''}`}>
                    <span className={`text-[13px] ${c.value === category ? 'font-bold text-[#1E3A8A]' : 'text-gray-900'}`}>{c.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 광역시·도 */}
          <div className="flex flex-col gap-1.5 relative">
            <label className="text-[13px] font-bold text-gray-900">광역시·도</label>
            <button
              onClick={() => setSidoOpen(!sidoOpen)}
              className="w-full h-11 bg-gray-50 border border-gray-200 rounded px-3.5 flex items-center gap-2"
            >
              <span className={`flex-1 text-left text-[13px] ${sido ? 'text-gray-900' : 'text-gray-400'}`}>{sido || '선택하세요'}</span>
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidoOpen ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
              </svg>
            </button>
            {sidoOpen && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded shadow-md z-10 mt-0.5 max-h-48 overflow-y-auto">
                {SIDOS.map((s) => (
                  <button key={s} onClick={() => { setSido(s); setSidoOpen(false); setSigungu(''); setSigunguOpen(false); }}
                    className={`w-full px-3.5 py-2.5 text-left text-[13px] border-b border-gray-100 hover:bg-gray-50 ${s === sido ? 'font-bold text-[#3B6FD4] bg-[#EFF6FF]' : 'text-gray-900'}`}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 시·군·구 */}
          <div className="flex flex-col gap-1.5 relative">
            <label className="text-[13px] font-bold text-gray-900">시·군·구</label>
            <button
              onClick={() => { if (sido) setSigunguOpen(!sigunguOpen); }}
              disabled={!sido}
              className={`w-full h-11 border rounded px-3.5 flex items-center gap-2 ${sido ? 'bg-gray-50 border-gray-200' : 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50'}`}
            >
              <span className={`flex-1 text-left text-[13px] ${sigungu ? 'text-gray-900' : 'text-gray-400'}`}>{sigungu || '선택하세요'}</span>
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sigunguOpen ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
              </svg>
            </button>
            {sigunguOpen && sido && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded shadow-md z-10 mt-0.5 max-h-48 overflow-y-auto">
                {SIDO_SIGUNGU[sido]?.map((sg) => (
                  <button key={sg} onClick={() => { setSigungu(sg); setSigunguOpen(false); }}
                    className={`w-full px-3.5 py-2.5 text-left text-[13px] border-b border-gray-100 hover:bg-gray-50 ${sg === sigungu ? 'font-bold text-[#3B6FD4] bg-[#EFF6FF]' : 'text-gray-900'}`}>
                    {sg}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 창업 예산 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-gray-900">
              창업 예산 <span className="text-[11px] font-normal text-gray-400">(선택)</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {BUDGET_OPTIONS.map((b) => (
                <button
                  key={b.value}
                  onClick={() => setBudget(budget === b.value ? '' : b.value)}
                  className={`py-2.5 px-1 rounded border text-center transition-colors ${
                    budget === b.value
                      ? 'bg-[#EFF6FF] border-[#3B6FD4]'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className={`text-[12px] font-bold leading-tight ${budget === b.value ? 'text-[#1E3A8A]' : 'text-gray-800'}`}>{b.label}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{b.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 반경 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-gray-900">분석 반경</label>
            <div className="h-11 bg-gray-100 border border-gray-200 rounded flex overflow-hidden">
              {RADIUS_OPTIONS.map((r) => (
                <button key={r.value} onClick={() => setRadius(r.value)}
                  className={`flex-1 h-full text-[13px] transition-colors ${radius === r.value ? 'bg-white border border-[#3B6FD4] text-[#3B6FD4] font-bold rounded' : 'text-gray-500'}`}>
                  {r.label}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-gray-400">중심점 기준 원형 반경 — 1km 추천 (도심 기준)</span>
          </div>

          {error && <p className="text-[13px] text-red-500">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading || !sido || !sigungu}
            className="w-full h-12 bg-[#3B6FD4] text-white text-[15px] font-bold hover:bg-[#2e5ec0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-2"
          >
            {loading ? '분석 중...' : '입지 점수 분석 시작'}
          </button>
        </div>

        {/* Preview */}
        <div className="flex-1 flex flex-col gap-6">
          <p className="text-xs text-gray-400">조건을 입력하면 리포트 페이지에서 결과를 확인할 수 있습니다</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { title: '경쟁 시설 수', sub: `반경 ${RADIUS_OPTIONS.find(r=>r.value===radius)?.label} 내` },
              { title: '폐업률', sub: '낮을수록 안정적인 시장' },
              { title: '입지 점수', sub: '100점 만점' },
            ].map((c) => (
              <div key={c.title} className="bg-white border border-gray-200 p-5 flex flex-col gap-1.5">
                <span className="text-xs text-gray-400">{c.title}</span>
                <span className="text-[28px] font-bold text-gray-300">–</span>
                <span className="text-[11px] text-gray-400">{c.sub}</span>
              </div>
            ))}
          </div>
          <div className="flex-1 bg-white border border-gray-200 flex flex-col items-center justify-center gap-3 min-h-[300px]">
            <svg className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-sm text-gray-400">분석 조건을 입력하고 시작 버튼을 눌러주세요</span>
          </div>
        </div>
      </div>
    </div>
  );
}
