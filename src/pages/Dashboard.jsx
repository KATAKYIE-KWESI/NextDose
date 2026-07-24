import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { api } from '../api/client.js';

function Logo({ size = 40, className = '' }) {
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

export default function Dashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  // Dynamic Health Data States
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  // Engagement & Privacy States
  const [selectedMood, setSelectedMood] = useState(null);
  const [discreetMode, setDiscreetMode] = useState(false);
  const [carePoints, setCarePoints] = useState(120);
  const [auraInsight, setAuraInsight] = useState("Analyzing your personal wellness rhythm securely...");

  // Mobile Expandable Nav State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // User details
  const firstName = user?.name 
    ? user.name.trim().split(' ')[0] 
    : user?.email 
      ? user.email.split('@')[0] 
      : 'there';

  // Load user cycle history on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchTrackerData() {
      try {
        const response = await api.listLogs();
        const rawLogs = Array.isArray(response) ? response : (response?.logs || []);
        if (isMounted) {
          setLogs(rawLogs);
        }
      } catch (err) {
        console.error('Failed to load logs for dashboard:', err);
      } finally {
        if (isMounted) setLoadingLogs(false);
      }
    }
    fetchTrackerData();
    return () => { isMounted = false; };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // --- Dynamic Cycle Calculations ---
  const cycleLength = 28; 

  const periodLogs = logs
    .filter((l) => l.type === 'period')
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const latestPeriod = periodLogs[0];
  
  let currentDay = 14; 
  let currentPhase = "Ovulation Phase";
  let daysUntilNext = 14;

  if (latestPeriod?.date) {
    const lastDate = new Date(latestPeriod.date);
    const today = new Date();
    const diffTime = Math.abs(today - lastDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    currentDay = diffDays > 0 ? diffDays : 1;
    daysUntilNext = Math.max(0, cycleLength - currentDay);

    if (currentDay <= 5) {
      currentPhase = "Menstrual Phase";
    } else if (currentDay <= 13) {
      currentPhase = "Follicular Phase";
    } else if (currentDay <= 16) {
      currentPhase = "Ovulation Phase";
    } else {
      currentPhase = "Luteal Phase";
    }
  }

  // Set Dynamic Aura AI Insight when phase or logs change
  useEffect(() => {
    const moodLog = logs.find(l => l.symptoms?.length > 0);
    const latestMood = moodLog?.symptoms?.[0] || selectedMood;
    
    let copy = "Prioritizing rest during high-stress weeks protects your hormonal rhythm. Take 5 deep breaths today.";
    if (currentPhase === "Menstrual Phase") {
      copy = "Your body is in its renewal phase. Warm hydration and gentle pacing will support your comfort today.";
    } else if (currentPhase === "Luteal Phase") {
      copy = "Progesterone is shifting inward. Give yourself permission to step back and protect your emotional space.";
    } else if (latestMood === 'Crampy') {
      copy = "We noticed discomfort logged. Consider a gentle stretch or reaching out to a specialist if needed.";
    }
    setAuraInsight(copy);
  }, [currentPhase, logs, selectedMood]);

  // Determine dynamic river gradient/accent colors using modern palette
  const getRiverTheme = () => {
    switch (currentPhase) {
      case 'Menstrual Phase':
        return {
          gradient: 'linear-gradient(90deg, rgba(74, 222, 128, 0.12) 0%, rgba(34, 197, 94, 0.22) 100%)',
          waveStroke: '#22c55e',
          badgeBg: '#dcfce7',
          badgeColor: '#166534',
        };
      case 'Follicular Phase':
        return {
          gradient: 'linear-gradient(90deg, rgba(56, 189, 248, 0.12) 0%, rgba(13, 148, 136, 0.22) 100%)',
          waveStroke: '#0ea5e9',
          badgeBg: '#e0f2fe',
          badgeColor: '#0369a1',
        };
      case 'Ovulation Phase':
        return {
          gradient: 'linear-gradient(90deg, rgba(45, 212, 191, 0.12) 0%, rgba(56, 189, 248, 0.22) 100%)',
          waveStroke: '#2dd4bf',
          badgeBg: '#ccfbf1',
          badgeColor: '#115e59',
        };
      default: // Luteal Phase
        return {
          gradient: 'linear-gradient(90deg, rgba(148, 163, 184, 0.15) 0%, rgba(74, 222, 128, 0.18) 100%)',
          waveStroke: '#94a3b8',
          badgeBg: '#f1f5f9',
          badgeColor: '#475569',
        };
    }
  };

  const riverTheme = getRiverTheme();

  return (
    <div className={`dashboard-container dashboard-rich ${discreetMode ? 'discreet-active' : ''}`} style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '16px 12px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif', color: '#334155', backgroundColor: '#FBFBFA' }}>
      
      {/* SINGLE UNIFIED NAVBAR (INCLUDING BRANDING, LINKS, CARE POINTS, PRIVACY SHIELD, & LOGOUT) */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px', background: '#FFFFFF', padding: '10px 20px', borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(100, 116, 139, 0.04)', position: 'relative', zIndex: 50 }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Logo size={38} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#581C87', letterSpacing: '-0.3px' }}>HerSignal</span>
          </div>
        </div>

        {/* Desktop Links & Action Badges */}
        <div className="desktop-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/" style={{ fontSize: '0.95rem', fontWeight: location.pathname === '/' ? '600' : '400', color: location.pathname === '/' ? '#581C87' : '#475569', textDecoration: 'none', borderBottom: location.pathname === '/' ? '2px solid #581C87' : 'none', paddingBottom: '2px' }}>Dashboard</Link>
          <Link to="/tracker" style={{ fontSize: '0.95rem', fontWeight: location.pathname === '/tracker' ? '600' : '400', color: location.pathname === '/tracker' ? '#581C87' : '#475569', textDecoration: 'none', borderBottom: location.pathname === '/tracker' ? '2px solid #581C87' : 'none', paddingBottom: '2px' }}>Tracker</Link>
          <Link to="/maternal" style={{ fontSize: '0.95rem', fontWeight: location.pathname === '/maternal' ? '600' : '400', color: location.pathname === '/maternal' ? '#581C87' : '#475569', textDecoration: 'none', borderBottom: location.pathname === '/maternal' ? '2px solid #581C87' : 'none', paddingBottom: '2px' }}>Maternal Journey</Link>
          <Link to="/screening" style={{ fontSize: '0.95rem', fontWeight: location.pathname === '/screening' ? '600' : '400', color: location.pathname === '/screening' ? '#581C87' : '#475569', textDecoration: 'none', borderBottom: location.pathname === '/screening' ? '2px solid #581C87' : 'none', paddingBottom: '2px' }}>Screening</Link>
          <Link to="/specialists" style={{ fontSize: '0.95rem', fontWeight: location.pathname === '/specialists' ? '600' : '400', color: location.pathname === '/specialists' ? '#581C87' : '#475569', textDecoration: 'none', borderBottom: location.pathname === '/specialists' ? '2px solid #581C87' : 'none', paddingBottom: '2px' }}>Specialists</Link>

          {/* Integrated Care Points Badge */}
          <div className="utility-item care-points-badge" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', background: '#F1F5F9', padding: '4px 10px', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
            <span>✨</span>
            <strong>{carePoints} pts</strong>
          </div>

          {/* Integrated Privacy Shield Toggle Button */}
          <button 
            className={`discreet-toggle-btn ${discreetMode ? 'on' : ''}`}
            onClick={() => setDiscreetMode(!discreetMode)}
            title="Shield sensitive cycle details on screen with Zero-Knowledge masking"
            style={{ padding: '5px 10px', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '8px', border: '1px solid #CBD5E1', background: discreetMode ? '#E2E8F0' : '#fff', color: discreetMode ? '#1E293B' : '#334155', fontWeight: '500' }}
          >
            {discreetMode ? '🔒 Shield' : '👁️ Privacy'}
          </button>

          {user && (
            <button onClick={logout} style={{ background: 'transparent', border: '1px solid #CBD5E1', padding: '5px 12px', borderRadius: '20px', fontSize: '0.85rem', cursor: 'pointer', color: '#475569', fontWeight: '500' }}>
              Log out
            </button>
          )}
        </div>

        {/* Mobile Hamburger / Expandable Toggle Button */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          style={{ display: 'none', background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontSize: '1rem', fontWeight: '600', alignItems: 'center', gap: '6px' }}
        >
          <span>{mobileMenuOpen ? '✕ Close' : '☰ Menu'}</span>
        </button>

        {/* Expandable Mobile Dropdown Menu Container */}
        {mobileMenuOpen && (
          <div className="mobile-dropdown-menu" style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#FFFFFF', border: '1px solid #E2E8F0', borderTop: 'none', borderRadius: '0 0 16px 16px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 60, animation: 'fadeIn 0.2s ease-in-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748B' }}>✨ {carePoints} Care Points</span>
              <button 
                onClick={() => setDiscreetMode(!discreetMode)}
                style={{ padding: '4px 8px', fontSize: '0.78rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: discreetMode ? '#E2E8F0' : '#fff', color: '#334155' }}
              >
                {discreetMode ? '🔒 Shield Active' : '👁️ Privacy Shield'}
              </button>
            </div>
            <Link to="/" style={{ padding: '10px 12px', borderRadius: '8px', background: location.pathname === '/' ? '#F3E8FF' : 'transparent', fontSize: '0.95rem', fontWeight: location.pathname === '/' ? '600' : '400', color: location.pathname === '/' ? '#581C87' : '#334155', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/tracker" style={{ padding: '10px 12px', borderRadius: '8px', background: location.pathname === '/tracker' ? '#F3E8FF' : 'transparent', fontSize: '0.95rem', fontWeight: location.pathname === '/tracker' ? '600' : '400', color: location.pathname === '/tracker' ? '#581C87' : '#334155', textDecoration: 'none' }}>Tracker</Link>
            <Link to="/maternal" style={{ padding: '10px 12px', borderRadius: '8px', background: location.pathname === '/maternal' ? '#F3E8FF' : 'transparent', fontSize: '0.95rem', fontWeight: location.pathname === '/maternal' ? '600' : '400', color: location.pathname === '/maternal' ? '#581C87' : '#334155', textDecoration: 'none' }}>Maternal Journey</Link>
            <Link to="/screening" style={{ padding: '10px 12px', borderRadius: '8px', background: location.pathname === '/screening' ? '#F3E8FF' : 'transparent', fontSize: '0.95rem', fontWeight: location.pathname === '/screening' ? '600' : '400', color: location.pathname === '/screening' ? '#581C87' : '#334155', textDecoration: 'none' }}>Screening</Link>
            <Link to="/specialists" style={{ padding: '10px 12px', borderRadius: '8px', background: location.pathname === '/specialists' ? '#F3E8FF' : 'transparent', fontSize: '0.95rem', fontWeight: location.pathname === '/specialists' ? '600' : '400', color: location.pathname === '/specialists' ? '#581C87' : '#334155', textDecoration: 'none' }}>Specialists</Link>
            {user && (
              <button onClick={logout} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: '8px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem', marginTop: '4px' }}>
                Log out
              </button>
            )}
          </div>
        )}
      </nav>

      {/* CSS injection for responsive mobile view switching */}
      <style>{`
        @media (max-width: 860px) {
          .desktop-nav-links {
            display: none !important;
          }
          .mobile-menu-toggle {
            display: flex !important;
          }
        }
      `}</style>

      {/* HERO / GREETING BANNER */}
      <header className="dashboard-hero" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px', background: '#F0F9FF', padding: '20px', borderRadius: '16px', border: '1px solid #BAE6FD' }}>
        <div className="hero-text" style={{ flex: '1 1 250px' }}>
          <h1 className="greeting-title" style={{ fontSize: 'clamp(1.5rem, 4vw, 1.8rem)', margin: '0 0 6px 0', fontWeight: '700', color: '#0369A1' }}>
            Good morning, {firstName}
          </h1>
          <p className="greeting-subtitle" style={{ fontSize: '0.95rem', color: '#0284C7', margin: 0 }}>
            Your body is in the <span style={{ color: '#0369A1', fontWeight: '600' }}>{discreetMode ? 'protected phase' : currentPhase.toLowerCase()}</span>.
          </p>
        </div>
        <div className="hero-avatar" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #E0F2FE 100%, #BAE6FD 0%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(3, 105, 161, 0.08)' }}>
            <span style={{ fontSize: '24px' }}>🌅</span>
          </div>
        </div>
      </header>

      {/* SIGNAL RIVER FEATURED COMPONENT */}
      <div className="card signal-river-card" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(100, 116, 139, 0.04)', marginBottom: '20px', padding: '20px', borderRadius: '16px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0, color: '#1E293B' }}>Signal River</h2>
            <span title="Your body's signals over the last 7 days" style={{ cursor: 'pointer', fontSize: '0.85rem', color: '#94A3B8' }}>ⓘ</span>
          </div>
          <span style={{ fontSize: '0.78rem', fontWeight: '600', color: riverTheme.badgeColor, background: riverTheme.badgeBg, padding: '3px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            ✨ Pattern noticed
          </span>

        </div>
        <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0 0 16px 0' }}>
          Your body's signals over the last 7 days
        </p>

        {/* Graphical River Wave UI Simulation */}
        <div style={{ position: 'relative', background: riverTheme.gradient, borderRadius: '12px', padding: '20px 10px 16px 10px', marginBottom: '16px', overflow: 'hidden' }}>
          
          {/* SVG Wave Line Overlay */}
          <div style={{ position: 'absolute', top: '35px', left: 0, right: 0, height: '40px', pointerEvents: 'none', opacity: 0.4 }}>
            <svg viewBox="0 0 500 50" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <path d="M 0,25 Q 60,5 125,25 T 250,25 T 375,15 T 500,25" fill="none" stroke={riverTheme.waveStroke} strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>

          {/* Timeline Nodes / Markers */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 2, textAlign: 'center', gap: '4px' }}>
            
            {/* Day -5 */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#0ea5e9', fontWeight: '600', marginBottom: '4px' }}>Fatigue</span>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', marginBottom: '8px', border: '2px solid #fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                ⚡
              </div>
              <div style={{ width: '2px', height: '12px', background: '#CBD5E1', marginBottom: '6px' }}></div>
              <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>Thu</span>
              <span style={{ fontSize: '0.72rem', fontWeight: '600', color: '#334155', display: 'block' }}>May 9</span>
            </div>

            {/* Day -4 */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: '600', marginBottom: '4px' }}>Poor sleep</span>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', marginBottom: '8px', border: '2px solid #fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                🌙
              </div>
              <div style={{ width: '2px', height: '12px', background: '#CBD5E1', marginBottom: '6px' }}></div>
              <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>Fri</span>
              <span style={{ fontSize: '0.72rem', fontWeight: '600', color: '#334155', display: 'block' }}>May 10</span>
            </div>

            {/* Day -3 (Headache below) */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'transparent', marginBottom: '4px' }}>&nbsp;</span>
              <div style={{ height: '28px', display: 'flex', alignItems: 'center', marginBottom: '8px' }}></div>
              <div style={{ width: '2px', height: '8px', background: 'transparent', marginBottom: '6px' }}></div>
              <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>Sat</span>
              <span style={{ fontSize: '0.72rem', fontWeight: '600', color: '#334155', display: 'block' }}>May 11</span>
              {/* Lower node for Headache */}
              <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#F1F5F9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', border: '1px solid #CBD5E1' }}>
                  👤
                </div>
                <span style={{ fontSize: '0.68rem', color: '#475569', marginTop: '2px' }}>Headache</span>
              </div>
            </div>

            {/* Day -2 */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'transparent', marginBottom: '4px' }}>&nbsp;</span>
              <div style={{ height: '28px', display: 'flex', alignItems: 'center', marginBottom: '8px' }}></div>
              <div style={{ width: '2px', height: '12px', background: '#CBD5E1', marginBottom: '6px' }}></div>
              <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>Sun</span>
              <span style={{ fontSize: '0.72rem', fontWeight: '600', color: '#334155', display: 'block' }}>May 12</span>
            </div>

            {/* Day -1 */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: '600', marginBottom: '4px' }}>Mild cramps</span>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', marginBottom: '8px', border: '2px solid #fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                〰️
              </div>
              <div style={{ width: '2px', height: '12px', background: '#CBD5E1', marginBottom: '6px' }}></div>
              <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>Mon</span>
              <span style={{ fontSize: '0.72rem', fontWeight: '600', color: '#334155', display: 'block' }}>May 13</span>
            </div>

            {/* Day 0 */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#0d9488', fontWeight: '600', marginBottom: '4px' }}>Ovulation window starts</span>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ccfbf1', color: '#115e59', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', marginBottom: '8px', border: '2px solid #fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                ◎
              </div>
              <div style={{ width: '2px', height: '12px', background: '#CBD5E1', marginBottom: '6px' }}></div>
              <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>Tue</span>
              <span style={{ fontSize: '0.72rem', fontWeight: '600', color: '#334155', display: 'block' }}>May 14</span>
            </div>

            {/* Today */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'transparent', marginBottom: '4px' }}>&nbsp;</span>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#0ea5e9', marginBottom: '16px', border: '2px solid #fff', boxShadow: '0 0 0 2px #0ea5e9' }}></div>
              <div style={{ width: '2px', height: '12px', background: '#0ea5e9', marginBottom: '6px' }}></div>
              <span style={{ fontSize: '0.72rem', color: '#0ea5e9', fontWeight: '700', display: 'block' }}>Today</span>
              <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#0ea5e9', display: 'block' }}>May 15</span>
            </div>

          </div>
        </div>

        {/* Signal Flow Interpretation Box */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F0F9FF', padding: '12px 14px', borderRadius: '10px', border: '1px solid #BAE6FD' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#E0F2FE', color: '#0369A1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
            🌊
          </div>
          <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: '1.4' }}>
            <strong>Your recent signal flow:</strong> fatigue and poor sleep appeared together twice this week. Your flow is calmer today.
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '2px', fontStyle: 'italic' }}>
              This is a personalized interpretation, not a medical diagnosis.
            </div>
          </div>
        </div>
      </div>

      {/* STANDOUT SUPPORTIVE AURA AI COMPANION BANNER */}
      <div className="card aura-ai-featured-banner" style={{ background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)', border: '2px solid #BBF7D0', boxShadow: '0 8px 24px rgba(34, 197, 94, 0.08)', marginBottom: '20px', padding: '16px', borderRadius: '16px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ background: '#22c55e', color: '#fff', fontSize: '22px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', flexShrink: 0, boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)' }} title="Supportive Companion">
            👩‍❤️‍👩
          </div>
          <div style={{ flex: '1 1 250px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span style={{ background: '#fff', color: '#15803D', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px', border: '1px solid #BBF7D0' }}>
                Aura AI · Supportive Sisterhood
              </span>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%', display: 'inline-block' }}></span> 
                Encrypted
              </span>
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#166534', marginBottom: '4px' }}>
              Your Safe Space Guidance
            </h2>
            <p style={{ fontSize: '14px', color: '#166534', lineHeight: '1.4', fontStyle: 'italic', margin: 0, overflowWrap: 'break-word' }}>
              "{auraInsight}"
            </p>
          </div>
        </div>
      </div>

      {/* TODAY'S FOCUS SECTION */}
      <section className="section-block" style={{ marginBottom: '24px' }}>
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 className="section-title" style={{ fontSize: '1.15rem', margin: 0, fontWeight: '700', color: '#1E293B' }}>Today's Focus</h2>
          <Link to="/tracker" style={{ fontSize: '0.85rem', color: '#0EA5E9', textDecoration: 'none', fontWeight: '600' }}>Edit</Link>
        </div>

        <div className="two-column-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
          
          <Link to="/tracker" className="card" style={{ padding: '16px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center', textDecoration: 'none', color: '#1E293B', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
              🩸
            </div>
            <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>Log symptoms</span>
          </Link>

          <Link to="/tracker" className="card" style={{ padding: '16px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center', textDecoration: 'none', color: '#1E293B', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F8FAFC', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
              😊
            </div>
            <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>Log mood</span>
          </Link>

          <Link to="/tracker" className="card" style={{ padding: '16px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center', textDecoration: 'none', color: '#1E293B', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ccfbf1', color: '#115e59', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
              🌡️
            </div>
            <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>Log BBT</span>
          </Link>

          <Link to="/tracker" className="card" style={{ padding: '16px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center', textDecoration: 'none', color: '#1E293B', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
              💊
            </div>
            <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>Log medication</span>
          </Link>

        </div>
      </section>

      {/* UPCOMING SECTION */}
      <section className="section-block" style={{ marginBottom: '24px' }}>
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 className="section-title" style={{ fontSize: '1.15rem', margin: 0, fontWeight: '700', color: '#1E293B' }}>Upcoming</h2>
          <Link to="/tracker" style={{ fontSize: '0.85rem', color: '#0EA5E9', textDecoration: 'none', fontWeight: '600' }}>View all</Link>
        </div>

        <div className="card" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#F3E8FF', color: '#7E22CE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
              📅
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#7E22CE', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '2px' }}>
                Next Period in ~{daysUntilNext} days
              </span>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1E293B', margin: '0 0 4px 0' }}>
                Expected Window
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
                Estimated start based on your recent 28-day cycle rhythm.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#E0F2FE', color: '#0369A1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
              🩺
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#0369A1', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '2px' }}>
                Wellness Check
              </span>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1E293B', margin: '0 0 4px 0' }}>
                Specialist Consultation
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
                Explore verified gynecologists or mental wellness experts anytime.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}