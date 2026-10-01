import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import client from '../api/client';

interface ReportData {
  id: string;
  score: number;
  grade: string;
  competitorCount: number;
  closureRate: number;
  publicRatio: number;
  isPaid: boolean;
  locked: boolean;
  summaryJson: string | null;
  category: string;
  lat: number;
  lng: number;
  radiusM: number;
  createdAt: string;
  aerobicRate?: number;
  walkingRate?: number;
  obesityRate?: number;
  healthRegion?: string;
}

interface AiSummary {
  summary?: string;
  market_analysis?: string;
  competition_analysis?: string;
  budget_analysis?: string;
  cost_saving_tips?: string[];
  survival_strategies?: string[];
  risks?: string[];
  opportunities?: string[];
  recommendations?: string[];
  score_reasoning?: string;
}

const GRADE_STYLE: Record<string, { bg: string; color: string }> = {
  S: { bg: '#E1F8E8', color: '#16A34A' },
  A: { bg: '#EEF2FF', color: '#2552FE' },
  B: { bg: '#FFFBEB', color: '#D97706' },
  C: { bg: '#FFF7ED', color: '#EA580C' },
  D: { bg: '#FEF2F2', color: '#DC2626' },
  E: { bg: '#FEF2F2', color: '#991B1B' },
};

function parseAi(raw: string | null): AiSummary | null {
  if (!raw) return null;
  try { return typeof raw === 'string' ? JSON.parse(raw) : raw; }
  catch { return null; }
}

