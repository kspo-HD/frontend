import { useEffect, useRef, useState, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import client from '../api/client';

declare global { interface Window { kakao: any } }

const CATEGORIES = [
  { label: '전체', value: '' },
  { label: '헬스장 / 체력단련장', value: '체력단련장업' },
  { label: '무도장 (태권도·검도 등)', value: '체육도장업' },
  { label: '수영장 / 교습 시설', value: '체육교습업' },
  { label: '공공 체육시설', value: '공공개방시설' },
];

const SIDOS = [
  '전국', '서울특별시', '경기도', '부산광역시', '인천광역시', '대구광역시',
  '광주광역시', '대전광역시', '울산광역시', '세종특별자치시',
  '강원특별자치도', '충청북도', '충청남도', '전북특별자치도',
  '전라남도', '경상북도', '경상남도', '제주특별자치도',
];

const PUBLIC_OPTIONS = [
  { label: '구분 없음', value: '' },
  { label: '공공', value: 'true' },
  { label: '사설', value: 'false' },
];

const gradColors = ['#4575B4', '#74ADD1', '#ABD9E9', '#FEE090', '#F46D43', '#D73027'];

interface FacilityPoint {
  lat: number;
  lng: number;
  name: string;
  category: string;
  isPublic: boolean;
}

const labelStyle: React.CSSProperties = { fontSize: 11, color: '#9CA3AF', marginBottom: 4 };
const selectStyle: React.CSSProperties = {
  height: 36,
  background: '#F9FAFB',
  border: '1.5px solid #E5E7EB',
  borderRadius: 10,
  padding: '0 10px',
  fontSize: 13,
  color: '#111827',
  outline: 'none',
  width: '100%',
};

export default function Map() {
  const mapRef = useRef<HTMLDivElement>(null);
  const kakaoMapRef = useRef<any>(null);
  const heatmapRef = useRef<any>(null);
  const clustererRef = useRef<any>(null);

  const [mapReady, setMapReady] = useState(false);
  const [category, setCategory] = useState('');
  const [sido, setSido] = useState('전국');
  const [isPublic, setIsPublic] = useState('');
  const [viewMode, setViewMode] = useState<'heatmap' | 'marker'>('heatmap');
  const [facilities, setFacilities] = useState<FacilityPoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mapRef.current || !window.kakao?.maps) return;
    window.kakao.maps.load(() => {
      kakaoMapRef.current = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(36.5, 127.5),
        level: 13,
      });
      setMapReady(true);
    });
  }, []);

  const fetchFacilities = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (sido !== '전국') params.sido = sido;
      if (category) params.category = category;
      if (isPublic !== '') params.isPublic = isPublic;
      const res = await client.get('/api/v1/facilities/map', { params });
      setFacilities(res.data);
    } catch {
      setFacilities([]);
    } finally {
      setLoading(false);
    }
  }, [sido, category, isPublic]);

  useEffect(() => { fetchFacilities(); }, [fetchFacilities]);

  useEffect(() => {
    if (!mapReady || !kakaoMapRef.current) return;

    if (heatmapRef.current) { heatmapRef.current.setMap(null); heatmapRef.current = null; }
    if (clustererRef.current) { clustererRef.current.clear(); clustererRef.current = null; }

    const validPoints = facilities.filter(f => f.lat && f.lng);
    if (validPoints.length === 0) return;

    if (viewMode === 'heatmap' && typeof window.kakao.maps.HeatMap === 'function') {
      const data = validPoints.map(f => ({ position: new window.kakao.maps.LatLng(f.lat, f.lng), count: 1 }));
      try {
        heatmapRef.current = new window.kakao.maps.HeatMap(kakaoMapRef.current, data, { radius: 30, opacity: 0.6 });
      } catch { renderClusters(validPoints); }
    } else {
      renderClusters(validPoints);
    }

    function renderClusters(points: FacilityPoint[]) {
      const markers = points.map(f =>
        new window.kakao.maps.Marker({ position: new window.kakao.maps.LatLng(f.lat, f.lng) })
      );
      clustererRef.current = new window.kakao.maps.MarkerClusterer({ map: kakaoMapRef.current, averageCenter: true, minLevel: 10 });
      clustererRef.current.addMarkers(markers);
    }
  }, [mapReady, facilities, viewMode]);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="fm-main fm-main-noscroll" style={{ flexDirection: 'row' }}>
        {/* Filter Sidebar */}
        <aside style={{ width: 240, flexShrink: 0, borderRight: '1px solid #F3F4F6', padding: 20, display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>필터</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={labelStyle}>시설 종류</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={selectStyle}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={labelStyle}>지역</label>
            <select value={sido} onChange={e => setSido(e.target.value)} style={selectStyle}>
              {SIDOS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={labelStyle}>공공/사설</label>
            <select value={isPublic} onChange={e => setIsPublic(e.target.value)} style={selectStyle}>
              {PUBLIC_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={labelStyle}>포화도 범례</span>
            <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden' }}>
              {gradColors.map(c => <div key={c} style={{ flex: 1, background: c }} />)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, color: '#9CA3AF' }}>낮음</span>
              <span style={{ fontSize: 10, color: '#9CA3AF' }}>높음</span>
            </div>
          </div>

          <span style={{ fontSize: 12, color: '#2552FE', marginTop: 'auto' }}>
            {loading ? '로딩 중...' : `${facilities.length.toLocaleString()}개 시설`}
          </span>
        </aside>

        {/* Map */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

          {/* View Mode Toggle */}
          <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', borderRadius: 10, overflow: 'hidden', border: '1.5px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', zIndex: 10 }}>
            <button onClick={() => setViewMode('heatmap')}
              style={{ padding: '7px 14px', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.15s', background: viewMode === 'heatmap' ? '#2552FE' : '#fff', color: viewMode === 'heatmap' ? '#fff' : '#6B7280' }}>
              히트맵
            </button>
            <button onClick={() => setViewMode('marker')}
              style={{ padding: '7px 14px', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.15s', background: viewMode === 'marker' ? '#2552FE' : '#fff', color: viewMode === 'marker' ? '#fff' : '#6B7280' }}>
              마커
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
