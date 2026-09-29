import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import client from '../api/client';

interface Term {
  id: number;
  title: string;
  content: string;
  version: string;
  isRequired: boolean;
}

export default function Terms() {
  const navigate = useNavigate();
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/api/v1/terms')
      .then(r => setTerms(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 px-16 py-8 max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">이용약관</h1>
        </div>

        <div className="bg-white border border-gray-200 p-8 flex flex-col gap-7">
          <p className="text-[12px] text-gray-400">시행일: 2024년 1월 1일</p>

          {loading ? (
            <p className="text-sm text-gray-400 text-center py-8">불러오는 중...</p>
          ) : (
            terms.map((t, i) => (
              <div key={t.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-[14px] font-bold text-gray-900">제{i + 1}조 {t.title}</h2>
                  {t.isRequired && (
                    <span className="text-[10px] font-semibold text-[#3B6FD4] bg-blue-50 px-1.5 py-0.5 rounded">필수</span>
                  )}
                </div>
                <p className="text-[13px] text-gray-600 leading-relaxed">{t.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
