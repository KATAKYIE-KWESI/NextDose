import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { useLanguage } from '../LanguageContext.jsx'; // Centralized translation provider
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
        flexShrink: 0,
        animation: 'floatPulse 4s ease-in-out infinite'
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
  const { user } = useAuth();
  const location = useLocation();
  const { t, language, isRTL } = useLanguage(); // Pulling global translation & RTL direction context
  
  // Dynamic Health Data States
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  // Engagement & Privacy States
  const [selectedMood, setSelectedMood] = useState(null);
  const [discreetMode, setDiscreetMode] = useState(false);
  const [carePoints, setCarePoints] = useState(120);
  const [auraInsight, setAuraInsight] = useState("Analyzing your personal wellness rhythm securely...");

  // User details
  const firstName = user?.name 
    ? user.name.trim().split(' ')[0] 
    : user?.email 
      ? user.email.split('@')[0] 
      : 'there';

  // Dynamic Time-of-Day Calculation
  const getGreetingData = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return { text: t('greeting.morning', 'Good morning'), emoji: '🌅' };
    } else if (hour < 17) {
      return { text: t('greeting.afternoon', 'Good afternoon'), emoji: '☀️' };
    } else {
      return { text: t('greeting.evening', 'Good evening'), emoji: '🌙' };
    }
  };

  const greetingData = getGreetingData();

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
    
    let copy = t('aura.default', "Prioritizing rest during high-stress weeks protects your hormonal rhythm. Take 5 deep breaths today.");
    if (currentPhase === "Menstrual Phase") {
      copy = t('aura.menstrual', "Your body is in its renewal phase. Warm hydration and gentle pacing will support your comfort today.");
    } else if (currentPhase === "Luteal Phase") {
      copy = t('aura.luteal', "Progesterone is shifting inward. Give yourself permission to step back and protect your emotional space.");
    } else if (latestMood === 'Crampy') {
      copy = t('aura.crampy', "We noticed discomfort logged. Consider a gentle stretch or reaching out to a specialist if needed.");
    }
    setAuraInsight(copy);
  }, [currentPhase, logs, selectedMood, t]);

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
    <div 
      className={`dashboard-container dashboard-rich ${discreetMode ? 'discreet-active' : ''}`} 
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ 
        width: '100%', 
        maxWidth: '1000px', 
        margin: '0 auto', 
        padding: '16px 12px', 
        boxSizing: 'border-box', 
        fontFamily: 'Inter, system-ui, sans-serif', 
        color: '#334155', 
        backgroundColor: '#FBFBFA', 
        overflowX: 'hidden',
        textAlign: isRTL ? 'right' : 'left'
      }}
    >
      
      {/* Global CSS Inject for Smooth Animations */}
      <style>{`
        @keyframes floatPulse {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes softGlow {
          0%, 100% { box-shadow: 0 8px 24px rgba(34, 197, 94, 0.08); }
          50% { box-shadow: 0 12px 32px rgba(34, 197, 94, 0.18); }
        }
        .animated-entry {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animated-glow {
          animation: softGlow 3s ease-in-out infinite;
        }
      `}</style>

      {/* HERO / GREETING BANNER */}
      <header className="dashboard-hero animated-entry" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px', background: '#F0F9FF', padding: '20px', borderRadius: '16px', border: '1px solid #BAE6FD', boxSizing: 'border-box', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
        <div className="hero-text" style={{ flex: '1 1 250px', minWidth: 0 }}>
          <h1 className="greeting-title" style={{ fontSize: 'clamp(1.5rem, 4vw, 1.8rem)', margin: '0 0 6px 0', fontWeight: '700', color: '#0369A1', wordBreak: 'break-word' }}>
            {greetingData.text}, {firstName}
          </h1>
          <p className="greeting-subtitle" style={{ fontSize: '0.95rem', color: '#0284C7', margin: 0, wordBreak: 'break-word' }}>
            {t('dashboard.bodyInPhase', 'Your body is in the')} <span style={{ color: '#0369A1', fontWeight: '600' }}>{discreetMode ? t('dashboard.protectedPhase', 'protected phase') : currentPhase.toLowerCase()}</span>.
          </p>
        </div>
        <div className="hero-avatar" style={{ position: 'relative', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #E0F2FE 100%, #BAE6FD 0%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(3, 105, 161, 0.08)' }}>
            <span style={{ fontSize: '24px' }}>{greetingData.emoji}</span>
          </div>
        </div>
      </header>

      {/* SIGNAL RIVER FEATURED COMPONENT */}
      <div className="card signal-river-card animated-entry" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(100, 116, 139, 0.04)', marginBottom: '20px', padding: '20px', borderRadius: '16px', boxSizing: 'border-box', overflow: 'hidden', animationDelay: '0.1s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0, color: '#1E293B' }}>{t('river.title', 'Signal River')}</h2>
            <span title={t('river.tooltip', "Your body's signals over the last 7 days")} style={{ cursor: 'pointer', fontSize: '0.85rem', color: '#94A3B8' }}>ⓘ</span>
          </div>
          <span style={{ fontSize: '0.78rem', fontWeight: '600', color: riverTheme.badgeColor, background: riverTheme.badgeBg, padding: '3px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            ✨ {t('river.patternNoticed', 'Pattern noticed')}
          </span>

        </div>
        <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0 0 16px 0' }}>
          {t('river.subtitle', "Your body's signals over the last 7 days")}
        </p>

        {/* Graphical River Wave UI Simulation */}
        <div style={{ position: 'relative', background: riverTheme.gradient, borderRadius: '12px', padding: '20px 8px 16px 8px', marginBottom: '16px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          
          {/* SVG Wave Line Overlay */}
          <div style={{ position: 'absolute', top: '35px', left: 0, right: 0, height: '40px', pointerEvents: 'none', opacity: 0.4, minWidth: '320px' }}>
            <svg viewBox="0 0 500 50" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
              <path d="M 0,25 Q 60,5 125,25 T 250,25 T 375,15 T 500,25" fill="none" stroke={riverTheme.waveStroke} strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>

          {/* Timeline Nodes / Markers */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 2, textAlign: 'center', gap: '6px', minWidth: '320px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            
            {/* Day -5 */}
            <div style={{ flex: 1, minWidth: '38px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: '#0ea5e9', fontWeight: '600', marginBottom: '4px', whiteSpace: 'nowrap' }}>{t('days.fatigue', 'Fatigue')}</span>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', marginBottom: '8px', border: '2px solid #fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                ⚡
              </div>
              <div style={{ width: '2px', height: '12px', background: '#CBD5E1', marginBottom: '6px' }}></div>
              <span style={{ fontSize: '0.68rem', color: '#64748B', display: 'block' }}>{t('days.thu', 'Thu')}</span>
              <span style={{ fontSize: '0.68rem', fontWeight: '600', color: '#334155', display: 'block', whiteSpace: 'nowrap' }}>{t('dates.may9', 'May 9')}</span>
            </div>

            {/* Day -4 */}
            <div style={{ flex: 1, minWidth: '38px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: '#16a34a', fontWeight: '600', marginBottom: '4px', whiteSpace: 'nowrap' }}>{t('days.poorSleep', 'Poor sleep')}</span>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', marginBottom: '8px', border: '2px solid #fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                🌙
              </div>
              <div style={{ width: '2px', height: '12px', background: '#CBD5E1', marginBottom: '6px' }}></div>
              <span style={{ fontSize: '0.68rem', color: '#64748B', display: 'block' }}>{t('days.fri', 'Fri')}</span>
              <span style={{ fontSize: '0.68rem', fontWeight: '600', color: '#334155', display: 'block', whiteSpace: 'nowrap' }}>{t('dates.may10', 'May 10')}</span>
            </div>

            {/* Day -3 (Headache below) */}
            <div style={{ flex: 1, minWidth: '38px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: 'transparent', marginBottom: '4px' }}>&nbsp;</span>
              <div style={{ height: '26px', display: 'flex', alignItems: 'center', marginBottom: '8px' }}></div>
              <div style={{ width: '2px', height: '8px', background: 'transparent', marginBottom: '6px' }}></div>
              <span style={{ fontSize: '0.68rem', color: '#64748B', display: 'block' }}>{t('days.sat', 'Sat')}</span>
              <span style={{ fontSize: '0.68rem', fontWeight: '600', color: '#334155', display: 'block', whiteSpace: 'nowrap' }}>{t('dates.may11', 'May 11')}</span>
              {/* Lower node for Headache */}
              <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#F1F5F9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', border: '1px solid #CBD5E1' }}>
                  👤
                </div>
                <span style={{ fontSize: '0.6rem', color: '#475569', marginTop: '2px', whiteSpace: 'nowrap' }}>{t('days.headache', 'Headache')}</span>
              </div>
            </div>

            {/* Day -2 */}
            <div style={{ flex: 1, minWidth: '38px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: 'transparent', marginBottom: '4px' }}>&nbsp;</span>
              <div style={{ height: '26px', display: 'flex', alignItems: 'center', marginBottom: '8px' }}></div>
              <div style={{ width: '2px', height: '12px', background: '#CBD5E1', marginBottom: '6px' }}></div>
              <span style={{ fontSize: '0.68rem', color: '#64748B', display: 'block' }}>{t('days.sun', 'Sun')}</span>
              <span style={{ fontSize: '0.68rem', fontWeight: '600', color: '#334155', display: 'block', whiteSpace: 'nowrap' }}>{t('dates.may12', 'May 12')}</span>
            </div>

            {/* Day -1 */}
            <div style={{ flex: 1, minWidth: '38px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: '#15803d', fontWeight: '600', marginBottom: '4px', whiteSpace: 'nowrap' }}>{t('days.mildCramps', 'Mild cramps')}</span>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', marginBottom: '8px', border: '2px solid #fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                〰️
              </div>
              <div style={{ width: '2px', height: '12px', background: '#CBD5E1', marginBottom: '6px' }}></div>
              <span style={{ fontSize: '0.68rem', color: '#64748B', display: 'block' }}>{t('days.mon', 'Mon')}</span>
              <span style={{ fontSize: '0.68rem', fontWeight: '600', color: '#334155', display: 'block', whiteSpace: 'nowrap' }}>{t('dates.may13', 'May 13')}</span>
            </div>

            {/* Day 0 */}
            <div style={{ flex: 1, minWidth: '38px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: '#0d9488', fontWeight: '600', marginBottom: '4px', whiteSpace: 'nowrap' }}>{t('days.ovulationWindow', 'Ovulation window')}</span>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#ccfbf1', color: '#115e59', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', marginBottom: '8px', border: '2px solid #fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                ◎
              </div>
              <div style={{ width: '2px', height: '12px', background: '#CBD5E1', marginBottom: '6px' }}></div>
              <span style={{ fontSize: '0.68rem', color: '#64748B', display: 'block' }}>{t('days.tue', 'Tue')}</span>
              <span style={{ fontSize: '0.68rem', fontWeight: '600', color: '#334155', display: 'block', whiteSpace: 'nowrap' }}>{t('dates.may14', 'May 14')}</span>
            </div>

            {/* Today */}
            <div style={{ flex: 1, minWidth: '38px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: 'transparent', marginBottom: '4px' }}>&nbsp;</span>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#0ea5e9', marginBottom: '14px', border: '2px solid #fff', boxShadow: '0 0 0 2px #0ea5e9' }}></div>
              <div style={{ width: '2px', height: '12px', background: '#0ea5e9', marginBottom: '6px' }}></div>
              <span style={{ fontSize: '0.68rem', color: '#0ea5e9', fontWeight: '700', display: 'block' }}>{t('days.today', 'Today')}</span>
              <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#0ea5e9', display: 'block', whiteSpace: 'nowrap' }}>{t('dates.may15', 'May 15')}</span>
            </div>

          </div>
        </div>

        {/* Signal Flow Interpretation Box */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F0F9FF', padding: '12px 14px', borderRadius: '10px', border: '1px solid #BAE6FD', boxSizing: 'border-box', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#E0F2FE', color: '#0369A1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
            🌊
          </div>
          <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: '1.4', overflowWrap: 'break-word', minWidth: 0, flex: 1, textAlign: isRTL ? 'right' : 'left' }}>
            <strong>{t('river.recentFlow', 'Your recent signal flow:')}</strong> {t('river.flowDescription', 'fatigue and poor sleep appeared together twice this week. Your flow is calmer today.')}
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '2px', fontStyle: 'italic' }}>
              {t('river.disclaimer', 'This is a personalized interpretation, not a medical diagnosis.')}
            </div>
          </div>
        </div>
      </div>

      {/* STANDOUT SUPPORTIVE AURA AI COMPANION BANNER */}
      <div className="card aura-ai-featured-banner animated-entry animated-glow" style={{ background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)', border: '2px solid #BBF7D0', marginBottom: '20px', padding: '16px', borderRadius: '16px', boxSizing: 'border-box', animationDelay: '0.2s' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
          <div style={{ background: '#22c55e', color: '#fff', fontSize: '22px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', flexShrink: '0', boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)' }} title="Supportive Companion">
            👩‍❤️‍👩
          </div>
          <div style={{ flex: '1 1 250px', minWidth: 0, textAlign: isRTL ? 'right' : 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <span style={{ background: '#fff', color: '#15803D', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px', border: '1px solid #BBF7D0' }}>
                {t('aura.badge', 'Aura AI · Supportive Sisterhood')}
              </span>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <span style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%', display: 'inline-block' }}></span> 
                {t('aura.encrypted', 'Encrypted')}
              </span>
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#166534', marginBottom: '4px' }}>
              {t('aura.safeSpaceTitle', 'Your Safe Space Guidance')}
            </h2>
            <p style={{ fontSize: '14px', color: '#166534', lineHeight: '1.4', fontStyle: 'italic', margin: 0, overflowWrap: 'break-word', wordBreak: 'break-word' }}>
              "{auraInsight}"
            </p>
          </div>
        </div>
      </div>

      {/* TODAY'S FOCUS SECTION */}
      <section className="section-block animated-entry" style={{ marginBottom: '24px', animationDelay: '0.3s' }}>
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
          <h2 className="section-title" style={{ fontSize: '1.15rem', margin: 0, fontWeight: '700', color: '#1E293B' }}>{t('focus.title', "Today's Focus")}</h2>
          <Link to="/tracker" style={{ fontSize: '0.85rem', color: '#0EA5E9', textDecoration: 'none', fontWeight: '600' }}>{t('actions.edit', 'Edit')}</Link>
        </div>

        <div className="two-column-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
          
          <Link to="/tracker" className="card" style={{ padding: '16px 10px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center', textDecoration: 'none', color: '#1E293B', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', boxSizing: 'border-box' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
              🩸
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', wordBreak: 'break-word' }}>{t('focus.logSymptoms', 'Log symptoms')}</span>
          </Link>

          <Link to="/tracker" className="card" style={{ padding: '16px 10px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center', textDecoration: 'none', color: '#1E293B', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', boxSizing: 'border-box' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F8FAFC', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
              😊
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', wordBreak: 'break-word' }}>{t('focus.logMood', 'Log mood')}</span>
          </Link>

          <Link to="/tracker" className="card" style={{ padding: '16px 10px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center', textDecoration: 'none', color: '#1E293B', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', boxSizing: 'border-box' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ccfbf1', color: '#115e59', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
              🌡️
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', wordBreak: 'break-word' }}>{t('focus.logBBT', 'Log BBT')}</span>
          </Link>

          <Link to="/tracker" className="card" style={{ padding: '16px 10px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center', textDecoration: 'none', color: '#1E293B', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', boxSizing: 'border-box' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
              💊
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', wordBreak: 'break-word' }}>{t('focus.logMedication', 'Log medication')}</span>
          </Link>

        </div>
      </section>

      {/* UPCOMING SECTION */}
      <section className="section-block animated-entry" style={{ marginBottom: '24px', animationDelay: '0.4s' }}>
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
          <h2 className="section-title" style={{ fontSize: '1.15rem', margin: 0, fontWeight: '700', color: '#1E293B' }}>{t('upcoming.title', 'Upcoming')}</h2>
          <Link to="/tracker" style={{ fontSize: '0.85rem', color: '#0EA5E9', textDecoration: 'none', fontWeight: '600' }}>{t('actions.viewAll', 'View all')}</Link>
        </div>

        <div className="card" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flexDirection: isRTL ? 'row-reverse' : 'row', textAlign: isRTL ? 'right' : 'left' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#F3E8FF', color: '#7E22CE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>📅</div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1E293B', wordBreak: 'break-word' }}>{t('upcoming.nextPeriod', 'Next Period Expected')}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', wordBreak: 'break-word' }}>{t('upcoming.inDays', 'In')} {daysUntilNext} {t('upcoming.daysText', 'days')} ({currentPhase === 'Menstrual Phase' ? t('upcoming.activeNow', 'Active now') : t('upcoming.onTrack', 'On track')})</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flexDirection: isRTL ? 'row-reverse' : 'row', textAlign: isRTL ? 'right' : 'left' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#E0F2FE', color: '#0369A1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>🩺</div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1E293B', wordBreak: 'break-word' }}>{t('upcoming.checkup', 'Wellness Checkup')}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', wordBreak: 'break-word' }}>{t('upcoming.scheduled', 'Scheduled via Screening Hub')}</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}