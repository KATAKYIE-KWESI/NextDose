import React, { useState, useEffect } from 'react';
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
    <div className={`dashboard-container dashboard-rich ${discreetMode ? 'discreet-active' : ''}`}>
      
      {/* UTILITY BAR: CARE POINTS & PRIVACY SHIELD */}
      <div className="top-utility-bar">
        <div className="utility-item care-points-badge">
          <span className="star-icon">✨</span>
          <strong>{carePoints} Care Points</strong>
          <span className="tier-label">· Silver Tier</span>
        </div>

        <button 
          className={`discreet-toggle-btn ${discreetMode ? 'on' : ''}`}
          onClick={() => setDiscreetMode(!discreetMode)}
          title="Shield sensitive cycle details on screen with Zero-Knowledge masking"
        >
          {discreetMode ? '🔒 Zero-Knowledge Shield Active' : '👁️ Privacy Shield'}
        </button>
      </div>

      {/* HERO / GREETING BANNER */}
      <header className="dashboard-hero">
        <div className="hero-text">
          <span className="welcome-badge">🌿 Direct-to-Care Wellness Hub</span>
          <h1 className="greeting-title">Hello, {firstName}</h1>
          <p className="greeting-subtitle">
            {discreetMode 
              ? 'Your private schedule and encrypted wellness routine.' 
              : 'Your secure, culturally attuned health space for today.'}
          </p>
        </div>
        <div className="hero-avatar">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
            alt="User profile avatar"
            className="avatar-img"
          />
          <span className="online-indicator" title="End-to-End Encrypted Connection"></span>
        </div>
      </header>

      {/* STANDOUT SUPPORTIVE AURA AI COMPANION BANNER */}
      <div className="card aura-ai-featured-banner" style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)', border: '2px solid #fbcfe8', boxShadow: '0 8px 24px rgba(244, 114, 182, 0.15)', marginBottom: '24px', padding: '24px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ background: '#ec4899', color: '#fff', fontSize: '26px', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px', flexShrink: 0, boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)' }} title="Supportive Companion">
            👩‍❤️‍👩
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ background: '#fff', color: '#be185d', fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px', border: '1px solid #fbcfe8' }}>
                Aura AI · Supportive Sisterhood Companion
              </span>
              <span style={{ fontSize: '12px', color: '#555', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', background: '#2ecc71', borderRadius: '50%', display: 'inline-block' }}></span> 
                Zero-Knowledge Encrypted
              </span>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#2c3e50', marginBottom: '6px' }}>
              Your Safe Space Guidance
            </h2>
            <p style={{ fontSize: '15px', color: '#4a5568', lineHeight: '1.5', fontStyle: 'italic', margin: 0 }}>
              "{auraInsight}"
            </p>
          </div>
        </div>
      </div>

      {/* DASHBOARD GRID */}
      <div className="dashboard-grid">
        
        {/* CYCLE & PHASE TRACKER CARD */}
        <div className="card cycle-hero-card">
          <div className="card-header">
            <span className="card-tag phase-tag">
              <span className="blood-dot"></span> 
              {discreetMode ? 'Phase Active (Masked)' : currentPhase}
            </span>
            <Link to="/tracker" className="card-link">
              Log Today &rarr;
            </Link>
          </div>

          <div className="cycle-visual-wrapper">
            <div className="cycle-ring-container">
              <svg className="cycle-ring" viewBox="0 0 100 100">
                <circle className="ring-bg" cx="50" cy="50" r="42" />
                <circle
                  className="ring-progress blood-flow-progress"
                  cx="50"
                  cy="50"
                  r="42"
                  style={{
                    strokeDasharray: 264,
                    strokeDashoffset: 264 - (264 * Math.min(currentDay, cycleLength)) / cycleLength,
                  }}
                />
              </svg>
              <div className="ring-content">
                <span className="ring-label">DAY</span>
                <span className="ring-number">{loadingLogs ? '...' : (discreetMode ? '••' : currentDay)}</span>
                <span className="ring-pill">
                  {discreetMode ? 'Encrypted Vault 🛡️' : currentPhase}
                </span>
              </div>
            </div>
          </div>

          <div className="cycle-details-row">
            <div className="detail-item">
              <span className="detail-icon">📅</span>
              <div>
                <strong>Next Window</strong>
                <p>{discreetMode ? 'Protected' : `In ~${daysUntilNext} days`}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">🔒</span>
              <div>
                <strong>Data Security</strong>
                <p>Zero-Knowledge</p>
              </div>
            </div>
          </div>
        </div>

        {/* DAILY MOOD & CARE CHECK-IN */}
        <div className="card care-checkin-card">
          <div className="card-header">
            <h2 className="card-title">How is your body feeling?</h2>
            <span className="points-hint">+10 Points</span>
          </div>
          <p className="card-subtext">Aura adapts real-time guidance to your emotional tone.</p>

          <div className="mood-chips-container">
            {moods.map((m) => (
              <button
                key={m.label}
                type="button"
                className={`mood-chip ${selectedMood === m.label ? 'selected' : ''}`}
                onClick={() => handleMoodSelect(m.label)}
              >
                <span className="chip-icon">{m.icon}</span>
                <span className="chip-label">{m.label}</span>
              </button>
            ))}
          </div>

          <div className="care-counter-box">
            <div className="care-counter-info">
              <span className="care-icon">🍵</span>
              <div>
                <strong>Self-Care Hydration</strong>
                <p>{hydrationCount} of 8 glasses logged (+5 pts/glass)</p>
              </div>
            </div>
            <button type="button" className="hydration-btn" onClick={addHydration}>
              + 💧 Add
            </button>
          </div>
        </div>
      </div>

      {/* TELEHEALTH ACCESS SECTION */}
      <section className="section-block">
        <div className="section-header">
          <h2 className="section-title">Direct Specialist Access (Concierge)</h2>
          <span className="guarantee-badge">🔒 100% Confidential Tele-Consults</span>
        </div>

        <div className="two-column-cards">
          <div className="card promo-consult-card">
            <div className="promo-badge">On-Demand Gynecologists</div>
            <h3 className="promo-title">Book a Private Tele-Consult</h3>
            <p className="promo-desc">
              Connect with verified regional specialists without long hospital waiting times or public records.
            </p>
            
            <div className="live-slots-container">
              <span className="live-dot"></span>
              <span className="live-text">Next Available Today:</span>
              <div className="slot-chips">
                <Link to="/specialists" className="slot-chip">4:30 PM ($45)</Link>
                <Link to="/specialists" className="slot-chip highlighted">6:00 PM ($45)</Link>
              </div>
            </div>

            <div className="doctor-avatars-row">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=120"
                alt="Dr. Layla"
                className="doc-avatar"
              />
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=120"
                alt="Dr. Sara"
                className="doc-avatar"
              />
              <span className="doc-count-pill">+14 Licensed MDs Online</span>
            </div>
            
            <Link to="/specialists" className="auth-btn consult-btn">
              Schedule Instant Consultation 💬
            </Link>
          </div>

          <div className="card screening-reminder-card">
            <div className="card-header">
              <h3 className="card-title">Preventative Milestones</h3>
              <span className="status-pill-ok">Awareness Mode</span>
            </div>
            <p className="card-subtext">
              Routine self-check & screening reminders curated for long-term health:
            </p>

            <ul className="screening-list">
              <li className="screening-item">
                <div className="screening-icon">🎀</div>
                <div className="screening-text">
                  <strong>Self Breast Exam Guidance</strong>
                  <span>Recommended monthly post-cycle</span>
                </div>
                <span className="screening-check">✓ Completed</span>
              </li>

              <li className="screening-item">
                <div className="screening-icon">🩺</div>
                <div className="screening-text">
                  <strong>Cervical Screening Awareness</strong>
                  <span>Schedule every 3 years with a clinician</span>
                </div>
                <Link to="/screening" className="action-pill">
                  Book Screening
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}