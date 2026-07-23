import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState(null);
  const [hydrationCount, setHydrationCount] = useState(3);
  const [discreetMode, setDiscreetMode] = useState(false);
  const [carePoints, setCarePoints] = useState(120);

  // Extract first name dynamically from authenticated user object
  const firstName = user?.name 
    ? user.name.trim().split(' ')[0] 
    : user?.email 
      ? user.email.split('@')[0] 
      : 'there';

  // Cycle tracking state
  const currentDay = 14;
  const cycleLength = 28;
  const currentPhase = "Ovulation Phase";

  const moods = [
    { label: 'Energized', icon: '✨' },
    { label: 'Calm', icon: '🌸' },
    { label: 'Sensitive', icon: '🌧️' },
    { label: 'Tired', icon: '😴' },
    { label: 'Crampy', icon: '🍫' },
  ];

  const handleMoodSelect = (label) => {
    if (selectedMood !== label) {
      setSelectedMood(label);
      setCarePoints((prev) => prev + 10); // Reward engagement
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
      
      {/* INVESTOR-READY DISCREET & ENGAGEMENT HEADER */}
      <div className="top-utility-bar">
        <div className="utility-item care-points-badge">
          <span className="star-icon">✨</span>
          <strong>{carePoints} Care Points</strong>
          <span className="tier-label">· Silver Tier</span>
        </div>

        {/* PRIVACY TOGGLE FOR REGIONAL SENSITIVITIES */}
        <button 
          className={`discreet-toggle-btn ${discreetMode ? 'on' : ''}`}
          onClick={() => setDiscreetMode(!discreetMode)}
          title="Shield sensitive cycle details on screen"
        >
          {discreetMode ? '🔒 Discreet Mode Active' : '👁️ Privacy Shield'}
        </button>
      </div>

      {/* HERO / GREETING BANNER */}
      <header className="dashboard-hero">
        <div className="hero-text">
          <span className="welcome-badge">🌸 Direct-to-Care Wellness Hub</span>
          <h1 className="greeting-title">Hello, {firstName}</h1>
          <p className="greeting-subtitle">
            {discreetMode 
              ? 'Your private schedule and wellness routine for today.' 
              : 'Your private, culturally attuned health space for today.'}
          </p>
        </div>
        <div className="hero-avatar">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
            alt="User profile avatar"
            className="avatar-img"
          />
          <span className="online-indicator" title="Encrypted Connection"></span>
        </div>
      </header>

      {/* QUICK STATS / CYCLE DIAL GRID */}
      <div className="dashboard-grid">
        {/* CYCLE & PHASE TRACKER CARD */}
        <div className="card cycle-hero-card">
          <div className="card-header">
            <span className="card-tag phase-tag">
              <span className="blood-dot"></span> 
              {discreetMode ? 'Phase 02 (Active)' : currentPhase}
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
                    strokeDashoffset: 264 - (264 * currentDay) / cycleLength,
                  }}
                />
              </svg>
              <div className="ring-content">
                <span className="ring-label">DAY</span>
                <span className="ring-number">{currentDay}</span>
                <span className="ring-pill">
                  {discreetMode ? 'Optimal Care 🌿' : 'Peak Fertility 🌷'}
                </span>
              </div>
            </div>
          </div>

          <div className="cycle-details-row">
            <div className="detail-item">
              <span className="detail-icon">📅</span>
              <div>
                <strong>Next Cycle Window</strong>
                <p>In ~14 days</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">💧</span>
              <div>
                <strong>Hormonal Phase</strong>
                <p>{discreetMode ? 'High Activity' : 'Estrogen Surge'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* DAILY MOOD & CARE CHECK-IN */}
        <div className="card care-checkin-card">
          <div className="card-header">
            <h2 className="card-title">How are you feeling right now?</h2>
            <span className="points-hint">+10 Points</span>
          </div>
          <p className="card-subtext">Tap to record daily physical and mood state.</p>

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
            <button className="hydration-btn" onClick={addHydration}>
              + 💧 Add
            </button>
          </div>
        </div>
      </div>

      {/* MONETIZATION FEATURE: INSTANT TELEHEALTH SLOTS */}
      <section className="section-block">
        <div className="section-header">
          <h2 className="section-title">Direct Specialist Access (Concierge)</h2>
          <span className="guarantee-badge">🔒 100% Confidential Tele-Consults</span>
        </div>

        <div className="two-column-cards">
          {/* HIGH-CONVERSION TELEHEALTH CONSULT CARD */}
          <div className="card promo-consult-card">
            <div className="promo-badge">On-Demand Gynecologists</div>
            <h3 className="promo-title">Book a Private Tele-Consult</h3>
            <p className="promo-desc">
              Connect with verified regional specialists without long hospital waiting times or public records.
            </p>
            
            {/* LIVE AVAILABLE SLOTS CAROUSEL */}
            <div className="live-slots-container">
              <span className="live-dot"></span>
              <span className="live-text">Next Available Today:</span>
              <div className="slot-chips">
                <Link to="/specialists" className="slot-chip">4:30 PM ($45)</Link>
                <Link to="/specialists" className="slot-chip highlighted">6:00 PM ($45)</Link>
              </div>
            </div>

            <div className="doctor-avatars-row">
              {/* Replace Dr. Sara's image src in Dashboard.jsx */}
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

          {/* SCREENING & PREVENTATIVE AWARENESS CARD */}
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

      {/* CULTURALLY ATTUNED DAILY INSIGHT */}
      <div className="card insight-banner-card">
        <div className="insight-content">
          <span className="insight-emoji">🌿</span>
          <div>
            <strong>Daily Wellness Note</strong>
            <p>
              "Prioritizing rest during high-stress weeks protects your hormonal rhythm. Take 5 deep breaths today."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}