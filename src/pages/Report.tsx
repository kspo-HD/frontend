import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
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
}

interface AiSummary {
  summary?: string;
  market_analysis?: string;
  competition_analysis?: string;
  budget_analysis?: string;
  risks?: string[];
  opportunities?: string[];
  recommendations?: string[];
  score_reasoning?: string;
}

const GRADE_COLOR: Record<string, string> = {
  S: 'bg-green-100 text-green-700',
  A: 'bg-blue-100 text-blue-700',
  B: 'bg-yellow-100 text-yellow-700',
  C: 'bg-orange-100 text-orange-700',
  D: 'bg-red-100 text-red-700',
  E: 'bg-red-100 text-red-800',
};

function parseAi(raw: string | null): AiSummary | null {
  if (!raw) return null;
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
}

export default function Report() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<ReportData | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [unlocking, setUnlocking] = useState(false);
  const [loading, setLoading] = useState(true);

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
    try {
      const res = await client.post(`/api/v1/reports/${id}/unlock`);
      setReport(prev => prev ? { ...prev, isPaid: true, locked: false, summaryJson: res.data.summaryJson } : prev);
      setCredits(c => Math.max(0, c - 1));
    } catch (e: any) {
      alert(e.response?.data?.message ?? '잠금 해제에 실패했습니다.');
    } finally {
      setUnlocking(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">리포트 불러오는 중...</p>
    </div>
  );
  if (!report) return null;

  const radiusLabel = report.radiusM >= 1000 ? `${report.radiusM / 1000}km` : `${report.radiusM}m`;
  const ai = parseAi(report.summaryJson);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="bg-white border-b border-gray-200 px-16 py-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold text-gray-900">{report.category} · 반경 {radiusLabel}</h1>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${GRADE_COLOR[report.grade] ?? 'bg-gray-100 text-gray-600'}`}>
              {report.grade}등급
            </span>
          </div>
          <p className="text-sm text-gray-400">{report.createdAt?.slice(0, 10)} 분석 생성</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-gray-500">보유 크레딧: <strong className="text-gray-900">{credits}개</strong></span>
          {report.locked && (
            credits > 0
              ? <button onClick={handleUnlock} disabled={unlocking}
                  className="bg-[#3B6FD4] text-white px-5 py-2.5 text-[13px] font-bold hover:bg-[#2e5ec0] transition-colors disabled:opacity-40">
                  {unlocking ? '처리 중...' : '크레딧으로 잠금 해제'}
                </button>
              : <button onClick={() => navigate(`/payment/${id}`)}
                  className="bg-[#3B6FD4] text-white px-5 py-2.5 text-[13px] font-bold hover:bg-[#2e5ec0] transition-colors">
                  리포트 구매
                </button>
          )}
        </div>
      </div>

      <div className="flex-1 px-16 py-8 flex flex-col gap-6">
        {/* 핵심 지표 */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: '입지 점수', value: `${report.score}점`, sub: '100점 만점' },
            { label: '경쟁 시설 수', value: `${report.competitorCount}개`, sub: `반경 ${radiusLabel} 내` },
            { label: '폐업률', value: `${Number(report.closureRate).toFixed(1)}%`, sub: '낮을수록 안정적' },
            { label: '공공시설 비율', value: `${Number(report.publicRatio).toFixed(1)}%`, sub: '경쟁 압력 지표' },
          ].map((m) => (
            <div key={m.label} className="bg-white border border-gray-200 p-5">
              <p className="text-xs text-gray-400 mb-1">{m.label}</p>
              <p className="text-[28px] font-bold text-[#3B6FD4]">{m.value}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{m.sub}</p>
            </div>
          ))}
        </div>

        {/* AI 분석 요약 */}
        <div className="bg-white border border-gray-200 p-7">
          <h2 className="text-base font-bold text-gray-900 mb-5">AI 입지 분석 리포트</h2>
          {report.locked ? (
            <div className="flex flex-col items-center gap-4 py-10">
              <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-sm text-gray-500">크레딧을 사용하면 AI 분석 리포트 전체를 확인할 수 있어요.</p>
              {credits > 0
                ? <button onClick={handleUnlock} disabled={unlocking}
                    className="bg-[#3B6FD4] text-white px-6 py-2.5 text-sm font-bold hover:bg-[#2e5ec0] transition-colors">
                    {unlocking ? '처리 중...' : `크레딧으로 잠금 해제 (${credits}개 보유)`}
                  </button>
                : <button onClick={() => navigate(`/payment/${id}`)}
                    className="bg-[#3B6FD4] text-white px-6 py-2.5 text-sm font-bold hover:bg-[#2e5ec0] transition-colors">
                    크레딧 구매하기
                  </button>
              }
            </div>
          ) : ai ? (
            <AiReport ai={ai} />
          ) : (
            <p className="text-sm text-gray-400 text-center py-6">분석 데이터를 불러올 수 없습니다.</p>
          )}
        </div>

        {/* 경쟁 시설 */}
        <div className="bg-white border border-gray-200 p-7">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">인근 경쟁 시설</h2>
            <Link to={`/reports/${id}/competitors`} className="text-[13px] text-[#3B6FD4] hover:underline">
              전체 보기 →
            </Link>
          </div>
          {report.locked ? (
            <p className="text-sm text-gray-400 py-4 text-center">리포트 잠금 해제 후 상세 목록을 확인할 수 있어요.</p>
          ) : (
            <CompetitorPreview reportId={id!} />
          )}
        </div>
      </div>
    </div>
  );
}

function AiReport({ ai }: { ai: AiSummary }) {
  return (
    <div className="flex flex-col gap-6">
      {ai.summary && (
        <div>
          <h3 className="text-[13px] font-bold text-gray-500 uppercase tracking-wide mb-2">종합 요약</h3>
          <p className="text-[14px] text-gray-800 leading-relaxed">{ai.summary}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {ai.market_analysis && (
          <div>
            <h3 className="text-[13px] font-bold text-gray-500 uppercase tracking-wide mb-2">시장 분석</h3>
            <p className="text-[13px] text-gray-700 leading-relaxed">{ai.market_analysis}</p>
          </div>
        )}
        {ai.competition_analysis && (
          <div>
            <h3 className="text-[13px] font-bold text-gray-500 uppercase tracking-wide mb-2">경쟁 분석</h3>
            <p className="text-[13px] text-gray-700 leading-relaxed">{ai.competition_analysis}</p>
          </div>
        )}
        {ai.budget_analysis && (
          <div>
            <h3 className="text-[13px] font-bold text-gray-500 uppercase tracking-wide mb-2">예산 분석</h3>
            <p className="text-[13px] text-gray-700 leading-relaxed">{ai.budget_analysis}</p>
          </div>
        )}
        {ai.score_reasoning && (
          <div>
            <h3 className="text-[13px] font-bold text-gray-500 uppercase tracking-wide mb-2">점수 근거</h3>
            <p className="text-[13px] text-gray-700 leading-relaxed">{ai.score_reasoning}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {ai.risks && ai.risks.length > 0 && (
          <div className="bg-red-50 border border-red-100 rounded p-4">
            <h3 className="text-[12px] font-bold text-red-600 mb-2">위험 요인</h3>
            <ul className="flex flex-col gap-1.5">
              {ai.risks.map((r, i) => (
                <li key={i} className="text-[12px] text-red-700 flex gap-1.5">
                  <span className="shrink-0 mt-0.5">·</span>{r}
                </li>
              ))}
            </ul>
          </div>
        )}
        {ai.opportunities && ai.opportunities.length > 0 && (
          <div className="bg-green-50 border border-green-100 rounded p-4">
            <h3 className="text-[12px] font-bold text-green-600 mb-2">기회 요인</h3>
            <ul className="flex flex-col gap-1.5">
              {ai.opportunities.map((o, i) => (
                <li key={i} className="text-[12px] text-green-700 flex gap-1.5">
                  <span className="shrink-0 mt-0.5">·</span>{o}
                </li>
              ))}
            </ul>
          </div>
        )}
        {ai.recommendations && ai.recommendations.length > 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded p-4">
            <h3 className="text-[12px] font-bold text-[#3B6FD4] mb-2">전략 추천</h3>
            <ul className="flex flex-col gap-1.5">
              {ai.recommendations.map((r, i) => (
                <li key={i} className="text-[12px] text-blue-700 flex gap-1.5">
                  <span className="shrink-0 mt-0.5">·</span>{r}
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

  if (competitors.length === 0) return <p className="text-sm text-gray-400 py-4 text-center">경쟁 시설 정보가 없습니다.</p>;

  return (
    <table className="w-full text-[13px]">
      <thead>
        <tr className="border-b border-gray-100">
          <th className="text-left py-2 text-xs text-gray-400 font-medium">시설명</th>
          <th className="text-left py-2 text-xs text-gray-400 font-medium">상태</th>
          <th className="text-left py-2 text-xs text-gray-400 font-medium">규모</th>
          <th className="text-right py-2 text-xs text-gray-400 font-medium">거리</th>
        </tr>
      </thead>
      <tbody>
        {competitors.map((c, i) => (
          <tr key={i} className="border-b border-gray-50">
            <td className="py-2 text-gray-900">{c.name}</td>
            <td className="py-2">
              <span className={`text-[11px] px-1.5 py-0.5 ${c.status === '정상운영' ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-50'}`}>
                {c.status}
              </span>
            </td>
            <td className="py-2 text-gray-500">{c.areaM2 ? `${c.areaM2}㎡` : '–'}</td>
            <td className="py-2 text-right text-gray-500">{c.distanceM}m</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
