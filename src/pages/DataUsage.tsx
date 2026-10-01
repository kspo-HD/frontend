import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import client from '../api/client';

interface UsageItem {
  usedAt: string;
  reportId?: string;
  score?: number;
  grade?: string;
  category?: string;
  address?: string;
  radiusM?: number;
}

interface PaymentItem {
  id: string;
  bundleType: number;
  totalCredits: number;
  amount: number;
  status: string;
  createdAt: string;
}

const GRADE_COLOR: Record<string, { bg: string; color: string }> = {
  S: { bg: '#E1F8E8', color: '#16A34A' },
  A: { bg: '#EEF2FF', color: '#2552FE' },
  B: { bg: '#FFFBEB', color: '#D97706' },
  C: { bg: '#FFF7ED', color: '#EA580C' },
  D: { bg: '#FEF2F2', color: '#DC2626' },
  E: { bg: '#FEF2F2', color: '#991B1B' },
};

const RADIUS_LABEL: Record<number, string> = { 500: '500m', 1000: '1km', 3000: '3km', 5000: '5km' };

export default function DataUsage() {
  const [tab, setTab] = useState<'usage' | 'payment'>('usage');
  const [usage, setUsage] = useState<UsageItem[]>([]);
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      client.get('/api/v1/credits/usage').then(r => r.data ?? []),
      client.get('/api/v1/payments').then(r => r.data ?? []),
    ]).then(([u, p]) => {
      setUsage(u);
      setPayments(p);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="fm-main">
        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', letterSpacing: '-0.5px' }}>사용 데이터</h1>
            <p style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>크레딧 사용 내역과 결제 내역을 확인하세요.</p>
          </div>

          {/* 탭 */}
          <div style={{ display: 'flex', gap: 4, background: '#F3F4F6', borderRadius: 12, padding: 4, width: 'fit-content' }}>
            {([['usage', '크레딧 사용'], ['payment', '결제 내역']] as const).map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)}
                style={{ padding: '8px 20px', borderRadius: 10, border: 'none', fontSize: 13, fontWeight: tab === key ? 700 : 400, color: tab === key ? '#2552FE' : '#6B7280', background: tab === key ? '#fff' : 'transparent', cursor: 'pointer', transition: 'all 0.15s', boxShadow: tab === key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
                {label}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#9CA3AF', fontSize: 13 }}>불러오는 중...</div>
          ) : tab === 'usage' ? (
            usage.length === 0 ? (
              <div className="glass-card" style={{ padding: 48, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p style={{ fontSize: 13, color: '#9CA3AF' }}>크레딧 사용 내역이 없어요.</p>
                <Link to="/analysis" style={{ fontSize: 13, color: '#2552FE', fontWeight: 600 }}>첫 입지 분석 시작하기 →</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {usage.map((item, i) => {
                  const g = item.grade && GRADE_COLOR[item.grade];
                  return (
                    <div key={i} className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2552FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                        </svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{item.category ?? '–'}</span>
                          {item.radiusM && <span style={{ fontSize: 11, color: '#9CA3AF' }}>반경 {RADIUS_LABEL[item.radiusM] ?? `${item.radiusM}m`}</span>}
                        </div>
                        <p style={{ fontSize: 12, color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.address ?? '–'}</p>
                        <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 3 }}>{item.usedAt?.slice(0, 10)}</p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                        {item.score != null && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 20, fontWeight: 800, color: '#2552FE' }}>{item.score}</span>
                            <span style={{ fontSize: 11, color: '#9CA3AF' }}>점</span>
                            {g && <span style={{ padding: '2px 7px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: g.bg, color: g.color }}>{item.grade}등급</span>}
                          </div>
                        )}
                        {item.reportId && (
                          <Link to={`/reports/${item.reportId}`}
                            style={{ fontSize: 11, color: '#2552FE', fontWeight: 600 }}>
                            리포트 보기 →
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            payments.length === 0 ? (
              <div className="glass-card" style={{ padding: 48, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <p style={{ fontSize: 13, color: '#9CA3AF' }}>결제 내역이 없어요.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {payments.map((p) => (
                  <div key={p.id} className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#E1F8E8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
                      </svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>크레딧 {p.totalCredits}개 구매</p>
                      <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 3 }}>{p.createdAt?.slice(0, 10)}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{p.amount?.toLocaleString()}원</span>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: p.status === '완료' ? '#E1F8E8' : '#F3F4F6', color: p.status === '완료' ? '#16A34A' : '#6B7280', fontWeight: 600 }}>{p.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}
