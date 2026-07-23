import { useState } from 'react';

export default function MaternalJourney() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [routineNote, setRoutineNote] = useState('');
  const [quickCheckin, setQuickCheckin] = useState('');

  return (
    <div 
      className="maternal-container"
      style={{
        width: '100%',
        maxWidth: '850px',
        margin: '0 auto',
        padding: '20px 16px',
        boxSizing: 'border-box'
      }}
    >
      {/* MODULE HEADER */}
      <div className="maternal-header" style={{ marginBottom: '24px' }}>
        <span 
          style={{ 
            display: 'inline-block', 
            fontSize: '0.8rem', 
            fontWeight: '700', 
            color: '#0284c7', 
            background: '#e0f2fe', 
            padding: '4px 12px', 
            borderRadius: '20px',
            marginBottom: '10px'
          }}
        >
          High-Stakes Life Stage Module
        </span>
        <h1 style={{ margin: '0 0 6px 0', fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: '#1E293B', fontWeight: '700' }}>
          Maternal Journey
        </h1>
        <p style={{ margin: 0, fontSize: '0.92rem', color: '#64748B', lineHeight: '1.5' }}>
          Structured clinical tracking built around WHO antenatal standards, intelligent symptom segmentation, and complete privacy protection.
        </p>
      </div>

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
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: activeTab === tab.id ? '1px solid #0284c7' : '1px solid #CBD5E1',
              background: activeTab === tab.id ? '#0284c7' : '#FFFFFF',
              color: activeTab === tab.id ? '#FFFFFF' : '#475569',
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
      {activeTab === 'dashboard' && (
        <div style={{ display: 'grid', gap: '16px' }}>
          <div className="card" style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0284c7', textTransform: 'uppercase' }}>Current Progress</span>
                <h2 style={{ margin: '2px 0 0 0', fontSize: '1.4rem', color: '#1E293B' }}>Week 24 • 2nd Trimester</h2>
              </div>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '8px 14px', borderRadius: '8px', color: '#166534', fontSize: '0.85rem', fontWeight: '600' }}>
                👶 Baby size: Corn Ear (~30cm, 600g)
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div style={{ width: '100%', background: '#F1F5F9', height: '10px', borderRadius: '5px', overflow: 'hidden', marginBottom: '16px' }}>
              <div style={{ width: '60%', background: '#0284c7', height: '100%', borderRadius: '5px' }}></div>
            </div>

            <p style={{ margin: '0 0 16px 0', fontSize: '0.88rem', color: '#64748B' }}>
              Next Antenatal Visit Countdown: <strong>5 days remaining</strong> (WHO Contact #4 of 8)
            </p>

            {/* Quick Check-in */}
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
      {activeTab === 'antenatal' && (
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

            {/* AI Consultation Summary Box */}
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

      {/* TAB 3: SYMPTOM LOG (URGENT VS ROUTINE SEPARATION) */}
      {activeTab === 'symptoms' && (
        <div style={{ display: 'grid', gap: '16px' }}>
          
          {/* URGENT FLAGS SECTION */}
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

          {/* ROUTINE LOG SECTION */}
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
            <button style={{ background: '#0F172A', color: '#FFFFFF', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
              Save Routine Entry
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: EDUCATIONAL CONTENT */}
      {activeTab === 'education' && (
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
  );
}