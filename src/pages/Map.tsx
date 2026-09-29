import { useEffect, useRef, useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
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

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  useEffect(() => {
    if (!mapReady || !kakaoMapRef.current) return;

    if (heatmapRef.current) {
      heatmapRef.current.setMap(null);
      heatmapRef.current = null;
    }
    if (clustererRef.current) {
      clustererRef.current.clear();
      clustererRef.current = null;
    }

    const validPoints = facilities.filter(f => f.lat && f.lng);
    if (validPoints.length === 0) return;

    if (viewMode === 'heatmap' && typeof window.kakao.maps.HeatMap === 'function') {
      const data = validPoints.map(f => ({
        position: new window.kakao.maps.LatLng(f.lat, f.lng),
        count: 1,
      }));
      try {
        heatmapRef.current = new window.kakao.maps.HeatMap(kakaoMapRef.current, data, {
          radius: 30,
          opacity: 0.6,
        });
      } catch {
        // HeatMap 불가 시 클러스터 마커로 폴백
        renderClusters(validPoints);
      }
    } else {
      renderClusters(validPoints);
    }

    function renderClusters(points: FacilityPoint[]) {
      const markers = points.map(f =>
        new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(f.lat, f.lng),
        })
      );
      clustererRef.current = new window.kakao.maps.MarkerClusterer({
        map: kakaoMapRef.current,
        averageCenter: true,
        minLevel: 10,
      });
      clustererRef.current.addMarkers(markers);
    }
  }, [mapReady, facilities, viewMode]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[280px] shrink-0 bg-white border-r border-gray-200 flex flex-col gap-4 p-5">
          <h2 className="text-sm font-bold text-gray-900">필터</h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500">시설 종류</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="h-9 bg-gray-50 border border-gray-200 px-3 text-[13px] text-gray-900 outline-none">
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500">지역</label>
            <select value={sido} onChange={e => setSido(e.target.value)}
              className="h-9 bg-gray-50 border border-gray-200 px-3 text-[13px] text-gray-900 outline-none">
              {SIDOS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500">공공/사설</label>
            <select value={isPublic} onChange={e => setIsPublic(e.target.value)}
              className="h-9 bg-gray-50 border border-gray-200 px-3 text-[13px] text-gray-900 outline-none">
              {PUBLIC_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>

          <hr className="border-gray-200" />

          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-500">포화도 범례</span>
            <div className="flex h-3 overflow-hidden">
              {gradColors.map(c => <div key={c} className="flex-1" style={{ backgroundColor: c }} />)}
            </div>
            <div className="flex justify-between">
              <span className="text-[11px] text-gray-400">낮음</span>
              <span className="text-[11px] text-gray-400">높음</span>
            </div>
          </div>

          <span className="text-xs text-[#3B6FD4] mt-auto">
            {loading ? '로딩 중...' : `검색 결과: ${facilities.length.toLocaleString()}개 시설`}
          </span>
        </aside>

        <div className="flex-1 relative overflow-hidden">
          <div ref={mapRef} className="w-full h-full" />

          <div className="absolute top-5 left-5 flex rounded-lg overflow-hidden border border-[#DDD] shadow-sm z-10">
            <button onClick={() => setViewMode('heatmap')}
              className={`px-3.5 py-2 text-xs font-semibold transition-colors ${viewMode === 'heatmap' ? 'bg-[#3B6FD4] text-white' : 'bg-white text-gray-600'}`}>
              히트맵
            </button>
            <button onClick={() => setViewMode('marker')}
              className={`px-3.5 py-2 text-xs font-medium transition-colors ${viewMode === 'marker' ? 'bg-[#3B6FD4] text-white' : 'bg-white text-gray-600'}`}>
              마커
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
