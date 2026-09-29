import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import client from '../api/client';

interface PaymentRecord {
  id: string;
  bundleType: number;
  totalCredits: number;
  amount: number;
  status: string;
  createdAt: string;
}

const STATUS_LABEL: Record<string, string> = {
  paid: '결제 완료',
  failed: '결제 실패',
  refunded: '환불',
};

const STATUS_COLOR: Record<string, string> = {
  paid: 'text-green-600 bg-green-50',
  failed: 'text-red-500 bg-red-50',
  refunded: 'text-gray-500 bg-gray-100',
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 px-16 py-8 max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/home')} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">결제 내역</h1>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400 text-center py-16">불러오는 중...</p>
        ) : payments.length === 0 ? (
          <div className="bg-white border border-gray-200 p-12 flex flex-col items-center gap-3">
            <svg className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm text-gray-400">결제 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 divide-y divide-gray-100">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex flex-col gap-0.5">
                  <p className="text-[14px] font-bold text-gray-900">크레딧 {p.totalCredits}개</p>
                  <p className="text-[12px] text-gray-400">{p.createdAt?.slice(0, 10)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[p.status] ?? 'text-gray-500 bg-gray-100'}`}>
                    {STATUS_LABEL[p.status] ?? p.status}
                  </span>
                  <p className="text-[15px] font-bold text-gray-900">{p.amount.toLocaleString()}원</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
