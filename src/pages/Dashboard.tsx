import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import client from '../api/client';

interface Stats {
  total: number;
  categories: { category: string; count: number }[];
  regions: { sido: string; count: number }[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    client.get('/api/v1/facilities/stats')
      .then(r => setStats(r.data))
      .catch(() => {});
  }, []);

  const maxCategoryCount = stats ? Math.max(...stats.categories.map(c => Number(c.count))) : 1;
  const topRegions = stats?.regions.slice(0, 10) ?? [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="bg-white border-b border-gray-200 px-16 py-8">
        <h1 className="text-2xl font-bold text-gray-900">전국 피트니스 시설 대시보드</h1>
        <p className="text-sm text-gray-500 mt-2">스포츠시설 명세서 + 공공개방시설 데이터 기반</p>
      </div>

      <div className="flex-1 px-16 py-8 flex flex-col gap-8">
        {/* 요약 카드 */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: '전체 시설 수', value: stats ? stats.total.toLocaleString() + '개' : '–' },
            { label: '업종 수', value: stats ? stats.categories.length + '종' : '–' },
            { label: '등록 시도', value: stats ? stats.regions.length + '개' : '–' },
            { label: '정상운영 비율', value: '–' },
          ].map((m) => (
            <div key={m.label} className="bg-white border border-gray-200 p-5">
              <p className="text-xs text-gray-400">{m.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{m.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* 업종별 분포 */}
          <div className="bg-white border border-gray-200 p-7">
            <h2 className="text-base font-bold text-gray-900 mb-5">업종별 시설 수</h2>
            {stats ? (
              <div className="flex flex-col gap-3">
                {stats.categories.map((c) => (
                  <div key={c.category} className="flex items-center gap-3">
                    <span className="text-[13px] text-gray-600 w-28 shrink-0">{c.category}</span>
                    <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#3B6FD4] rounded-full"
                        style={{ width: `${(Number(c.count) / maxCategoryCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-[13px] text-gray-500 w-16 text-right">{Number(c.count).toLocaleString()}개</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-gray-400">불러오는 중...</p>}
          </div>

          {/* 지역별 분포 */}
          <div className="bg-white border border-gray-200 p-7">
            <h2 className="text-base font-bold text-gray-900 mb-5">지역별 시설 수 (상위 10개)</h2>
            {stats ? (
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left pb-2 text-xs text-gray-400 font-medium">시도</th>
                    <th className="text-right pb-2 text-xs text-gray-400 font-medium">시설 수</th>
                    <th className="text-right pb-2 text-xs text-gray-400 font-medium">비율</th>
                  </tr>
                </thead>
                <tbody>
                  {topRegions.map((r) => (
                    <tr key={r.sido} className="border-b border-gray-50">
                      <td className="py-2 text-gray-900">{r.sido}</td>
                      <td className="py-2 text-right text-gray-600">{Number(r.count).toLocaleString()}개</td>
                      <td className="py-2 text-right text-gray-400">
                        {((Number(r.count) / (stats.total || 1)) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p className="text-sm text-gray-400">불러오는 중...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
