import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import client from '../api/client';

const BUNDLES = [
  { type: 1, label: '1회', price: 9900, unitPrice: 9900, tag: '' },
  { type: 3, label: '3회', price: 24900, unitPrice: 8300, tag: '추천' },
  { type: 5, label: '5회', price: 39000, unitPrice: 7800, tag: '최저가' },
];

export default function Payment() {
  const { id: reportId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const bundle = BUNDLES.find(b => b.type === selected)!;

  const handlePurchase = async () => {
    setLoading(true);
    setError('');
    try {
      await client.post('/api/v1/payments', { bundleType: selected });
      if (reportId && reportId !== 'new') navigate(`/reports/${reportId}`);
      else navigate('/home');
    } catch {
      setError('결제에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="fm-main" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 480, padding: '0 24px' }}>
          <div className="glass-card" style={{ padding: 36 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827', letterSpacing: '-0.5px', marginBottom: 6 }}>리포트 크레딧 구매</h1>
            <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 24 }}>크레딧 1개로 AI 분석 리포트 1개를 잠금 해제할 수 있어요.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {BUNDLES.map((b) => (
                <button key={b.type} onClick={() => setSelected(b.type)}
                  style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 14, border: `2px solid ${selected === b.type ? '#2552FE' : '#E5E7EB'}`, background: selected === b.type ? '#EEF2FF' : '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                  {b.tag && (
                    <span style={{ position: 'absolute', top: 10, right: 12, fontSize: 10, fontWeight: 700, color: '#fff', background: '#2552FE', padding: '2px 8px', borderRadius: 20 }}>
                      {b.tag}
                    </span>
                  )}
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

            <div style={{ background: '#F8FAFC', borderRadius: 12, padding: '14px 16px', marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#6B7280' }}>크레딧</span>
                <span style={{ color: '#111827' }}>{bundle.type}개</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: '#6B7280' }}>결제금액</span>
                <strong style={{ color: '#111827' }}>{bundle.price.toLocaleString()}원</strong>
              </div>
            </div>

            {error && <p style={{ fontSize: 12, color: '#EF4444', marginBottom: 10 }}>{error}</p>}
            <button onClick={handlePurchase} disabled={loading}
              style={{ width: '100%', height: 48, background: '#2552FE', color: '#fff', borderRadius: 12, border: 'none', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>
              {loading ? '처리 중...' : `${bundle.price.toLocaleString()}원 결제하기`}
            </button>

            <p style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center', marginTop: 14 }}>
              현재 테스트 환경 — 실제 결제가 발생하지 않습니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
