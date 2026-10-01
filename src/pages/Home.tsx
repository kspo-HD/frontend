import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuthStore } from '../store/authStore';
import { getMe, withdraw, type Me } from '../api/user';
import { getMyAnalyses, getMyReports } from '../api/reports';
import type { Analysis, Report } from '../types';

export default function Home() {
  const loginWithToken = useAuthStore((s) => s.loginWithToken);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const [me, setMe] = useState<Me | null>(null);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [withdrawing, setWithdrawing] = useState(false);

  const handleWithdraw = async () => {
    if (!window.confirm('정말 탈퇴하시겠어요? 모든 분석 데이터가 삭제됩니다.')) return;
    setWithdrawing(true);
    try {
      await withdraw();
      logout();
      navigate('/');
    } finally {
      setWithdrawing(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('access_token');
    if (token) {
      loginWithToken(token);
      window.history.replaceState({}, '', '/home');
    }
  }, [loginWithToken, location.search]);

  useEffect(() => {
    getMe().then(setMe).catch(() => {});
    getMyAnalyses().then(setAnalyses).catch(() => {});
    getMyReports().then(setReports).catch(() => {});
  }, []);

  const items = analyses.map((a) => {
    const report = reports.find((r) => r.analysisId === a.id);
    return { analysis: a, report };
  });

  const GRADE_COLOR: Record<string, { bg: string; color: string }> = {
    S: { bg: '#E1F8E8', color: '#16A34A' },
    A: { bg: '#EEF2FF', color: '#2552FE' },
    B: { bg: '#FFFBEB', color: '#D97706' },
    C: { bg: '#FFF7ED', color: '#EA580C' },
    D: { bg: '#FEF2F2', color: '#DC2626' },
    E: { bg: '#FEF2F2', color: '#991B1B' },
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="fm-main">
        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', letterSpacing: '-0.5px' }}>
                {me ? `안녕하세요, ${me.name} 님` : '마이페이지'}
              </h1>
              <p style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
                공공데이터로 피트니스 창업 최적 입지를 찾아보세요.
              </p>
            </div>
            <Link
              to="/analysis"
              style={{ background: '#2552FE', color: '#fff', padding: '10px 20px', borderRadius: 12, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}
              className="hover:opacity-90 transition-opacity"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              창업 입지 분석
            </Link>
          </div>

          {/* Reports */}
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 14 }}>최근 창업 분석 리포트</h2>
            {items.length === 0 ? (
              <div className="glass-card" style={{ padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
                <p style={{ fontSize: 13, color: '#6B7280' }}>아직 분석 내역이 없어요.</p>
                <Link to="/analysis" style={{ fontSize: 13, color: '#2552FE', fontWeight: 600 }}>
                  첫 입지 분석 시작하기 →
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {items.map(({ analysis, report }) => (
                  <div key={analysis.id} className="glass-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {analysis.category}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6, flexShrink: 0, ...(report ? { background: '#E1F8E8', color: '#16A34A' } : { background: '#F3F4F6', color: '#9CA3AF' }) }}>
                        {report ? '분석 완료' : '처리 중'}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: '#9CA3AF' }}>{analysis.address} · {analysis.createdAt.slice(0, 10)}</p>
                    {report ? (
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
                        <span style={{ fontSize: 32, fontWeight: 800, color: '#2552FE', letterSpacing: '-1px' }}>{report.score}</span>
                        <span style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 6 }}>점 · {report.grade && (
                          <span style={{ padding: '2px 7px', borderRadius: 5, fontSize: 11, fontWeight: 600, ...(GRADE_COLOR[report.grade] ?? { bg: '#F3F4F6', color: '#6B7280' }) }}>
                            {report.grade}등급
                          </span>
                        )}</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: 13, color: '#9CA3AF' }}>점수 산출 중...</span>
                    )}
                    {report && (
                      <Link
                        to={`/reports/${report.id}`}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 36, border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: 12, color: '#2552FE', fontWeight: 600 }}
                        className="hover:bg-[#EEF2FF] transition-colors"
                      >
                        상세 보기
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTA Banner */}
          <div style={{ background: '#EEF2FF', border: '1.5px solid #C7D2FE', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#1E3A8A' }}>새 입지 분석 시작하기</p>
              <p style={{ fontSize: 13, color: '#4B5563', marginTop: 4, lineHeight: 1.5 }}>
                업종과 지역을 입력하면 경쟁 강도·폐업률·추천 등급을 바로 확인할 수 있어요.
              </p>
            </div>
            <Link
              to="/analysis"
              style={{ background: '#2552FE', color: '#fff', padding: '10px 20px', borderRadius: 12, fontSize: 13, fontWeight: 600, flexShrink: 0 }}
              className="hover:opacity-90 transition-opacity"
            >
              분석 시작
            </Link>
          </div>

          {/* Bottom Links */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4, paddingBottom: 12 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link to="/payment-history" style={{ border: '1.5px solid #E5E7EB', color: '#4B5563', padding: '8px 14px', borderRadius: 10, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
                className="hover:bg-gray-50 transition-colors">
                결제 내역
              </Link>
              <Link to="/terms" style={{ border: '1.5px solid #E5E7EB', color: '#4B5563', padding: '8px 14px', borderRadius: 10, fontSize: 13 }}
                className="hover:bg-gray-50 transition-colors">
                이용약관
              </Link>
            </div>
            <button
              onClick={handleWithdraw}
              disabled={withdrawing}
              style={{ border: '1.5px solid #FCA5A5', color: '#EF4444', padding: '8px 14px', borderRadius: 10, fontSize: 13, background: 'none', cursor: 'pointer' }}
              className="hover:bg-red-50 transition-colors disabled:opacity-40"
            >
              {withdrawing ? '처리 중...' : '회원 탈퇴'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
