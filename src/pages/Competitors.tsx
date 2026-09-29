import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import client from '../api/client';

interface Competitor {
  facilityId: number;
  name: string;
  category: string;
  status: string;
  lat: number;
  lng: number;
  roadAddr: string;
  areaM2: number | null;
  floor: number | null;
  isPublic: boolean;
  openWeekday: string | null;
  distanceM: number;
}

export default function Competitors() {
  const { id: reportId } = useParams<{ id: string }>();
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!reportId) return;
    client.get(`/api/v1/reports/${reportId}/competitors`)
      .then(r => setCompetitors(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [reportId]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="bg-white border-b border-gray-200 px-16 py-6">
        <div className="flex items-center gap-2 text-[13px] text-gray-400 mb-3">
          <Link to="/home" className="hover:text-gray-600">마이페이지</Link>
          <span>›</span>
          <Link to={`/reports/${reportId}`} className="hover:text-gray-600">리포트</Link>
          <span>›</span>
          <span className="text-gray-700">경쟁 시설 목록</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900">인근 경쟁 시설</h1>
        <p className="text-sm text-gray-400 mt-1">분석 반경 내 동일 업종 시설 목록입니다.</p>
      </div>

      <div className="flex-1 px-16 py-8">
        {loading ? (
          <p className="text-gray-400 text-sm">불러오는 중...</p>
        ) : competitors.length === 0 ? (
          <div className="bg-white border border-gray-200 p-12 text-center">
            <p className="text-sm text-gray-500">반경 내 경쟁 시설이 없습니다.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200">
            <table className="w-full text-[13px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">시설명</th>
                  <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">업종</th>
                  <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">상태</th>
                  <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">주소</th>
                  <th className="text-left px-5 py-3 text-xs text-gray-500 font-medium">면적</th>
                  <th className="text-right px-5 py-3 text-xs text-gray-500 font-medium">거리</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((c) => (
                  <tr key={c.facilityId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">{c.name}</td>
                    <td className="px-5 py-3 text-gray-600">{c.category}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[11px] px-2 py-0.5 rounded ${c.status === '정상운영' ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-100'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 max-w-[200px] truncate">{c.roadAddr || '-'}</td>
                    <td className="px-5 py-3 text-gray-500">{c.areaM2 ? `${c.areaM2.toLocaleString()}㎡` : '-'}</td>
                    <td className="px-5 py-3 text-right text-gray-500">{c.distanceM}m</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
