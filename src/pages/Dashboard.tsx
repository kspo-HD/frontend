import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import client from '../api/client';

interface Stats {
  total: number;
  active: number;
  publicCount: number;
  categories: { category: string; count: number }[];
  regions: { sido: string; count: number }[];
  types: { type: string; count: number }[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    client.get('/api/v1/facilities/stats')
      .then(r => setStats(r.data))
      .catch(() => {});
  }, []);

  const maxCategoryCount = stats ? Math.max(...stats.categories.map(c => Number(c.count))) : 1;
  const topRegions = stats?.regions.slice(0, 10) ?? [];
  const topTypes = stats?.types.slice(0, 15) ?? [];
  const maxTypeCount = topTypes.length > 0 ? Math.max(...topTypes.map(t => Number(t.count))) : 1;

  const summaryCards = [
    { label: '전체 시설 수', value: stats ? stats.total.toLocaleString() + '개' : '–' },
    { label: '공공 개방 시설', value: stats ? stats.publicCount.toLocaleString() + '개' : '–' },
    { label: '등록 시도', value: stats ? stats.regions.length + '개' : '–' },
    { label: '정상운영 비율', value: stats ? ((stats.active / stats.total) * 100).toFixed(1) + '%' : '–' },
  ];

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="fm-main">
        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Header */}
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', letterSpacing: '-0.5px' }}>
              전국 피트니스 시설 대시보드
            </h1>
            <p style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>스포츠시설 명세서 + 공공개방시설 데이터 기반</p>
          </div>

          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {summaryCards.map((m) => (
              <div key={m.label} className="glass-card" style={{ padding: 20 }}>
                <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 6 }}>{m.label}</p>
                <p style={{ fontSize: 26, fontWeight: 800, color: '#2552FE', letterSpacing: '-0.5px' }}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* Types Distribution */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 16 }}>세부 유형별 시설 수 (상위 15개)</h2>
            {stats ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 32, rowGap: 12 }}>
                {topTypes.map((t) => (
                  <div key={t.type} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 13, color: '#4B5563', width: 96, flexShrink: 0 }}>{t.type}</span>
                    <div style={{ flex: 1, background: '#F3F4F6', height: 6, borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: '#93AFFE', borderRadius: 99, width: `${(Number(t.count) / maxTypeCount) * 100}%` }} />
                    </div>
                    <span style={{ fontSize: 13, color: '#6B7280', width: 64, textAlign: 'right' }}>{Number(t.count).toLocaleString()}개</span>
                  </div>
                ))}
              </div>
            ) : <p style={{ fontSize: 13, color: '#9CA3AF' }}>불러오는 중...</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Categories */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 16 }}>업종별 시설 수</h2>
              {stats ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {stats.categories.map((c) => (
                    <div key={c.category} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 13, color: '#4B5563', width: 112, flexShrink: 0 }}>{c.category}</span>
                      <div style={{ flex: 1, background: '#F3F4F6', height: 6, borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: '#2552FE', borderRadius: 99, width: `${(Number(c.count) / maxCategoryCount) * 100}%` }} />
                      </div>
                      <span style={{ fontSize: 13, color: '#6B7280', width: 64, textAlign: 'right' }}>{Number(c.count).toLocaleString()}개</span>
                    </div>
                  ))}
                </div>
              ) : <p style={{ fontSize: 13, color: '#9CA3AF' }}>불러오는 중...</p>}
            </div>

            {/* Regions */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 16 }}>지역별 시설 수 (상위 10개)</h2>
              {stats ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>시도</th>
                      <th style={{ textAlign: 'right' }}>시설 수</th>
                      <th style={{ textAlign: 'right' }}>비율</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topRegions.map((r) => (
                      <tr key={r.sido}>
                        <td style={{ color: '#111827' }}>{r.sido}</td>
                        <td style={{ textAlign: 'right', color: '#4B5563' }}>{Number(r.count).toLocaleString()}개</td>
                        <td style={{ textAlign: 'right', color: '#9CA3AF' }}>
                          {((Number(r.count) / (stats.total || 1)) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p style={{ fontSize: 13, color: '#9CA3AF' }}>불러오는 중...</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
