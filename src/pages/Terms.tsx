import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
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
    <div className="app-shell">
      <Sidebar />
      <main className="fm-main">
        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 720 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => navigate(-1)}
              style={{ width: 34, height: 34, border: '1.5px solid #E5E7EB', borderRadius: 10, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', letterSpacing: '-0.5px' }}>이용약관</h1>
          </div>

          <div className="glass-card" style={{ padding: 28 }}>
            <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 24 }}>시행일: 2024년 1월 1일</p>

            {loading ? (
              <p style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', padding: '32px 0' }}>불러오는 중...</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {terms.map((t, i) => (
                  <div key={t.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h2 style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>제{i + 1}조 {t.title}</h2>
                      {t.isRequired && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#2552FE', background: '#EEF2FF', padding: '2px 6px', borderRadius: 5 }}>필수</span>
                      )}
                    </div>
                    <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.7 }}>{t.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