export default function Report() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<ReportData | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [unlocking, setUnlocking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [unlockError, setUnlockError] = useState('');

  useEffect(() => {
    if (!id) return;
    Promise.all([
      client.get(`/api/v1/reports/${id}`),
      client.get('/api/v1/credits/remaining'),
    ]).then(([rRes, cRes]) => {
      setReport(rRes.data);
      setCredits(cRes.data.count ?? cRes.data);
    }).catch(() => navigate('/home')).finally(() => setLoading(false));
  }, [id, navigate]);

  const handleUnlock = async () => {
    if (!id) return;
    setUnlocking(true);
    setUnlockError('');
    try {
      const res = await client.post(`/api/v1/reports/${id}/unlock`);
      setReport(prev => prev ? { ...prev, isPaid: true, locked: false, summaryJson: res.data.summaryJson } : prev);
      setCredits(c => Math.max(0, c - 1));
    } catch (e: any) {
      setUnlockError(e.response?.data?.message ?? '잠금 해제에 실패했습니다.');
    } finally {
      setUnlocking(false);
    }
  };

  if (loading) return (
    <div className="app-shell">
      <Sidebar />
      <main className="fm-main" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#9CA3AF', fontSize: 14 }}>리포트 불러오는 중...</p>
      </main>
    </div>
  );
  if (!report) return null;

  const radiusLabel = report.radiusM >= 1000 ? `${report.radiusM / 1000}km` : `${report.radiusM}m`;
  const ai = parseAi(report.summaryJson);
  const gradeStyle = GRADE_STYLE[report.grade] ?? { bg: '#F3F4F6', color: '#6B7280' };

  const scorePercent = Math.min(100, Math.max(0, report.score));

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="fm-main">
        <div id="report-print" style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* 인쇄 전용 헤더 */}
          <div className="print-only" style={{ display: 'none', borderBottom: '2px solid #2552FE', paddingBottom: 12, marginBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#2552FE', letterSpacing: '-0.5px' }}>FitMap</span>
              <span style={{ fontSize: 11, color: '#9CA3AF' }}>창업 입지 분석 리포트 · fitmap.kr</span>
            </div>
          </div>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827', letterSpacing: '-0.5px' }}>
                  {report.category} · 반경 {radiusLabel}
                </h1>
                <span style={{ ...gradeStyle, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                  {report.grade}등급
                </span>
              </div>
              <p style={{ fontSize: 13, color: '#9CA3AF' }}>{report.createdAt?.slice(0, 10)} 분석 생성</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {!report.locked && (
                  <button onClick={() => window.print()} className="no-print"
                    style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1.5px solid #E5E7EB', background: '#fff', color: '#374151', padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
                    </svg>
                    PDF 저장
                  </button>
                )}
                <span style={{ fontSize: 13, color: '#6B7280' }}>크레딧 <strong style={{ color: '#111827' }}>{credits}개</strong></span>
                {report.locked && (
                  credits > 0
                    ? <button onClick={handleUnlock} disabled={unlocking}
                        style={{ background: '#2552FE', color: '#fff', padding: '10px 20px', borderRadius: 12, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: unlocking ? 0.6 : 1 }}>
                        {unlocking ? '처리 중...' : '크레딧으로 잠금 해제'}
                      </button>
                    : <button onClick={() => navigate(`/payment/${id}`)}
                        style={{ background: '#2552FE', color: '#fff', padding: '10px 20px', borderRadius: 12, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                        리포트 구매
                      </button>
                )}
              </div>
              {unlockError && <p style={{ fontSize: 12, color: '#EF4444' }}>{unlockError}</p>}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {/* 입지 점수 */}
            <div className="glass-card" style={{ padding: 20 }}>
              <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 6 }}>입지 점수</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: `conic-gradient(#2552FE 0% ${scorePercent}%, #E0E7FF ${scorePercent}% 100%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#2552FE' }}>{report.score}</span>
                  </div>
                </div>
                <p style={{ fontSize: 28, fontWeight: 800, color: '#2552FE', letterSpacing: '-1px' }}>{report.score}점</p>
              </div>
              <p style={{ fontSize: 11, color: '#9CA3AF' }}>100점 만점</p>
            </div>

            {/* 경쟁 시설 수 */}
            <div className="glass-card" style={{ padding: 20 }}>
              <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 6 }}>경쟁 시설 수</p>
              <p style={{ fontSize: 28, fontWeight: 800, color: '#2552FE', letterSpacing: '-1px', marginBottom: 4 }}>{report.competitorCount}개</p>
              <p style={{ fontSize: 11, color: '#9CA3AF' }}>반경 {radiusLabel} 내 동일 업종</p>
            </div>

            {/* 운동 실천율 OR 폐업률 폴백 */}
            <div className="glass-card" style={{ padding: 20 }}>
              {report.aerobicRate != null ? (
                <>
                  <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 6 }}>운동 실천율</p>
                  <p style={{ fontSize: 28, fontWeight: 800, color: '#2552FE', letterSpacing: '-1px', marginBottom: 4 }}>
                    {Number(report.aerobicRate).toFixed(1)}%
                  </p>
                  <p style={{ fontSize: 11, color: '#9CA3AF' }}>
                    {report.healthRegion} 중강도 이상 · {report.aerobicRate < 25 ? '미개척 수요 높음' : '활성 시장'}
                  </p>
                </>
              ) : (
                <>
                  <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 6 }}>폐업률</p>
                  <p style={{ fontSize: 28, fontWeight: 800, color: '#2552FE', letterSpacing: '-1px', marginBottom: 4 }}>
                    {Number(report.closureRate).toFixed(1)}%
                  </p>
                  <p style={{ fontSize: 11, color: '#9CA3AF' }}>낮을수록 안정적</p>
                </>
              )}
            </div>

            {/* 비만율 OR 공공시설 폴백 */}
            <div className="glass-card" style={{ padding: 20 }}>
              {report.obesityRate != null ? (
                <>
                  <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 6 }}>지역 비만율</p>
                  <p style={{ fontSize: 28, fontWeight: 800, color: '#2552FE', letterSpacing: '-1px', marginBottom: 4 }}>
                    {Number(report.obesityRate).toFixed(1)}%
                  </p>
                  <p style={{ fontSize: 11, color: '#9CA3AF' }}>
                    {report.healthRegion} · {report.obesityRate > 30 ? '잠재 수요 높음' : '평균 수준'}
                  </p>
                </>
              ) : (
                <>
                  <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 6 }}>공공시설 비율</p>
                  <p style={{ fontSize: 28, fontWeight: 800, color: '#2552FE', letterSpacing: '-1px', marginBottom: 4 }}>
                    {Number(report.publicRatio).toFixed(1)}%
                  </p>
                  <p style={{ fontSize: 11, color: '#9CA3AF' }}>경쟁 압력 지표</p>
                </>
              )}
            </div>
          </div>

          {/* AI Report */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 16 }}>AI 입지 분석 리포트</h2>
            {report.locked ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '32px 0' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <p style={{ fontSize: 13, color: '#6B7280' }}>크레딧을 사용하면 AI 분석 리포트 전체를 확인할 수 있어요.</p>
                {credits > 0
                  ? <button onClick={handleUnlock} disabled={unlocking}
                      style={{ background: '#2552FE', color: '#fff', padding: '10px 24px', borderRadius: 12, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      {unlocking ? '처리 중...' : `크레딧으로 잠금 해제 (${credits}개 보유)`}
                    </button>
                  : <button onClick={() => navigate(`/payment/${id}`)}
                      style={{ background: '#2552FE', color: '#fff', padding: '10px 24px', borderRadius: 12, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      크레딧 구매하기
                    </button>
                }
              </div>
            ) : ai ? (
              <AiReport ai={ai} />
            ) : (
              <p style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', padding: '24px 0' }}>분석 데이터를 불러올 수 없습니다.</p>
            )}
          </div>

          {/* Competitors */}
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>인근 경쟁 시설</h2>
              <Link to={`/reports/${id}/competitors`} className="no-print" style={{ fontSize: 13, color: '#2552FE', fontWeight: 500 }}>
                전체 보기 →
              </Link>
            </div>
            {report.locked ? (
              <p style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', padding: '16px 0' }}>리포트 잠금 해제 후 상세 목록을 확인할 수 있어요.</p>
            ) : (
              <CompetitorPreview reportId={id!} />
            )}
          </div>

          {/* 인쇄 전용 카피라이트 푸터 */}
          <div className="print-only" style={{ display: 'none', borderTop: '1px solid #E5E7EB', paddingTop: 12, textAlign: 'center' }}>
            <span style={{ fontSize: 10, color: '#9CA3AF' }}>© 2025 FitMap · fitmap.kr · AI 기반 창업 입지 분석 서비스</span>
          </div>
        </div>
      </main>
    </div>
  );
}

function AiReport({ ai }: { ai: AiSummary }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {ai.summary && (
        <div>
          <h3 style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>종합 요약</h3>
          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7 }}>{ai.summary}</p>
        </div>
      )}

      <div className="ai-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {ai.market_analysis && (
          <div>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>시장 분석</h3>
            <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.7 }}>{ai.market_analysis}</p>
          </div>
        )}
        {ai.competition_analysis && (
          <div>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>경쟁 분석</h3>
            <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.7 }}>{ai.competition_analysis}</p>
          </div>
        )}
        {ai.budget_analysis && (
          <div>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>예산 분석</h3>
            <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.7 }}>{ai.budget_analysis}</p>
          </div>
        )}
        {ai.score_reasoning && (
          <div>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>점수 근거</h3>
            <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.7 }}>{ai.score_reasoning}</p>
          </div>
        )}
      </div>

      <div className="ai-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {ai.cost_saving_tips && ai.cost_saving_tips.length > 0 && (
          <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 14, padding: 16 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 10 }}>비용 절감 전략</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {ai.cost_saving_tips.map((t, i) => (
                <li key={i} style={{ fontSize: 12, color: '#78350F', display: 'flex', gap: 6 }}>
                  <span style={{ flexShrink: 0 }}>·</span>{t}
                </li>
              ))}
            </ul>
          </div>
        )}
        {ai.survival_strategies && ai.survival_strategies.length > 0 && (
          <div style={{ background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 14, padding: 16 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: '#5B21B6', marginBottom: 10 }}>폐업 방지 전략</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {ai.survival_strategies.map((s, i) => (
                <li key={i} style={{ fontSize: 12, color: '#4C1D95', display: 'flex', gap: 6 }}>
                  <span style={{ flexShrink: 0 }}>·</span>{s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="ai-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {ai.risks && ai.risks.length > 0 && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 14, padding: 16 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: '#991B1B', marginBottom: 10 }}>위험 요인</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {ai.risks.map((r, i) => <li key={i} style={{ fontSize: 12, color: '#7F1D1D', display: 'flex', gap: 6 }}><span style={{ flexShrink: 0 }}>·</span>{r}</li>)}
            </ul>
          </div>
        )}
        {ai.opportunities && ai.opportunities.length > 0 && (
          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 14, padding: 16 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: '#166534', marginBottom: 10 }}>기회 요인</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {ai.opportunities.map((o, i) => <li key={i} style={{ fontSize: 12, color: '#14532D', display: 'flex', gap: 6 }}><span style={{ flexShrink: 0 }}>·</span>{o}</li>)}
            </ul>
          </div>
        )}
        {ai.recommendations && ai.recommendations.length > 0 && (
          <div style={{ background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: 14, padding: 16 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: '#1E40AF', marginBottom: 10 }}>액션 플랜</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {ai.recommendations.map((r, i) => (
                <li key={i} style={{ fontSize: 12, color: '#1E3A8A', display: 'flex', gap: 6 }}>
                  <span style={{ flexShrink: 0, fontWeight: 700 }}>{i + 1}.</span>{r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function CompetitorPreview({ reportId }: { reportId: string }) {
  const [competitors, setCompetitors] = useState<any[]>([]);

  useEffect(() => {
    client.get(`/api/v1/reports/${reportId}/competitors`)
      .then(r => setCompetitors(r.data.slice(0, 5)))
      .catch(() => {});
  }, [reportId]);

  if (competitors.length === 0) return <p style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', padding: '16px 0' }}>경쟁 시설 정보가 없습니다.</p>;

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>시설명</th>
          <th>상태</th>
          <th>규모</th>
          <th style={{ textAlign: 'right' }}>거리</th>
        </tr>
      </thead>
      <tbody>
        {competitors.map((c, i) => (
          <tr key={i}>
            <td style={{ color: '#111827', fontWeight: 500 }}>{c.name}</td>
            <td>
              <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, ...(c.status === '정상운영' ? { background: '#E1F8E8', color: '#16A34A' } : { background: '#F3F4F6', color: '#9CA3AF' }) }}>
                {c.status}
              </span>
            </td>
            <td style={{ color: '#6B7280' }}>{c.areaM2 ? `${c.areaM2}㎡` : '–'}</td>
            <td style={{ textAlign: 'right', color: '#6B7280' }}>{c.distanceM}m</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
