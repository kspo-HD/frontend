import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import client from '../api/client';

interface PaymentRecord {
  id: string;
  bundleType: number;
  totalCredits: number;
  amount: number;
  status: string;
  createdAt: string;
}

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  paid: { bg: '#E1F8E8', color: '#16A34A' },
  failed: { bg: '#FEF2F2', color: '#EF4444' },
  refunded: { bg: '#F3F4F6', color: '#6B7280' },
};

const STATUS_LABEL: Record<string, string> = {
  paid: '결제 완료',
  failed: '결제 실패',
  refunded: '환불',
};

export default function PaymentHistory() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/api/v1/payments')
      .then(r => setPayments(r.data))
      .catch(() => navigate('/home'))
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="fm-main">
        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 720 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', letterSpacing: '-0.5px' }}>결제 내역</h1>
            <p style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>크레딧 구매 내역을 확인하세요.</p>
          </div>

          <div className="glass-card" style={{ overflow: 'hidden' }}>
            {loading ? (
              <p style={{ fontSize: 13, color: '#9CA3AF', padding: 48, textAlign: 'center' }}>불러오는 중...</p>
            ) : payments.length === 0 ? (
              <div style={{ padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <p style={{ fontSize: 13, color: '#6B7280' }}>결제 내역이 없습니다.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {payments.map((p, i) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: i < payments.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>크레딧 {p.totalCredits}개</p>
                      <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3 }}>{p.createdAt?.slice(0, 10)}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, ...(STATUS_STYLE[p.status] ?? { bg: '#F3F4F6', color: '#6B7280' }) }}>
                        {STATUS_LABEL[p.status] ?? p.status}
                      </span>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{p.amount.toLocaleString()}원</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
