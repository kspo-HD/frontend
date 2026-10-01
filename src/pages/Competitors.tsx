import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import client from '../api/client';

interface Competitor {
  facilityId: number;
  name: string;
  category: string;
  status: string;
  lat: number;
  lng: number;
  roadAddr: string;
  areaM2: number | null;
  floor: number | null;
  isPublic: boolean;
  openWeekday: string | null;
  distanceM: number;
}

export default function Competitors() {
  const { id: reportId } = useParams<{ id: string }>();
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!reportId) return;
    client.get(`/api/v1/reports/${reportId}/competitors`)
      .then(r => setCompetitors(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [reportId]);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="fm-main">
        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Breadcrumb + Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#9CA3AF', marginBottom: 10 }}>
              <Link to="/home" style={{ color: '#9CA3AF' }} className="hover:text-gray-600">마이페이지</Link>
              <span>›</span>
              <Link to={`/reports/${reportId}`} style={{ color: '#9CA3AF' }} className="hover:text-gray-600">리포트</Link>
              <span>›</span>
              <span style={{ color: '#374151' }}>경쟁 시설 목록</span>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', letterSpacing: '-0.5px' }}>인근 경쟁 시설</h1>
            <p style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>분석 반경 내 동일 업종 시설 목록입니다.</p>
          </div>

          <div className="glass-card" style={{ overflow: 'hidden' }}>
            {loading ? (
              <p style={{ fontSize: 13, color: '#9CA3AF', padding: 32, textAlign: 'center' }}>불러오는 중...</p>
            ) : competitors.length === 0 ? (
              <p style={{ fontSize: 13, color: '#6B7280', padding: 48, textAlign: 'center' }}>반경 내 경쟁 시설이 없습니다.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #F3F4F6' }}>
                    <tr>
                      {['시설명', '업종', '상태', '주소', '면적', '거리'].map((h, i) => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: i === 5 ? 'right' : 'left', fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {competitors.map((c) => (
                      <tr key={c.facilityId} style={{ borderBottom: '1px solid #F9FAFB' }} className="hover:bg-gray-50">
                        <td style={{ padding: '12px 16px', fontWeight: 500, color: '#111827' }}>{c.name}</td>
                        <td style={{ padding: '12px 16px', color: '#4B5563' }}>{c.category}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, ...(c.status === '정상운영' ? { background: '#E1F8E8', color: '#16A34A' } : { background: '#F3F4F6', color: '#9CA3AF' }) }}>
                            {c.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#6B7280', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.roadAddr || '-'}</td>
                        <td style={{ padding: '12px 16px', color: '#6B7280' }}>{c.areaM2 ? `${c.areaM2.toLocaleString()}㎡` : '-'}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', color: '#6B7280' }}>{c.distanceM}m</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
