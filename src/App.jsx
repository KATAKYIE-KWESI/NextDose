import { useState, useEffect } from 'react';
import { Navigate, Route, Routes, Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { translations } from './translations.js';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CycleTracker from './pages/CycleTracker.jsx';
import Screening from './pages/Screening.jsx';
import Specialists from './pages/Specialists.jsx';
import Bookings from './pages/Bookings.jsx';
import HerSignalBrand from './pages/HerSignalBrand.jsx';

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
      <svg 
        viewBox="0 0 100 100" 
        width="100%" 
        height="100%" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#2DD4BF" />
          </linearGradient>
        </defs>
        <circle 
          cx="50" 
          cy="50" 
          r="44" 
          stroke="url(#waveGradient)" 
          strokeWidth="5" 
          strokeLinecap="round" 
          strokeDasharray="220"
          strokeDashoffset="30"
          opacity="0.85"
        />
        <path 
          d="M 18 52 C 30 38, 40 62, 52 50 C 64 38, 74 62, 82 48" 
          stroke="url(#waveGradient)" 
          strokeWidth="6" 
          strokeLinecap="round" 
        />
        <path 
          d="M 22 66 C 34 52, 44 76, 56 64 C 68 52, 76 72, 84 60" 
          stroke="url(#waveGradient)" 
          strokeWidth="4" 
          strokeLinecap="round" 
          opacity="0.5"
        />
      </svg>
    </div>
  );
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="auth-page">
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

function Topbar({ currentLang, setCurrentLang }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Load language strings for navigation items
  const t = translations[currentLang] || translations.en;

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  if (!user) return null;

  return (
    <header className="navbar" style={{ position: 'sticky', top: 0, zIndex: 1000, background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', width: '100%', boxSizing: 'border-box' }}>
      <div className="nav-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '12px 16px', boxSizing: 'border-box' }}>
        
        {/* Brand Logo & Name */}
        <Link to="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
          <Logo size={32} />
          <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>HerSignal</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="nav-links desktop-only-nav" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginLeft: 'auto', marginRight: '16px' }}>
          <NavLink to="/">{t.dashboard}</NavLink>
          <NavLink to="/tracker">{t.tracker}</NavLink>
          <NavLink to="/screening">{t.screening}</NavLink>
          <NavLink to="/specialists">{t.specialists}</NavLink>
          <NavLink to="/bookings">{t.bookings}</NavLink>
        </nav>

        {/* Language Selector, Desktop Logout & Mobile Hamburger Toggle */}
        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Language Dropdown Selector */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#F1F5F9', padding: '4px 8px', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
            <select 
              value={currentLang} 
              onChange={(e) => setCurrentLang(e.target.value)}
              style={{ background: 'transparent', border: 'none', fontSize: '0.8rem', fontWeight: '600', color: '#0F172A', outline: 'none', cursor: 'pointer' }}
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
              <option value="fr">Français</option>
              <option value="darija">الدارجة</option>
            </select>
          </div>

          <div className="desktop-only-action">
            <button className="nav-logout-btn" onClick={logout}>
              {t.logout}
            </button>
          </div>

          {/* Hamburger Menu Button */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-toggle"
            aria-label="Toggle navigation menu"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              width: '28px',
              height: '24px',
              padding: 0,
              zIndex: 101
            }}
          >
            <span style={{ width: '100%', height: '3px', background: '#334155', borderRadius: '2px', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
            <span style={{ width: '100%', height: '3px', background: '#334155', borderRadius: '2px', opacity: menuOpen ? 0 : 1, transition: 'all 0.3s' }}></span>
            <span style={{ width: '100%', height: '3px', background: '#334155', borderRadius: '2px', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}></span>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {menuOpen && (
        <div 
          className="mobile-dropdown-menu"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            background: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: 99,
            boxSizing: 'border-box'
          }}
        >
          <NavLink to="/" onClick={() => setMenuOpen(false)}>{t.dashboard}</NavLink>
          <NavLink to="/tracker" onClick={() => setMenuOpen(false)}>{t.tracker}</NavLink>
          <NavLink to="/screening" onClick={() => setMenuOpen(false)}>{t.screening}</NavLink>
          <NavLink to="/specialists" onClick={() => setMenuOpen(false)}>{t.specialists}</NavLink>
          <NavLink to="/bookings" onClick={() => setMenuOpen(false)}>{t.bookings}</NavLink>
          
          <div style={{ paddingTop: '12px', borderTop: '1px solid #F1F5F9', marginTop: '4px' }}>
            <button 
              className="nav-logout-btn" 
              onClick={() => { setMenuOpen(false); logout(); }}
              style={{ width: '100%', padding: '10px', textAlign: 'center' }}
            >
              {t.logout}
            </button>
          </div>
        </div>
      )}

      {/* Responsive CSS Rules */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-only-nav, .desktop-only-action {
            display: none !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-menu-toggle, .mobile-dropdown-menu {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}

export default function App() {
  const { user } = useAuth();
  const [currentLang, setCurrentLang] = useState('en');

  return (
    <div className="app-shell" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
      <Topbar currentLang={currentLang} setCurrentLang={setCurrentLang} />
      <main className="app-content" style={{ flex: 1, width: '100%', boxSizing: 'border-box' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Public Welcome/Brand Landing Page before login */}
          <Route 
            path="/welcome" 
            element={user ? <Navigate to="/" replace /> : <HerSignalBrand />} 
          />

          {/* Root route directs to Dashboard if logged in, or Welcome page if logged out */}
          <Route 
            path="/" 
            element={
              user ? (
                <PrivateRoute>
                  <Dashboard currentLang={currentLang} />
                </PrivateRoute>
              ) : (
                <Navigate to="/welcome" replace />
              )
            } 
          />

          <Route
            path="/tracker"
            element={
              <PrivateRoute>
                <CycleTracker currentLang={currentLang} />
              </PrivateRoute>
            }
          />

          <Route
            path="/screening"
            element={
              <PrivateRoute>
                <Screening currentLang={currentLang} />
              </PrivateRoute>
            }
          />
          <Route
            path="/specialists"
            element={
              <PrivateRoute>
                <Specialists currentLang={currentLang} />
              </PrivateRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <PrivateRoute>
                <Bookings currentLang={currentLang} />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}