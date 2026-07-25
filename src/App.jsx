import React, { useEffect } from 'react';
import { Navigate, Route, Routes, Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { LanguageProvider, useLanguage } from './context/LanguageContext.jsx';
import { translations } from './translations.js';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CycleTracker from './pages/CycleTracker.jsx';
import Screening from './pages/Screening.jsx';
import Specialists from './pages/Specialists.jsx';
import Bookings from './pages/Bookings.jsx';
import HerSignalBrand from './pages/HerSignalBrand.jsx';
import HerSignalCommunityAndCare from './pages/HerSignalCommunityAndCare.jsx';

function Logo({ size = 32, className = '' }) {
  return (
    <div 
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
        boxShadow: '0 2px 6px rgba(100, 116, 139, 0.08)',
        border: '1px solid #E2E8F0',
        boxSizing: 'border-box',
        padding: `${size * 0.18}px`,
        flexShrink: 0
      }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#2DD4BF" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="44" stroke="url(#waveGradient)" strokeWidth="5" strokeLinecap="round" strokeDasharray="220" strokeDashoffset="30" opacity="0.85" />
        <path d="M 18 52 C 30 38, 40 62, 52 50 C 64 38, 74 62, 82 48" stroke="url(#waveGradient)" strokeWidth="6" strokeLinecap="round" />
        <path d="M 22 66 C 34 52, 44 76, 56 64 C 68 52, 76 72, 84 60" stroke="url(#waveGradient)" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
      </svg>
    </div>
  );
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="auth-page" style={{ padding: '40px', textAlign: 'center' }}>
        <p className="greeting-date">Loading workspace…</p>
      </div>
    );
  }
  if (!user) return <Navigate to="/welcome" replace />;
  return children;
}

function NavLink({ to, children, onClick }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link to={to} className={`nav-link${active ? ' active' : ''}`} onClick={onClick}>
      {children}
    </Link>
  );
}

function Topbar() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  if (!user) return null;

  return (
    <header className="navbar" style={{ position: 'sticky', top: 0, zIndex: 1000, background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', width: '100%', boxSizing: 'border-box' }}>
      <div className="nav-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '12px 16px', boxSizing: 'border-box' }}>
        
        <Link to="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
          <Logo size={32} />
          <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>HerSignal</span>
        </Link>

        <nav className="nav-links desktop-only-nav" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginLeft: 'auto', marginRight: '16px' }}>
          <NavLink to="/">{t('dashboard', 'Dashboard')}</NavLink>
          <NavLink to="/tracker">{t('tracker', 'Tracker')}</NavLink>
          <NavLink to="/screening">{t('screening', 'Screening')}</NavLink>
          <NavLink to="/specialists">{t('specialists', 'Specialists')}</NavLink>
          <NavLink to="/bookings">{t('bookings', 'Bookings')}</NavLink>
          <NavLink to="/community">{t('community', 'Community & Care')}</NavLink>
        </nav>

        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#F1F5F9', padding: '4px 8px', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              style={{ background: 'transparent', border: 'none', fontSize: '0.8rem', fontWeight: '600', color: '#0F172A', outline: 'none', cursor: 'pointer' }}
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
              <option value="fr">Français</option>
              <option value="darija">الدارجة</option>
            </select>
          </div>

          <div className="desktop-only-action">
            <button className="nav-logout-btn" onClick={logout} style={{ padding: '6px 12px', cursor: 'pointer', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#fff' }}>
              {t('logout', 'Logout')}
            </button>
          </div>

          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-toggle"
            aria-label="Toggle navigation menu"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', width: '28px', height: '24px', padding: 0, zIndex: 101 }}
          >
            <span style={{ width: '100%', height: '3px', background: '#334155', borderRadius: '2px', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
            <span style={{ width: '100%', height: '3px', background: '#334155', borderRadius: '2px', opacity: menuOpen ? 0 : 1, transition: 'all 0.3s' }}></span>
            <span style={{ width: '100%', height: '3px', background: '#334155', borderRadius: '2px', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}></span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-dropdown-menu" style={{ position: 'absolute', top: '100%', left: 0, width: '100%', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 99, boxSizing: 'border-box' }}>
          <NavLink to="/" onClick={() => setMenuOpen(false)}>{t('dashboard', 'Dashboard')}</NavLink>
          <NavLink to="/tracker" onClick={() => setMenuOpen(false)}>{t('tracker', 'Tracker')}</NavLink>
          <NavLink to="/screening" onClick={() => setMenuOpen(false)}>{t('screening', 'Screening')}</NavLink>
          <NavLink to="/specialists" onClick={() => setMenuOpen(false)}>{t('specialists', 'Specialists')}</NavLink>
          <NavLink to="/bookings" onClick={() => setMenuOpen(false)}>{t('bookings', 'Bookings')}</NavLink>
          <NavLink to="/community" onClick={() => setMenuOpen(false)}>{t('community', 'Community & Care')}</NavLink>
          
          <div style={{ paddingTop: '12px', borderTop: '1px solid #F1F5F9', marginTop: '4px' }}>
            <button className="nav-logout-btn" onClick={() => { setMenuOpen(false); logout(); }} style={{ width: '100%', padding: '10px', textAlign: 'center', cursor: 'pointer' }}>
              {t('logout', 'Logout')}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-only-nav, .desktop-only-action { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-toggle, .mobile-dropdown-menu { display: none !important; }
        }
      `}</style>
    </header>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <div className="app-shell" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
      <Topbar />
      <main className="app-content" style={{ flex: 1, width: '100%', boxSizing: 'border-box' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/welcome" element={user ? <Navigate to="/" replace /> : <HerSignalBrand />} />
          <Route path="/" element={user ? <PrivateRoute><Dashboard /></PrivateRoute> : <Navigate to="/welcome" replace />} />
          <Route path="/tracker" element={user ? <PrivateRoute><CycleTracker /></PrivateRoute> : <Navigate to="/welcome" replace />} />
          <Route path="/screening" element={user ? <PrivateRoute><Screening /></PrivateRoute> : <Navigate to="/welcome" replace />} />
          <Route path="/specialists" element={user ? <PrivateRoute><Specialists /></PrivateRoute> : <Navigate to="/welcome" replace />} />
          <Route path="/bookings" element={user ? <PrivateRoute><Bookings /></PrivateRoute> : <Navigate to="/welcome" replace />} />
          <Route path="/community" element={user ? <PrivateRoute><HerSignalCommunityAndCare /></PrivateRoute> : <Navigate to="/welcome" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppRoutes />
    </LanguageProvider>
  );
}