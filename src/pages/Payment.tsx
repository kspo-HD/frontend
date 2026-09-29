import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const bundles = [
  { count: 1, price: 9900, perUnit: 9900, label: '1건', badge: null, recommended: false },
  { count: 3, price: 24900, perUnit: 8300, label: '3건', badge: '추천', recommended: true },
  { count: 5, price: 39000, perUnit: 7800, label: '5건', badge: '최저가', recommended: false },
];

const payMethods = ['카드', '카카오페이', '네이버페이'];

function formatPrice(n: number) {
  return '₩' + n.toLocaleString();
}

export default function Payment() {
  const { id } = useParams();
  const [selectedBundle, setSelectedBundle] = useState(3);
  const [payMethod, setPayMethod] = useState('카드');

  const bundle = bundles.find((b) => b.count === selectedBundle)!;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center py-16 px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 mb-6 text-[13px]">
          <Link to="/analysis" className="text-gray-400 hover:text-gray-600">창업 분석</Link>
          <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link to={`/reports/${id}`} className="text-gray-400 hover:text-gray-600">입지 리포트</Link>
          <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-bold text-[#3B6FD4]">결제</span>
        </div>

        <div className="w-[600px] bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* 카드 헤더 */}
          <div className="bg-[#3B6FD4] px-8 py-7 flex flex-col gap-1">
            <h1 className="text-xl font-bold text-white">입지 분석 리포트 잠금 해제</h1>
            <p className="text-[13px] text-[#CBD5E1]">업종: 당구장 · 서울 강남구 · 반경 1km</p>
          </div>

          <div className="px-8 py-8 flex flex-col gap-6">
            {/* 포함 항목 */}
            <div className="flex flex-col gap-3">
              <span className="text-[13px] font-bold text-gray-900">포함 항목</span>
              {[
                { icon: 'chart-bar', text: '세부 입지 점수 (경쟁 희소성 · 수요 잠재력 · 접근성 · 임대 시세)' },
                { icon: 'map-pin', text: '경쟁 시설 상세 조회 및 공공·사설 구분 지도' },
                { icon: 'star', text: '입지 추천 등급 + AI 한 줄 이유' },
                { icon: 'download', text: 'PDF 다운로드 (지인 공유용)' },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[13px] text-gray-900">{item.text}</span>
                </div>
              ))}
            </div>

            <hr className="border-gray-200" />

            {/* 구매 옵션 */}
            <div className="flex flex-col gap-3">
              <span className="text-[13px] font-bold text-gray-900">구매 옵션</span>
              <div className="flex gap-2.5">
                {bundles.map((b) => (
                  <button
                    key={b.count}
                    onClick={() => setSelectedBundle(b.count)}
                    className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-colors ${
                      selectedBundle === b.count
                        ? 'bg-[#EFF6FF] border-[#3B6FD4]'
                        : 'bg-white border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {b.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        b.recommended ? 'bg-[#3B6FD4] text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {b.badge}
                      </span>
                    )}
                    <span className={`text-base font-bold ${selectedBundle === b.count ? 'text-[#1E3A8A]' : 'text-gray-900'}`}>
                      {b.label}
                    </span>
                    <span className={`text-sm font-bold ${selectedBundle === b.count ? 'text-[#3B6FD4]' : 'text-gray-900'}`}>
                      {formatPrice(b.price)}
                    </span>
                    <span className={`text-[10px] ${selectedBundle === b.count ? 'text-[#3B6FD4]' : 'text-gray-400'}`}>
                      건당 {formatPrice(b.perUnit)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 최종 금액 */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-[13px] text-gray-400">{bundle.count}건 묶음</span>
                <span className="text-[11px] text-gray-400">건당 {formatPrice(bundle.perUnit)} · 리포트 영구 보관</span>
              </div>
              <span className="text-[28px] font-bold text-[#3B6FD4]">{formatPrice(bundle.price)}</span>
            </div>

            <hr className="border-gray-200" />

            {/* 결제 수단 */}
            <div className="flex flex-col gap-3">
              <span className="text-[13px] font-bold text-gray-900">결제 수단</span>
              <div className="flex gap-2.5">
                {payMethods.map((m) => (
                  <button
                    key={m}
                    onClick={() => setPayMethod(m)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded border transition-colors ${
                      payMethod === m
                        ? 'bg-[#EFF6FF] border-[#3B6FD4] text-[#3B6FD4] font-bold'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                      payMethod === m ? 'border-[#3B6FD4]' : 'border-gray-300'
                    }`}>
                      {payMethod === m && <div className="w-1.5 h-1.5 rounded-full bg-[#3B6FD4]" />}
                    </div>
                    <span className="text-[13px]">{m}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 결제 버튼 */}
            <div className="flex flex-col items-center gap-2">
              <button className="w-full flex items-center justify-center gap-2 bg-[#3B6FD4] text-white rounded-lg py-4 text-[15px] font-bold hover:bg-[#2e5ec0] transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                {formatPrice(bundle.price)} 결제하고 리포트 {bundle.count}건 받기
              </button>
              <span className="text-[11px] text-gray-400">🔒 안전한 결제 · 언제든 환불 가능 (열람 전)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
