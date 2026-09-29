import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
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

  const bundle = BUNDLES.find(b => b.type === selected)!;

  const handlePurchase = async () => {
    setLoading(true);
    try {
      await client.post('/api/v1/payments', { bundleType: selected });
      if (reportId) navigate(`/reports/${reportId}`);
      else navigate('/home');
    } catch {
      alert('결제에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white border border-gray-200 w-full max-w-[480px] p-10 flex flex-col gap-7">
          <div>
            <h1 className="text-xl font-bold text-gray-900">리포트 크레딧 구매</h1>
            <p className="text-[13px] text-gray-500 mt-1">크레딧 1개로 AI 분석 리포트 1개를 잠금 해제할 수 있어요.</p>
          </div>

          <div className="flex flex-col gap-2.5">
            {BUNDLES.map((b) => (
              <button
                key={b.type}
                onClick={() => setSelected(b.type)}
                className={`relative flex items-center gap-4 p-4 border-2 rounded-lg transition-colors text-left ${
                  selected === b.type ? 'border-[#3B6FD4] bg-[#EFF6FF]' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {b.tag && (
                  <span className="absolute top-2 right-2 text-[10px] font-bold text-white bg-[#3B6FD4] px-2 py-0.5 rounded-full">
                    {b.tag}
                  </span>
                )}
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selected === b.type ? 'border-[#3B6FD4]' : 'border-gray-300'}`}>
                  {selected === b.type && <div className="w-2.5 h-2.5 rounded-full bg-[#3B6FD4]" />}
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-bold text-gray-900">크레딧 {b.label}</p>
                  <p className="text-[12px] text-gray-400">개당 {b.unitPrice.toLocaleString()}원</p>
                </div>
                <p className="text-[16px] font-bold text-gray-900">{b.price.toLocaleString()}원</p>
              </button>
            ))}
          </div>

          <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-1.5">
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-500">크레딧</span>
              <span className="text-gray-900">{bundle.type}개</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-500">결제금액</span>
              <span className="font-bold text-gray-900">{bundle.price.toLocaleString()}원</span>
            </div>
          </div>

          <button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full h-12 bg-[#3B6FD4] text-white text-[15px] font-bold hover:bg-[#2e5ec0] transition-colors disabled:opacity-40"
          >
            {loading ? '처리 중...' : `${bundle.price.toLocaleString()}원 결제하기`}
          </button>

          <p className="text-[11px] text-gray-400 text-center">현재 테스트 환경 — 실제 결제가 발생하지 않습니다.</p>
        </div>
      </div>
    </div>
  );
}
