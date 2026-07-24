import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { api } from '../api/client.js';

export default function Dashboard() {
  const { user } = useAuth();
  
  // Dynamic Health Data States
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  // Engagement & Privacy States
  const [selectedMood, setSelectedMood] = useState(null);
  const [hydrationCount, setHydrationCount] = useState(3);
  const [discreetMode, setDiscreetMode] = useState(false);
  const [carePoints, setCarePoints] = useState(120);
  const [auraInsight, setAuraInsight] = useState("Analyzing your personal wellness rhythm securely...");

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

  const moods = [
    { label: 'Energized', icon: '✨' },
    { label: 'Calm', icon: '🌸' },
    { label: 'Sensitive', icon: '🌧️' },
    { label: 'Tired', icon: '😴' },
    { label: 'Crampy', icon: '🍫' },
  ];

  const handleMoodSelect = async (label) => {
    const newMood = selectedMood === label ? null : label;
    setSelectedMood(newMood);

    if (newMood) {
      setCarePoints((prev) => prev + 10);
      try {
        await api.addLog({
          date: new Date().toISOString().slice(0, 10),
          type: 'symptom',
          symptoms: [newMood],
          notes: 'Logged via HerSignal Dashboard Companion'
        });
      } catch (err) {
        console.error('Failed to sync check-in securely:', err);
      }
    }
  };

  const addHydration = () => {
    if (hydrationCount < 8) {
      setHydrationCount((c) => c + 1);
      setCarePoints((prev) => prev + 5);
    }
  };

  // Determine dynamic river gradient/accent colors based on current phase
  const getRiverTheme = () => {
    switch (currentPhase) {
      case 'Menstrual Phase':
        return {
          gradient: 'linear-gradient(90deg, rgba(236, 72, 153, 0.15) 0%, rgba(225, 29, 72, 0.3) 100%)',
          waveStroke: '#e11d48',
          badgeBg: '#ffe4e6',
          badgeColor: '#9f1239',
        };
      case 'Follicular Phase':
        return {
          gradient: 'linear-gradient(90deg, rgba(52, 211, 153, 0.15) 0%, rgba(14, 165, 233, 0.25) 100%)',
          waveStroke: '#0ea5e9',
          badgeBg: '#e0f2fe',
          badgeColor: '#0369a1',
        };
      case 'Ovulation Phase':
        return {
          gradient: 'linear-gradient(90deg, rgba(168, 85, 247, 0.15) 0%, rgba(236, 72, 153, 0.25) 100%)',
          waveStroke: '#a855f7',
          badgeBg: '#f3e8ff',
          badgeColor: '#7e22ce',
        };
      default: // Luteal Phase
        return {
          gradient: 'linear-gradient(90deg, rgba(245, 158, 11, 0.15) 0%, rgba(236, 72, 153, 0.25) 100%)',
          waveStroke: '#f59e0b',
          badgeBg: '#fef3c7',
          badgeColor: '#b45309',
        };
    }
  };

  const riverTheme = getRiverTheme();

  return (
    <div className={`dashboard-container dashboard-rich ${discreetMode ? 'discreet-active' : ''}`} style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '16px 12px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif', color: '#1E293B' }}>
      
      {/* TOP UTILITY BAR: CARE POINTS & PRIVACY SHIELD */}
      <div className="top-utility-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div className="utility-item care-points-badge" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
          <span className="star-icon">✨</span>
          <strong>{carePoints} Care Points</strong>
          <span className="tier-label" style={{ color: '#64748B' }}>· Silver Tier</span>
        </div>

        <button 
          className={`discreet-toggle-btn ${discreetMode ? 'on' : ''}`}
          onClick={() => setDiscreetMode(!discreetMode)}
          title="Shield sensitive cycle details on screen with Zero-Knowledge masking"
          style={{ padding: '6px 12px', fontSize: '0.85rem', cursor: 'pointer', borderRadius: '8px', border: '1px solid #CBD5E1', background: discreetMode ? '#fce7f3' : '#fff', color: discreetMode ? '#be185d' : '#334155', fontWeight: '500' }}
        >
          {discreetMode ? '🔒 Zero-Knowledge Shield Active' : '👁️ Privacy Shield'}
        </button>
      </div>

      {/* HERO / GREETING BANNER */}
      <header className="dashboard-hero" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px', background: '#F8FAFC', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
        <div className="hero-text" style={{ flex: '1 1 250px' }}>
          <h1 className="greeting-title" style={{ fontSize: 'clamp(1.5rem, 4vw, 1.8rem)', margin: '0 0 6px 0', fontWeight: '700', color: '#0F172A' }}>
            Good morning, {firstName}
          </h1>
          <p className="greeting-subtitle" style={{ fontSize: '0.95rem', color: '#64748B', margin: 0 }}>
            Your body is in the <span style={{ color: '#be185d', fontWeight: '600' }}>{discreetMode ? 'protected phase' : currentPhase.toLowerCase()}</span>.
          </p>
        </div>
        <div className="hero-avatar" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {/* Sunrise illustration or notification icon matching reference */}
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #fde047 0%, #f43f5e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(244, 63, 94, 0.2)' }}>
            <span style={{ fontSize: '24px' }}>🌅</span>
          </div>
        </div>
      </header>

      {/* SIGNAL RIVER FEATURED COMPONENT */}
      <div className="card signal-river-card" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)', marginBottom: '20px', padding: '20px', borderRadius: '16px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0, color: '#0F172A' }}>Signal River</h2>
            <span title="Your body's signals over the last 7 days" style={{ cursor: 'pointer', fontSize: '0.85rem', color: '#94A3B8' }}>ⓘ</span>
          </div>
          <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#7e22ce', background: '#f3e8ff', padding: '3px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#E0F2FE', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', marginBottom: '8px', border: '2px solid #fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                ⚡
              </div>
              <div style={{ width: '2px', height: '12px', background: '#CBD5E1', marginBottom: '6px' }}></div>
              <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>Thu</span>
              <span style={{ fontSize: '0.72rem', fontWeight: '600', color: '#334155', display: 'block' }}>May 9</span>
            </div>

            {/* Day -4 */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#6366f1', fontWeight: '600', marginBottom: '4px' }}>Poor sleep</span>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#EEF2FF', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', marginBottom: '8px', border: '2px solid #fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                🌙
              </div>
              <div style={{ width: '2px', height: '12px', background: '#CBD5E1', marginBottom: '6px' }}></div>
              <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>Fri</span>
              <span style={{ fontSize: '0.72rem', fontWeight: '600', color: '#334155', display: 'block' }}>May 10</span>
            </div>

            {/* Day -3 (Headache below) */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'transparent', marginBottom: '4px' }}>&nbsp;</span>
              <div style={{ height: '28px', display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                {/* Spacer */}
              </div>
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
              <span style={{ fontSize: '0.72rem', color: '#ec4899', fontWeight: '600', marginBottom: '4px' }}>Mild cramps</span>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#fce7f3', color: '#be185d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', marginBottom: '8px', border: '2px solid #fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                〰️
              </div>
              <div style={{ width: '2px', height: '12px', background: '#CBD5E1', marginBottom: '6px' }}></div>
              <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>Mon</span>
              <span style={{ fontSize: '0.72rem', fontWeight: '600', color: '#334155', display: 'block' }}>May 13</span>
            </div>

            {/* Day 0 */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#9333ea', fontWeight: '600', marginBottom: '4px' }}>Ovulation window starts</span>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', marginBottom: '8px', border: '2px solid #fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                ◎
              </div>
              <div style={{ width: '2px', height: '12px', background: '#CBD5E1', marginBottom: '6px' }}></div>
              <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>Tue</span>
              <span style={{ fontSize: '0.72rem', fontWeight: '600', color: '#334155', display: 'block' }}>May 14</span>
            </div>

            {/* Today */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'transparent', marginBottom: '4px' }}>&nbsp;</span>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#9333ea', marginBottom: '16px', border: '2px solid #fff', boxShadow: '0 0 0 2px #9333ea' }}></div>
              <div style={{ width: '2px', height: '12px', background: '#9333ea', marginBottom: '6px' }}></div>
              <span style={{ fontSize: '0.72rem', color: '#9333ea', fontWeight: '700', display: 'block' }}>Today</span>
              <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#9333ea', display: 'block' }}>May 15</span>
            </div>

          </div>
        </div>

        {/* Signal Flow Interpretation Box */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
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
      <div className="card aura-ai-featured-banner" style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)', border: '2px solid #fbcfe8', boxShadow: '0 8px 24px rgba(244, 114, 182, 0.15)', marginBottom: '20px', padding: '16px', borderRadius: '16px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ background: '#ec4899', color: '#fff', fontSize: '22px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', flexShrink: 0, boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)' }} title="Supportive Companion">
            👩‍❤️‍👩
          </div>
          <div style={{ flex: '1 1 250px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span style={{ background: '#fff', color: '#be185d', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px', border: '1px solid #fbcfe8' }}>
                Aura AI · Supportive Sisterhood
              </span>
              <span style={{ fontSize: '11px', color: '#555', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', background: '#2ecc71', borderRadius: '50%', display: 'inline-block' }}></span> 
                Encrypted
              </span>
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#2c3e50', marginBottom: '4px' }}>
              Your Safe Space Guidance
            </h2>
            <p style={{ fontSize: '14px', color: '#4a5568', lineHeight: '1.4', fontStyle: 'italic', margin: 0, overflowWrap: 'break-word' }}>
              "{auraInsight}"
            </p>
          </div>
        </div>
      </div>

      {/* TODAY'S FOCUS SECTION */}
      <section className="section-block" style={{ marginBottom: '24px' }}>
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 className="section-title" style={{ fontSize: '1.15rem', margin: 0, fontWeight: '700', color: '#0F172A' }}>Today's Focus</h2>
          <Link to="/tracker" style={{ fontSize: '0.85rem', color: '#9333ea', textDecoration: 'none', fontWeight: '600' }}>Edit</Link>
        </div>

        <div className="two-column-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
          
          <Link to="/tracker" className="card" style={{ padding: '16px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center', textDecoration: 'none', color: '#1E293B', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fce7f3', color: '#be185d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
              🩸
            </div>
            <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>Log symptoms</span>
          </Link>

          <Link to="/tracker" className="card" style={{ padding: '16px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center', textDecoration: 'none', color: '#1E293B', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
              😊
            </div>
            <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>Log mood</span>
          </Link>

          <Link to="/tracker" className="card" style={{ padding: '16px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center', textDecoration: 'none', color: '#1E293B', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
              🌡️
            </div>
            <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>Log BBT</span>
          </Link>

          <Link to="/tracker" className="card" style={{ padding: '16px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center', textDecoration: 'none', color: '#1E293B', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
              💊
            </div>
            <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>Log medication</span>
          </Link>

        </div>
      </section>

      {/* UPCOMING SECTION */}
      <section className="section-block" style={{ marginBottom: '24px' }}>
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 className="section-title" style={{ fontSize: '1.15rem', margin: 0, fontWeight: '700', color: '#0F172A' }}>Upcoming</h2>
          <Link to="/tracker" style={{ fontSize: '0.85rem', color: '#9333ea', textDecoration: 'none', fontWeight: '600' }}>View all</Link>
        </div>

        <div className="card" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
              🟣
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.9rem', color: '#1E293B' }}>Ovulation window</strong>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>May 17 – May 21</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
              🛡️
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.9rem', color: '#1E293B' }}>Cervical screening</strong>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Due in 10 days</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
              📅
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.9rem', color: '#1E293B' }}>Next check-in</strong>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Tomorrow</span>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER MOTIVATIONAL BANNER */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #ede9fe 100%)', borderRadius: '16px', padding: '20px', border: '1px solid #f5d0fe', position: 'relative', overflow: 'hidden' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#581c87', margin: '0 0 4px 0' }}>Small steps, big care.</h3>
        <p style={{ fontSize: '0.9rem', color: '#7e22ce', margin: 0 }}>
          You're showing up for your health, and that matters. 💜
        </p>
      </div>

    </div>
  );
}