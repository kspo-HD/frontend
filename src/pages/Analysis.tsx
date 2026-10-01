import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { createAnalysis, getRemainingCredits } from '../api/reports';
import client from '../api/client';

const BUNDLES = [
  { type: 1, label: '1회', price: 9_900,  unitPrice: 9_900, tag: '' },
  { type: 3, label: '3회', price: 24_900, unitPrice: 8_300, tag: '추천' },
  { type: 5, label: '5회', price: 39_000, unitPrice: 7_800, tag: '최저가' },
];

function CreditModal({ onClose, navigate }: { onClose: () => void; navigate: (p: string) => void }) {
  const [selected, setSelected] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bundle = BUNDLES.find(b => b.type === selected)!;

  const handlePurchase = async () => {
    setLoading(true);
    setError('');
    try {
      await client.post('/api/v1/payments', { bundleType: selected });
      onClose();
      navigate('/home');
    } catch {
      setError('결제에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
      onClick={onClose}>
      <div className="glass-card" style={{ width: 440, padding: 32, margin: 16 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>크레딧이 없습니다</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: 20, lineHeight: 1 }}>×</button>
        </div>
        <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 20 }}>입지 분석을 시작하려면 크레딧이 필요합니다. 크레딧 1개로 AI 분석 리포트 1개를 생성할 수 있어요.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {BUNDLES.map(b => (
            <button key={b.type} onClick={() => setSelected(b.type)}
              style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14, padding: 14, borderRadius: 14, border: `2px solid ${selected === b.type ? '#2552FE' : '#E5E7EB'}`, background: selected === b.type ? '#EEF2FF' : '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
              {b.tag && <span style={{ position: 'absolute', top: 10, right: 12, fontSize: 10, fontWeight: 700, color: '#fff', background: '#2552FE', padding: '2px 8px', borderRadius: 20 }}>{b.tag}</span>}
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${selected === b.type ? '#2552FE' : '#D1D5DB'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {selected === b.type && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#2552FE' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>크레딧 {b.label}</p>
                <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>개당 {b.unitPrice.toLocaleString()}원</p>
              </div>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{b.price.toLocaleString()}원</p>
            </button>
          ))}
        </div>

        {error && <p style={{ fontSize: 12, color: '#EF4444', marginBottom: 10 }}>{error}</p>}
        <button onClick={handlePurchase} disabled={loading}
          style={{ width: '100%', height: 48, background: '#2552FE', color: '#fff', borderRadius: 12, border: 'none', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>
          {loading ? '처리 중...' : `${bundle.price.toLocaleString()}원 결제하기`}
        </button>
      </div>
    </div>
  );
}

declare global { interface Window { kakao: any; } }

const CATEGORIES = [
  { label: '헬스장 / 체력단련장', value: '체력단련장업' },
  { label: '무도장 (태권도·검도 등)', value: '체육도장업' },
  { label: '수영장 / 교습 시설', value: '체육교습업' },
  { label: '공공 체육시설', value: '공공개방시설' },
];

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
  { label: '1km',  value: 1000 },
  { label: '3km',  value: 3000 },
  { label: '5km',  value: 5000 },
];

const CATEGORY_COLORS: Record<string, string> = {
  '체력단련장업': '#2552FE',
  '체육도장업':   '#7C3AED',
  '체육교습업':   '#0891B2',
  '공공개방시설': '#059669',
};

function reverseGeocode(lat: number, lng: number): Promise<string> {
  return new Promise((resolve) => {
    if (!window.kakao?.maps?.services) { resolve(`${lat.toFixed(5)}, ${lng.toFixed(5)}`); return; }
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2Address(lng, lat, (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK && result[0]) {
        const a = result[0].address;
        resolve(a.address_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      } else {
        resolve(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      }
    });
  });
}

export default function Analysis() {
  const navigate = useNavigate();

  const [category, setCategory]         = useState(CATEGORIES[0].value);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [budget, setBudget]             = useState('');
  const [radius, setRadius]             = useState(1000);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');

  const mapRef          = useRef<HTMLDivElement>(null);
  const kakaoMapRef     = useRef<any>(null);
  const markerRef       = useRef<any>(null);
  const circleRef       = useRef<any>(null);
  const nearbyOverlays  = useRef<any[]>([]);

  const [mapReady, setMapReady]           = useState(false);
  const [pin, setPin]                     = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [nearbyCount, setNearbyCount]     = useState<number | null>(null);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);

  const selectedCategory = CATEGORIES.find(c => c.value === category)!;
  const radiusLabel      = RADIUS_OPTIONS.find(r => r.value === radius)?.label;

  // 지도 초기화
  useEffect(() => {
    if (!mapRef.current || !window.kakao?.maps) return;
    window.kakao.maps.load(() => {
      const map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(36.5, 127.5),
        level: 13,
      });
      kakaoMapRef.current = map;
      setMapReady(true);

      window.kakao.maps.event.addListener(map, 'click', async (e: any) => {
        const lat = e.latLng.getLat();
        const lng = e.latLng.getLng();
        const address = await reverseGeocode(lat, lng);
        setPin({ lat, lng, address });
      });
    });
  }, []);

  // 마커 + 반경 원 그리기
  const drawPin = useCallback((lat: number, lng: number, r: number) => {
    if (!kakaoMapRef.current) return;
    const pos = new window.kakao.maps.LatLng(lat, lng);

    if (markerRef.current) markerRef.current.setMap(null);
    markerRef.current = new window.kakao.maps.Marker({ position: pos, map: kakaoMapRef.current });

    if (circleRef.current) circleRef.current.setMap(null);
    circleRef.current = new window.kakao.maps.Circle({
      center: pos, radius: r,
      strokeWeight: 2, strokeColor: '#2552FE', strokeOpacity: 0.7,
      fillColor: '#2552FE', fillOpacity: 0.07,
      map: kakaoMapRef.current,
    });

    kakaoMapRef.current.panTo(pos);
    kakaoMapRef.current.setLevel(r <= 500 ? 5 : r <= 1000 ? 6 : r <= 3000 ? 8 : 9);
  }, []);

  // 주변 시설 조회 및 오버레이
  const fetchNearby = useCallback(async (lat: number, lng: number, r: number, cat: string) => {
    setNearbyLoading(true);
    setNearbyCount(null);
    nearbyOverlays.current.forEach(o => o.setMap(null));
    nearbyOverlays.current = [];
    try {
      const res = await client.get('/api/v1/facilities/nearby', { params: { lat, lng, radius: r, category: cat } });
      const list: any[] = res.data ?? [];
      setNearbyCount(list.length);
      if (kakaoMapRef.current) {
        list.forEach(f => {
          if (!f.lat || !f.lng) return;
          const color = CATEGORY_COLORS[f.category] ?? '#6B7280';
          const overlay = new window.kakao.maps.CustomOverlay({
            position: new window.kakao.maps.LatLng(f.lat, f.lng),
            content: `<div style="width:10px;height:10px;border-radius:50%;background:${color};border:1.5px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.3)"></div>`,
            zIndex: 1,
          });
          overlay.setMap(kakaoMapRef.current);
          nearbyOverlays.current.push(overlay);
        });
      }
    } catch {
      setNearbyCount(0);
    } finally {
      setNearbyLoading(false);
    }
  }, []);

  // pin 또는 radius/category 변경 시 지도 업데이트
  useEffect(() => {
    if (!mapReady || !pin) return;
    drawPin(pin.lat, pin.lng, radius);
    fetchNearby(pin.lat, pin.lng, radius, category);
  }, [mapReady, pin, radius, category, drawPin, fetchNearby]);

  const clearPin = () => {
    setPin(null);
    setNearbyCount(null);
    if (markerRef.current)  { markerRef.current.setMap(null);  markerRef.current = null; }
    if (circleRef.current)  { circleRef.current.setMap(null);  circleRef.current = null; }
    nearbyOverlays.current.forEach(o => o.setMap(null));
    nearbyOverlays.current = [];
  };

  const handleSubmit = async () => {
    if (!pin) { setError('지도를 클릭해 분석할 위치를 선택해주세요.'); return; }
    setError('');
    setLoading(true);
    try {
      const credits = await getRemainingCredits();
      if (!credits || (credits as any).count === 0) {
        setShowCreditModal(true);
        return;
      }
      const res = await createAnalysis({
        category, lat: pin.lat, lng: pin.lng,
        radiusM: radius, address: pin.address,
        budgetRange: budget || undefined,
      }) as any;
      navigate(`/reports/${res.reportId ?? res.id}`);
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 500 || status === 402 || status === 403) {
        setShowCreditModal(true);
      } else {
        setError(e.message ?? '분석 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      {showCreditModal && <CreditModal onClose={() => setShowCreditModal(false)} navigate={navigate} />}
      <main className="fm-main">
        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', letterSpacing: '-0.5px' }}>창업 입지 분석</h1>
            <p style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>지도를 클릭해 분석 위치를 선택하세요 — 반경 내 경쟁 시설·입지 점수를 분석합니다</p>
          </div>

          <div style={{ display: 'flex', gap: 24, flex: 1, minHeight: 0 }}>
            {/* 폼 */}
            <div className="glass-card" style={{ width: 320, flexShrink: 0, padding: 24, display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto' }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>분석 조건</h2>

              {/* 업종 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>업종</label>
                <button onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{ width: '100%', height: 44, border: `1.5px solid ${dropdownOpen ? '#2552FE' : '#E5E7EB'}`, borderRadius: 12, padding: '0 14px', display: 'flex', alignItems: 'center', gap: 8, background: dropdownOpen ? '#EEF2FF' : '#F9FAFB', cursor: 'pointer' }}>
                  <span style={{ flex: 1, textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#2552FE' }}>{selectedCategory.label}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2552FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={dropdownOpen ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'}/>
                  </svg>
                </button>
                {dropdownOpen && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', background: '#fff', border: '1.5px solid #2552FE', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', zIndex: 20, marginTop: 4, overflow: 'hidden' }}>
                    {CATEGORIES.map(c => (
                      <button key={c.value} onClick={() => { setCategory(c.value); setDropdownOpen(false); }}
                        style={{ width: '100%', padding: '11px 14px', textAlign: 'left', fontSize: 13, borderBottom: '1px solid #F3F4F6', background: c.value === category ? '#EEF2FF' : '#fff', color: c.value === category ? '#2552FE' : '#111827', fontWeight: c.value === category ? 600 : 400, cursor: 'pointer' }}>
                        {c.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 반경 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>분석 반경</label>
                <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: 12, overflow: 'hidden', border: '1.5px solid #E5E7EB' }}>
                  {RADIUS_OPTIONS.map(r => (
                    <button key={r.value} onClick={() => setRadius(r.value)}
                      style={{ flex: 1, height: 40, fontSize: 13, fontWeight: r.value === radius ? 700 : 400, color: r.value === radius ? '#2552FE' : '#6B7280', background: r.value === radius ? '#fff' : 'transparent', border: r.value === radius ? '1.5px solid #2552FE' : 'none', borderRadius: r.value === radius ? 10 : 0, cursor: 'pointer', transition: 'all 0.15s', margin: r.value === radius ? 2 : 0 }}>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 선택된 위치 */}
              {pin ? (
                <div style={{ background: '#F0F4FF', borderRadius: 12, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#1E3A8A' }}>📍 선택된 위치</span>
                    <button onClick={clearPin} style={{ fontSize: 11, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>초기화</button>
                  </div>
                  <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>{pin.address}</div>
                  {(nearbyLoading || nearbyCount !== null) && (
                    <div style={{ marginTop: 8, fontSize: 12, color: nearbyLoading ? '#9CA3AF' : '#1E3A8A', fontWeight: 600 }}>
                      {nearbyLoading
                        ? '조회 중...'
                        : `반경 ${radiusLabel} 내 ${selectedCategory.label} ${nearbyCount}개`}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ background: '#F9FAFB', borderRadius: 12, padding: '16px 14px', textAlign: 'center', border: '1.5px dashed #E5E7EB' }}>
                  <div style={{ fontSize: 20, marginBottom: 6 }}>🗺️</div>
                  <div style={{ fontSize: 13, color: '#9CA3AF' }}>오른쪽 지도를 클릭해<br/>분석 위치를 선택하세요</div>
                </div>
              )}

              {/* 예산 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                  창업 예산 <span style={{ fontSize: 11, fontWeight: 400, color: '#9CA3AF' }}>(선택)</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {BUDGET_OPTIONS.map(b => (
                    <button key={b.value} onClick={() => setBudget(budget === b.value ? '' : b.value)}
                      style={{ padding: '10px 6px', borderRadius: 10, border: `1.5px solid ${budget === b.value ? '#2552FE' : '#E5E7EB'}`, background: budget === b.value ? '#EEF2FF' : '#F9FAFB', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: budget === b.value ? '#1E3A8A' : '#374151', lineHeight: 1.3 }}>{b.label}</div>
                      <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{b.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {error && <p style={{ fontSize: 13, color: '#EF4444' }}>{error}</p>}

              <button onClick={handleSubmit} disabled={!pin || loading}
                style={{ width: '100%', height: 48, background: '#2552FE', color: '#fff', borderRadius: 12, border: 'none', fontSize: 14, fontWeight: 700, cursor: pin && !loading ? 'pointer' : 'not-allowed', opacity: pin && !loading ? 1 : 0.4, transition: 'all 0.2s', marginTop: 'auto' }}>
                {loading ? '분석 중...' : '입지 점수 분석 시작'}
              </button>
            </div>

            {/* 지도 */}
            <div style={{ flex: 1, position: 'relative', borderRadius: 16, overflow: 'hidden', border: '1.5px solid #E5E7EB', minHeight: 0 }}>
              <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

              {loading && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.75)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, backdropFilter: 'blur(2px)' }}>
                  <div style={{ width: 44, height: 44, border: '4px solid #E5E7EB', borderTopColor: '#2552FE', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  <p style={{ marginTop: 14, fontSize: 13, fontWeight: 600, color: '#374151' }}>AI가 입지를 분석하고 있어요...</p>
                  <p style={{ marginTop: 4, fontSize: 11, color: '#9CA3AF' }}>잠시만 기다려주세요</p>
                </div>
              )}

              {!pin && !loading && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(255,255,255,0.92)', borderRadius: 12, padding: '14px 22px', boxShadow: '0 4px 16px rgba(0,0,0,0.10)', pointerEvents: 'none', textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>📍</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>지도를 클릭해 분석 위치를 선택하세요</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 3 }}>클릭한 위치 기준 반경 내 시설을 분석합니다</div>
                </div>
              )}

              {/* 범례 */}
              <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(255,255,255,0.92)', borderRadius: 10, padding: '8px 12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {CATEGORIES.map(c => (
                  <div key={c.value} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: CATEGORY_COLORS[c.value] }} />
                    <span style={{ fontSize: 10, color: '#6B7280' }}>{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
