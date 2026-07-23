import { useState, useEffect } from 'react';
import { api } from '../api/client.js';

// Helper to automatically turn 'pap_smear' or 'breast_exam' into 'Pap Smear' dynamically
const formatTypeLabel = (type = '') => {
  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function HerSignalApp() {
  const [activeNav, setActiveNav] = useState('brand'); // 'brand' | 'journey' | 'screening'

  // Maternal Journey States
  const [journeyTab, setJourneyTab] = useState('dashboard');
  const [routineNote, setRoutineNote] = useState('');
  const [quickCheckin, setQuickCheckin] = useState('');

  // Screening Reminders States
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState({});
  const [saving, setSaving] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loadReminders = async () => {
    try {
      const res = await api.getReminders();
      setReminders(res?.reminders || []);
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to fetch screening reminders from backend.');
    }
  };

  useEffect(() => {
    loadReminders().finally(() => setLoading(false));
  }, []);

  const logDate = async (type) => {
    const selectedDate = dates[type];
    if (!selectedDate) {
      setErrorMsg(`Please select a valid date for ${formatTypeLabel(type)}.`);
      return;
    }

    setErrorMsg('');
    setSaving(type);

    try {
      await api.updateScreening({ type, date: selectedDate });
      await loadReminders(); 
      setDates((prev) => ({ ...prev, [type]: '' }));
      setSuccessMsg(`Successfully updated record for ${formatTypeLabel(type)}!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to update screening date.');
    } finally {
      setSaving('');
    }
  };

  return (
    <div 
      className="hersignal-container"
      style={{
        width: '100%',
        maxWidth: '850px',
        margin: '0 auto',
        padding: '30px 16px',
        boxSizing: 'border-box'
      }}
    >
      {/* GLOBAL APP NAVIGATION SWITCHER */}
      <div 
        style={{ 
          display: 'flex', 
          gap: '8px', 
          marginBottom: '28px', 
          justifyContent: 'center',
          flexWrap: 'wrap',
          borderBottom: '2px solid #F1F5F9',
          paddingBottom: '16px'
        }}
      >
        {[
          { id: 'brand', label: '🌸 Brand Overview' },
          { id: 'journey', label: '🤱 Maternal Journey' },
          { id: 'screening', label: '🩺 Screening Reminders' }
        ].map((nav) => (
          <button
            key={nav.id}
            onClick={() => setActiveNav(nav.id)}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: activeNav === nav.id ? '1px solid #be185d' : '1px solid #CBD5E1',
              background: activeNav === nav.id ? '#be185d' : '#FFFFFF',
              color: activeNav === nav.id ? '#FFFFFF' : '#475569',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: activeNav === nav.id ? '0 2px 4px rgba(190, 24, 93, 0.2)' : 'none'
            }}
          >
            {nav.label}
          </button>
        ))}
      </div>

      {/* VIEW 1: BRAND OVERVIEW */}
      {activeNav === 'brand' && (
        <div>
          {/* BRAND HEADER & SLOGAN */}
          <div className="hersignal-header" style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span 
              style={{ 
                display: 'inline-block', 
                fontSize: '0.85rem', 
                fontWeight: '700', 
                color: '#be185d', 
                background: '#fce7f3', 
                padding: '6px 16px', 
                borderRadius: '20px',
                marginBottom: '14px'
              }}
            >
              HerSignal
            </span>
            <h1 style={{ margin: '0 0 10px 0', fontSize: 'clamp(2rem, 5vw, 2.6rem)', color: '#1E293B', fontWeight: '800' }}>
              Make the invisible visible.
            </h1>
            <p style={{ margin: 0, fontSize: '1.05rem', color: '#64748B', fontStyle: 'italic' }}>
              "We help women understand what their bodies have been trying to tell them."
            </p>
          </div>

          {/* BRAND STORY CARD */}
          <div 
            className="card story-card"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: 'clamp(20px, 4vw, 36px)',
              marginBottom: '28px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)',
              boxSizing: 'border-box'
            }}
          >
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.25rem', color: '#1E293B', fontWeight: '700' }}>
              From Fragments to Understanding
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.95rem', color: '#334155', lineHeight: '1.6' }}>
              Women's bodily changes rarely occur in isolation. A headache might be related to sleep or recur before menstruation; breast tenderness might be a short-term change or persist across multiple cycles; mood, pain, temperature, bleeding, and medication records may seem insignificant individually, but when placed on a timeline, they can form clear patterns.
            </p>
            <p style={{ margin: '0 0 20px 0', fontSize: '0.95rem', color: '#334155', lineHeight: '1.6', fontWeight: '600' }}>
              HerSignal doesn't just have users check off records; it completes three core steps:
            </p>

            {/* 3 STEPS GRID */}
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', 
                gap: '16px'
              }}
            >
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontWeight: '700', color: '#be185d', display: 'block', marginBottom: '6px' }}>1. Capture</span>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: '1.4' }}>
                  Record menstrual cycles, symptoms, mood, temperature, sleep, medications, breast changes, and pregnancy-related information.
                </p>
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontWeight: '700', color: '#be185d', display: 'block', marginBottom: '6px' }}>2. Connect</span>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: '1.4' }}>
                  Connect data from different dates and types to find recurring personal health patterns over time.
                </p>
              </div>

              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontWeight: '700', color: '#be185d', display: 'block', marginBottom: '6px' }}>3. Communicate</span>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: '1.4' }}>
                  Transform complex records into clear health summaries that both you and your clinician can easily understand.
                </p>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS (Swapping React Router navigation for instant tab switching) */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveNav('journey')}
              style={{
                background: '#be185d',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(190, 24, 93, 0.2)'
              }}
            >
              Explore Maternal Journey
            </button>
            <button
              onClick={() => setActiveNav('screening')}
              style={{
                background: '#FFFFFF',
                color: '#be185d',
                border: '1px solid #be185d',
                padding: '12px 24px',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              View Screening Reminders
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2: MATERNAL JOURNEY */}
      {activeNav === 'journey' && (
        <div>
          {/* SUB-NAVIGATION TABS */}
          <div 
            style={{ 
              display: 'flex', 
              gap: '8px', 
              marginBottom: '20px', 
              overflowX: 'auto', 
              paddingBottom: '4px' 
            }}
          >
            {[
              { id: 'dashboard', label: '1. Pregnancy Dashboard' },
              { id: 'antenatal', label: '2. Antenatal Visits' },
              { id: 'symptoms', label: '3. Symptom Tracker' },
              { id: 'education', label: '4. Trimester Guide' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setJourneyTab(tab.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: journeyTab === tab.id ? '1px solid #be185d' : '1px solid #CBD5E1',
                  background: journeyTab === tab.id ? '#be185d' : '#FFFFFF',
                  color: journeyTab === tab.id ? '#FFFFFF' : '#475569',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: PREGNANCY DASHBOARD */}
          {journeyTab === 'dashboard' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              <div className="card" style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#be185d', textTransform: 'uppercase' }}>Current Progress</span>
                    <h2 style={{ margin: '2px 0 0 0', fontSize: '1.4rem', color: '#1E293B' }}>Week 24 • 2nd Trimester</h2>
                  </div>
                  <div style={{ background: '#fdf2f8', border: '1px solid #fbcfe8', padding: '8px 14px', borderRadius: '8px', color: '#be185d', fontSize: '0.85rem', fontWeight: '600' }}>
                    👶 Baby size: Corn Ear (~30cm, 600g)
                  </div>
                </div>

                <div style={{ width: '100%', background: '#F1F5F9', height: '10px', borderRadius: '5px', overflow: 'hidden', marginBottom: '16px' }}>
                  <div style={{ width: '60%', background: '#be185d', height: '100%', borderRadius: '5px' }}></div>
                </div>

                <p style={{ margin: '0 0 16px 0', fontSize: '0.88rem', color: '#64748B' }}>
                  Next Antenatal Visit Countdown: <strong>5 days remaining</strong> (WHO Contact #4 of 8)
                </p>

                <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    How are you feeling today?
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Mild back fatigue, good energy..."
                    value={quickCheckin}
                    onChange={(e) => setQuickCheckin(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ANTENATAL VISIT TRACKER */}
          {journeyTab === 'antenatal' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              <div className="card" style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px', boxSizing: 'border-box' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#1E293B' }}>WHO 8-Contact Schedule Checklist</h3>
                <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: '#64748B' }}>
                  Track completed vs. upcoming clinical milestones to ensure optimal maternal health.
                </p>

                <div style={{ display: 'grid', gap: '8px', marginBottom: '20px' }}>
                  {[
                    { contact: 'Contact 1 (Up to 12 weeks)', status: 'Completed', date: '14 Mar 2026' },
                    { contact: 'Contact 2 (20 weeks)', status: 'Completed', date: '12 May 2026' },
                    { contact: 'Contact 3 (26 weeks)', status: 'Upcoming', date: '28 Jul 2026' },
                    { contact: 'Contact 4 (30 weeks)', status: 'Scheduled', date: '25 Aug 2026' }
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.88rem' }}>
                      <span style={{ fontWeight: '600', color: '#334155' }}>{item.contact}</span>
                      <span style={{ fontSize: '0.78rem', padding: '3px 8px', borderRadius: '12px', background: item.status === 'Completed' ? '#DCFCE7' : '#FEF3C7', color: item.status === 'Completed' ? '#166534' : '#92400E', fontWeight: '700' }}>
                        {item.status} ({item.date})
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#fdf2f8', border: '1px solid #fbcfe8', padding: '14px', borderRadius: '10px' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', color: '#be185d' }}>✨ Pre-Visit AI Consultation Summary</h4>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.82rem', color: '#831843' }}>
                    Your logged symptoms and questions are auto-organized into a clear brief for your doctor.
                  </p>
                  <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: '6px', fontSize: '0.85rem', color: '#475569', border: '1px dashed #f472b6', lineHeight: '1.5' }}>
                    • Frequency of mild lower back pain increased over past 4 days.<br />
                    • Question for clinician: Safe stretching routines for third trimester?
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SYMPTOM LOG */}
          {journeyTab === 'symptoms' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              <div className="card" style={{ background: '#FEF2F2', borderRadius: '14px', border: '2px solid #EF4444', padding: '20px', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🚨</span>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#991B1B' }}>Urgent Flags (Immediate Action Required)</h3>
                </div>
                <p style={{ margin: '0 0 14px 0', fontSize: '0.85rem', color: '#B91C1C' }}>
                  Severe headache, vision changes, sudden swelling, reduced fetal movement, bleeding, or fever. Never blended with routine logging.
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button style={{ background: '#EF4444', color: '#FFFFFF', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>
                    📞 Call Doctor / Emergency Now
                  </button>
                </div>
              </div>

              <div className="card" style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px', boxSizing: 'border-box' }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: '#1E293B' }}>Routine Log</h3>
                <p style={{ margin: '0 0 14px 0', fontSize: '0.85rem', color: '#64748B' }}>
                  Nausea, fatigue, mild back pain, sleep quality — logged casually with no alarm styling.
                </p>
                <textarea 
                  rows="3" 
                  placeholder="Log daily routine symptoms..."
                  value={routineNote}
                  onChange={(e) => setRoutineNote(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none', marginBottom: '10px' }}
                />
                <button style={{ background: '#be185d', color: '#FFFFFF', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
                  Save Routine Entry
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: EDUCATIONAL CONTENT */}
          {journeyTab === 'education' && (
            <div style={{ display: 'grid', gap: '16px' }}>
              <div className="card" style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px', boxSizing: 'border-box' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: '#1E293B' }}>Trimester-by-Trimester Guides</h3>
                <p style={{ margin: '0 0 16px 0', fontSize: '0.88rem', color: '#64748B', lineHeight: '1.5' }}>
                  Short, non-alarming explainers curated to help you understand what is normal and expected at each specific stage of your pregnancy journey.
                </p>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {['First Trimester: Early development & managing fatigue', 'Second Trimester: Movement, nutrition, & body changes', 'Third Trimester: Preparation, birth signs, & postpartum planning'].map((guide, idx) => (
                    <div key={idx} style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>
                      📖 {guide}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: SCREENING REMINDERS */}
      {activeNav === 'screening' && (
        <div className="screening-page">
          <div className="screening-header" style={{ marginBottom: '20px' }}>
            <div 
              className="disclaimer" 
              style={{
                background: '#F8FAFC',
                borderLeft: '4px solid #be185d',
                padding: '12px 16px',
                fontSize: '0.88rem',
                color: '#475569',
                borderRadius: '4px',
                lineHeight: '1.5'
              }}
            >
              These are general awareness reminders based on standard medical screening intervals—not a diagnosis or personalized medical recommendation. Consult your healthcare specialist about your specific health needs.
            </div>
          </div>

          {/* FEEDBACK BANNERS */}
          {successMsg && (
            <div style={{ background: '#ECFDF5', border: '1px solid #10B981', color: '#065F46', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
              ✨ {successMsg}
            </div>
          )}

          {errorMsg && (
            <div style={{ background: '#FEF2F2', border: '1px solid #EF4444', color: '#991B1B', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
              ⚠️ {errorMsg}
            </div>
          )}

          {/* DYNAMIC CONTENT LOADING */}
          {loading ? (
            <p style={{ color: '#6B7280', fontSize: '0.95rem', textAlign: 'center', padding: '30px 0' }}>Loading schedule from server...</p>
          ) : reminders.length === 0 ? (
            <div className="card empty-state" style={{ padding: '32px 16px', textAlign: 'center', background: '#FFFFFF', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
              <p style={{ margin: 0, color: '#64748B', fontSize: '1rem' }}>
                No screening reminders found in your account profile.
              </p>
            </div>
          ) : (
            <div className="reminders-list" style={{ display: 'grid', gap: '16px' }}>
              {reminders.map((r) => {
                const displayTitle = r.label || formatTypeLabel(r.type);
                const isSavingThis = saving === r.type;

                return (
                  <div
                    key={r.type}
                    className="card"
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      padding: '16px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                      overflowWrap: 'break-word'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1E293B', fontWeight: '600', flex: '1 1 200px' }}>
                        {displayTitle}
                      </h3>
                      <span
                        className={`pill ${r.due ? 'due' : 'ok'}`}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          background: r.due ? '#FEE2E2' : '#DCFCE7',
                          color: r.due ? '#991B1B' : '#166534',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {r.due ? 'Due' : 'Up to date'}
                      </span>
                    </div>

                    <p style={{ margin: '0 0 10px 0', fontSize: '0.88rem', color: '#64748B' }}>
                      Last logged: <strong>{r.lastDate ? r.lastDate : 'Never'}</strong>
                    </p>

                    {r.guidance && (
                      <p style={{ margin: '0 0 16px 0', fontSize: '0.88rem', color: '#334155', lineHeight: '1.4' }}>
                        {r.guidance}
                      </p>
                    )}

                    <div 
                      style={{ 
                        display: 'flex', 
                        gap: '12px', 
                        alignItems: 'stretch', 
                        flexWrap: 'wrap',
                        background: '#F8FAFC',
                        padding: '12px',
                        borderRadius: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: '1 1 200px' }}>
                        <label style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '600' }}>
                          Log completed {displayTitle}
                        </label>
                        <input
                          type="date"
                          value={dates[r.type] || ''}
                          onChange={(e) => setDates((d) => ({ ...d, [r.type]: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            fontSize: '0.9rem',
                            boxSizing: 'border-box',
                            outline: 'none',
                            background: '#FFFFFF'
                          }}
                        />
                      </div>

                      <button
                        className="btn secondary small"
                        onClick={() => logDate(r.type)}
                        disabled={isSavingThis || !dates[r.type]}
                        style={{
                          alignSelf: 'flex-end',
                          padding: '10px 16px',
                          borderRadius: '6px',
                          border: 'none',
                          background: dates[r.type] ? '#be185d' : '#94A3B8',
                          color: '#FFFFFF',
                          fontWeight: '600',
                          fontSize: '0.85rem',
                          cursor: dates[r.type] && !isSavingThis ? 'pointer' : 'not-allowed',
                          flex: '1 1 auto',
                          minWidth: '110px'
                        }}
                      >
                        {isSavingThis ? 'Saving…' : 'Save date'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}