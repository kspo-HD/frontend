import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuthStore } from '../store/authStore';
import { getMe, type Me } from '../api/user';
import { getMyAnalyses } from '../api/reports';
import { getMyReports } from '../api/reports';
import type { Analysis, Report } from '../types';

export default function Home() {
  const loginWithToken = useAuthStore((s) => s.loginWithToken);
  const [me, setMe] = useState<Me | null>(null);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('access_token');
    if (token) {
      loginWithToken(token);
      window.history.replaceState({}, '', '/home');
    }
  }, [loginWithToken]);

  useEffect(() => {
    getMe().then(setMe).catch(() => {});
    getMyAnalyses().then(setAnalyses).catch(() => {});
    getMyReports().then(setReports).catch(() => {});
  }, []);

  const items = analyses.map((a) => {
    const report = reports.find((r) => r.analysisId === a.id);
    return { analysis: a, report };
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="bg-[#1E2D4A] px-10 py-5 flex items-center gap-6">
        <div className="flex-1">
          <p className="text-white text-lg font-bold">
            {me ? `안녕하세요, ${me.name} 님 👋` : '안녕하세요 👋'}
          </p>
          <p className="text-[#8FA8CC] text-[13px] mt-1">
            공공데이터로 피트니스 창업 최적 입지를 찾아보세요. 발품 없이, 데이터로.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/analysis"
            className="flex items-center gap-2 bg-[#3B6FD4] text-white px-5 py-2.5 text-[13px] font-bold hover:bg-[#2e5ec0] transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            창업 입지 분석
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 bg-[#2D3E5A] text-[#8FA8CC] px-5 py-2.5 text-[13px] hover:bg-[#364d73] transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            시설 대시보드
          </Link>
        </div>
      </div>

      <div className="flex-1 px-10 py-7 flex flex-col gap-6">
        <h2 className="text-base font-bold text-gray-900">최근 창업 분석 리포트</h2>

        {items.length === 0 ? (
          <div className="bg-white border border-gray-200 p-10 flex flex-col items-center gap-3">
            <p className="text-sm text-gray-500">아직 분석 내역이 없어요.</p>
            <Link to="/analysis" className="text-sm text-[#3B6FD4] font-bold hover:underline">
              첫 입지 분석 시작하기 →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {items.map(({ analysis, report }) => (
              <div key={analysis.id} className="bg-white border border-gray-200 p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900 truncate">
                    {analysis.category} · {analysis.address}
                  </span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 shrink-0 ${report ? 'text-[#16A34A] bg-[#DCFCE7]' : 'text-gray-400 bg-gray-100'}`}>
                    {report ? '분석 완료' : '처리 중'}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {analysis.createdAt.slice(0, 10)}
                </span>
                <div className="flex items-end gap-1.5">
                  {report ? (
                    <>
                      <span className="text-[28px] font-bold text-[#3B6FD4]">{report.score}점</span>
                      <span className="text-xs text-gray-400 mb-1.5">입지 점수</span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-400">점수 산출 중...</span>
                  )}
                </div>
                {report && (
                  <Link
                    to={`/reports/${report.id}`}
                    className="block w-full h-9 border border-gray-200 flex items-center justify-center text-xs text-[#3B6FD4] hover:bg-gray-50 transition-colors"
                  >
                    상세 보기
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="bg-[#EFF6FF] border border-[#3B6FD4] rounded-lg px-7 py-6 flex items-center gap-6">
          <div className="flex-1">
            <p className="text-[15px] font-bold text-[#1E3A8A]">새 입지 분석 시작하기</p>
            <p className="text-[13px] text-[#3B6FD4] mt-1 leading-relaxed">
              업종과 지역을 입력하면 경쟁 강도·포화도·추천 등급을 바로 확인할 수 있어요.
            </p>
          </div>
          <Link
            to="/analysis"
            className="flex items-center gap-1.5 bg-[#3B6FD4] text-white px-5 py-2.5 rounded text-[13px] font-bold hover:bg-[#2e5ec0] transition-colors shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            분석 시작
          </Link>
        </div>
      </div>
    </div>
  );
}
