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
          notes: 'Logged via Aura Dashboard Companion'
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

  return (
    <div className={`dashboard-container dashboard-rich ${discreetMode ? 'discreet-active' : ''}`} style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '16px 12px', boxSizing: 'border-box' }}>
      
      {/* UTILITY BAR: CARE POINTS & PRIVACY SHIELD */}
      <div className="top-utility-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div className="utility-item care-points-badge" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
          <span className="star-icon">✨</span>
          <strong>{carePoints} Care Points</strong>
          <span className="tier-label">· Silver Tier</span>
        </div>

        <button 
          className={`discreet-toggle-btn ${discreetMode ? 'on' : ''}`}
          onClick={() => setDiscreetMode(!discreetMode)}
          title="Shield sensitive cycle details on screen with Zero-Knowledge masking"
          style={{ padding: '6px 12px', fontSize: '0.85rem', cursor: 'pointer' }}
        >
          {discreetMode ? '🔒 Zero-Knowledge Shield Active' : '👁️ Privacy Shield'}
        </button>
      </div>

      {/* HERO / GREETING BANNER */}
      <header className="dashboard-hero" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px', background: '#F8FAFC', padding: '16px', borderRadius: '12px' }}>
        <div className="hero-text" style={{ flex: '1 1 250px' }}>
          <span className="welcome-badge" style={{ fontSize: '0.75rem', fontWeight: '700', color: '#be185d', background: '#fce7f3', padding: '2px 8px', borderRadius: '4px' }}>🌿 Direct-to-Care Wellness Hub</span>
          <h1 className="greeting-title" style={{ fontSize: 'clamp(1.5rem, 4vw, 1.8rem)', margin: '6px 0' }}>Hello, {firstName}</h1>
          <p className="greeting-subtitle" style={{ fontSize: '0.9rem', color: '#64748B', margin: 0 }}>
            {discreetMode 
              ? 'Your private schedule and encrypted wellness routine.' 
              : 'Your secure, culturally attuned health space for today.'}
          </p>
        </div>
        <div className="hero-avatar" style={{ position: 'relative' }}>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
            alt="User profile avatar"
            className="avatar-img"
            style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <span className="online-indicator" title="End-to-End Encrypted Connection" style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', background: '#2ecc71', borderRadius: '50%', border: '2px solid #fff' }}></span>
        </div>
      </header>

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

      {/* DASHBOARD GRID */}
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        
        {/* CYCLE & PHASE TRACKER CARD */}
        <div className="card cycle-hero-card" style={{ padding: '16px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="card-tag phase-tag" style={{ fontSize: '0.8rem', fontWeight: '600' }}>
              {discreetMode ? 'Phase Active (Masked)' : currentPhase}
            </span>
            <Link to="/tracker" className="card-link" style={{ fontSize: '0.85rem' }}>
              Log Today &rarr;
            </Link>
          </div>

          <div className="cycle-visual-wrapper" style={{ textAlign: 'center', margin: '16px 0' }}>
            <div className="cycle-ring-container" style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto' }}>
              <svg className="cycle-ring" viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle className="ring-bg" cx="50" cy="50" r="42" stroke="#E2E8F0" strokeWidth="8" fill="none" />
                <circle
                  className="ring-progress blood-flow-progress"
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#ec4899"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: 264,
                    strokeDashoffset: 264 - (264 * Math.min(currentDay, cycleLength)) / cycleLength,
                  }}
                />
              </svg>
              <div className="ring-content" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%', textAlign: 'center' }}>
                <span className="ring-label" style={{ fontSize: '0.65rem', display: 'block', color: '#64748B' }}>DAY</span>
                <span className="ring-number" style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1E293B' }}>{loadingLogs ? '...' : (discreetMode ? '••' : currentDay)}</span>
              </div>
            </div>
          </div>

          <div className="cycle-details-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '16px', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
            <div className="detail-item" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span className="detail-icon" style={{ fontSize: '1.1rem' }}>📅</span>
              <div style={{ fontSize: '0.8rem' }}>
                <strong>Next Window</strong>
                <p style={{ margin: 0, color: '#64748B' }}>{discreetMode ? 'Protected' : `~${daysUntilNext} days`}</p>
              </div>
            </div>
            <div className="detail-item" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span className="detail-icon" style={{ fontSize: '1.1rem' }}>🔒</span>
              <div style={{ fontSize: '0.8rem' }}>
                <strong>Security</strong>
                <p style={{ margin: 0, color: '#64748B' }}>Zero-Knowledge</p>
              </div>
            </div>
          </div>
        </div>

        {/* DAILY MOOD & CARE CHECK-IN */}
        <div className="card care-checkin-card" style={{ padding: '16px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h2 className="card-title" style={{ fontSize: '1.05rem', margin: 0 }}>How is your body feeling?</h2>
            <span className="points-hint" style={{ fontSize: '0.75rem', background: '#fef3c7', color: '#92400E', padding: '2px 6px', borderRadius: '4px' }}>+10 Pts</span>
          </div>
          <p className="card-subtext" style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '12px' }}>Aura adapts real-time guidance to your emotional tone.</p>

          <div className="mood-chips-container" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {moods.map((m) => (
              <button
                key={m.label}
                type="button"
                className={`mood-chip ${selectedMood === m.label ? 'selected' : ''}`}
                onClick={() => handleMoodSelect(m.label)}
                style={{ flex: '1 1 30%', padding: '6px 8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer', borderRadius: '6px', border: '1px solid #CBD5E1', background: selectedMood === m.label ? '#fce7f3' : '#fff' }}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          <div className="care-counter-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', padding: '10px', borderRadius: '8px' }}>
            <div className="care-counter-info" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className="care-icon" style={{ fontSize: '1.2rem' }}>🍵</span>
              <div style={{ fontSize: '0.8rem' }}>
                <strong>Self-Care Hydration</strong>
                <p style={{ margin: 0, color: '#64748B' }}>{hydrationCount}/8 glasses logged</p>
              </div>
            </div>
            <button type="button" className="hydration-btn" onClick={addHydration} style={{ padding: '6px 10px', fontSize: '0.8rem', cursor: 'pointer' }}>
              + 💧 Add
            </button>
          </div>
        </div>
      </div>

      {/* TELEHEALTH ACCESS SECTION */}
      <section className="section-block" style={{ marginTop: '20px' }}>
        <div className="section-header" style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <h2 className="section-title" style={{ fontSize: '1.15rem', margin: 0 }}>Direct Specialist Access (Concierge)</h2>
          <span className="guarantee-badge" style={{ fontSize: '0.75rem', color: '#166534', background: '#DCFCE7', padding: '2px 8px', borderRadius: '4px' }}>🔒 Confidential Tele-Consults</span>
        </div>

        <div className="two-column-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div className="card promo-consult-card" style={{ padding: '16px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div className="promo-badge" style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0369A1', background: '#E0F2FE', display: 'inline-block', padding: '2px 8px', borderRadius: '4px', marginBottom: '8px' }}>On-Demand Gynecologists</div>
            <h3 className="promo-title" style={{ fontSize: '1.05rem', margin: '0 0 6px 0' }}>Book a Private Tele-Consult</h3>
            <p className="promo-desc" style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '12px' }}>
              Connect with verified regional specialists without long hospital waiting times or public records.
            </p>
            
            <div className="live-slots-container" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <span className="live-dot" style={{ width: '8px', height: '8px', background: '#2ecc71', borderRadius: '50%' }}></span>
              <span className="live-text" style={{ fontSize: '0.8rem', color: '#475569' }}>Next Available:</span>
              <div className="slot-chips" style={{ display: 'flex', gap: '6px' }}>
                <Link to="/specialists" className="slot-chip" style={{ fontSize: '0.75rem', padding: '2px 6px', background: '#F1F5F9', borderRadius: '4px', textDecoration: 'none', color: '#334155' }}>4:30 PM ($45)</Link>
                <Link to="/specialists" className="slot-chip highlighted" style={{ fontSize: '0.75rem', padding: '2px 6px', background: '#fce7f3', color: '#be185d', borderRadius: '4px', textDecoration: 'none' }}>6:00 PM ($45)</Link>
              </div>
            </div>
            
            <Link to="/specialists" className="auth-btn consult-btn" style={{ display: 'block', textAlign: 'center', padding: '10px', background: '#ec4899', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>
              Schedule Instant Consultation 💬
            </Link>
          </div>

          <div className="card screening-reminder-card" style={{ padding: '16px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 className="card-title" style={{ fontSize: '1.05rem', margin: 0 }}>Preventative Milestones</h3>
              <span className="status-pill-ok" style={{ fontSize: '0.75rem', color: '#475569', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>Awareness Mode</span>
            </div>
            <p className="card-subtext" style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '12px' }}>
              Routine self-check & screening reminders curated for long-term health:
            </p>

            <ul className="screening-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '10px' }}>
              <li className="screening-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', background: '#F8FAFC', padding: '8px', borderRadius: '8px' }}>
                <div className="screening-icon" style={{ fontSize: '1.2rem' }}>🎀</div>
                <div className="screening-text" style={{ flex: 1 }}>
                  <strong style={{ display: 'block', color: '#1E293B' }}>Self Breast Exam Guidance</strong>
                  <span style={{ color: '#64748B', fontSize: '0.78rem' }}>Recommended monthly post-cycle</span>
                </div>
                <span className="screening-check" style={{ color: '#166534', fontWeight: '600', fontSize: '0.78rem' }}>✓ Done</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}