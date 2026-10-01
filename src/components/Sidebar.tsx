import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCreditStore } from '../store/creditStore';
import { getMe, type Me } from '../api/user';

export default function Sidebar() {
  const { isLoggedIn, logout } = useAuthStore();
  const { credits, fetchCredits, setCredits } = useCreditStore();
  const navigate = useNavigate();
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    if (!isLoggedIn) { setCredits(0); setMe(null); return; }
    fetchCredits();
    getMe().then(setMe).catch(() => {});
  }, [isLoggedIn]);

  const navItems = [
    {
      to: '/dashboard', label: '대시보드',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
    },
    {
      to: '/map', label: '지도 탐색',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>,
    },
    {
      to: '/analysis', label: '창업 입지 분석',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    },
    ...(isLoggedIn ? [{
      to: '/home', label: '마이페이지',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    }] : []),
  ];

  return (
    <aside className="fm-sidebar">
      <div>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#FFF', fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px', padding: '4px 8px 24px 8px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          FitMap
        </div>

        {/* Navigation */}
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {navItems.map(item => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div>
        {/* Credits */}
        {isLoggedIn && credits !== null && (
          <NavLink
            to="/payment/new"
            className="nav-link"
            style={{ marginBottom: 8, background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            크레딧
            <span style={{ marginLeft: 'auto', color: '#fff', fontWeight: 700 }}>{credits}개</span>
          </NavLink>
        )}

        {/* User Profile */}
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginBottom: 10, lineHeight: 1.5 }}>
          © 2026 FitMap
        </p>

        {isLoggedIn ? (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 13, flexShrink: 0 }}>
              {me?.name?.[0] ?? '?'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {me?.name ?? '로딩 중...'}
              </div>
              <button
                onClick={() => { logout(); navigate('/'); }}
                style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 2 }}
              >
                로그아웃
              </button>
            </div>
          </div>
        ) : (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 14 }}>
            <NavLink to="/login" className="nav-link" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', justifyContent: 'center', fontWeight: 600 }}>
              시작하기
            </NavLink>
          </div>
        )}
      </div>
    </aside>
  );
}
