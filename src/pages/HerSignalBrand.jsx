import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        boxShadow: '0 4px 12px rgba(3, 105, 161, 0.1)',
        border: '1px solid #BAE6FD',
        boxSizing: 'border-box',
        padding: `${size * 0.18}px`,
        transition: 'transform 0.3s ease'
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
            <stop offset="0%" stopColor="#0369A1" />
            <stop offset="50%" stopColor="#2E7D32" />
            <stop offset="100%" stopColor="#7C3AED" />
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

export default function HerSignalBrand() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('brand'); // 'brand' or 'doctor'
  const [requests, setRequests] = useState([
    { id: 1, patientName: 'Fatima Al-Farsi', hospital: 'Dubai Hospital (UAE)', date: '2026-07-23', summary: 'Irregular cycle tracking with persistent lower abdominal cramping and fatigue.', status: 'Pending' },
    { id: 2, patientName: 'Elena Rostova', hospital: 'Charité Universitätsmedizin (Germany)', date: '2026-07-24', summary: 'Pre-menstrual migraine clustering and temperature fluctuation records.', status: 'Pending' }
  ]);
  const [appointments, setAppointments] = useState([
    { id: 1, patientName: 'Noor Al-Sabah', hospital: 'Cleveland Clinic Abu Dhabi (UAE)', time: 'Today, 10:30 AM', type: 'Virtual Consultation - Cycle Review' },
    { id: 2, patientName: 'Astrid Lindstrom', hospital: 'Karolinska University Hospital (Sweden)', time: 'Tomorrow, 2:00 PM', type: 'Symptom & Hormone Timeline Review' }
  ]);

  const handleAction = (id, newStatus) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: newStatus } : req));
  };

  if (viewMode === 'doctor') {
    return (
      <div 
        className="hersignal-container"
        style={{
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
          padding: '40px 20px',
          boxSizing: 'border-box',
          backgroundColor: '#F9F8F6',
          minHeight: '100vh',
          fontFamily: 'Inter, system-ui, sans-serif',
          color: '#2C3E50'
        }}
      >
        {/* DOCTOR HEADER */}
        <div className="hersignal-header" style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <Logo size={64} />
          </div>
          <span 
            style={{ 
              display: 'inline-block', 
              fontSize: '0.85rem', 
              fontWeight: '700', 
              color: '#0D9488',
              background: '#CCFBF1',
              padding: '6px 16px', 
              borderRadius: '20px',
              marginBottom: '14px',
              boxShadow: '0 2px 4px rgba(13, 148, 136, 0.08)'
            }}
          >
            HerSignal — Clinician Portal
          </span>
          <h1 style={{ margin: '0 0 10px 0', fontSize: 'clamp(2rem, 5vw, 2.6rem)', color: '#1E293B', fontWeight: '800' }}>
            Doctor's Dashboard
          </h1>
          <p style={{ margin: 0, fontSize: '1.05rem', color: '#64748B', fontStyle: 'italic' }}>
            "Review patient sharing requests and scheduled appointments across global healthcare networks."
          </p>
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={() => setViewMode('brand')}
              style={{
                background: 'transparent',
                color: '#3B82F6',
                border: '1px solid #3B82F6',
                padding: '10px 20px',
                borderRadius: '10px',
                fontWeight: '600',
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              ← Back to Overview Page
            </button>
          </div>
        </div>

        {/* APPOINTMENTS SECTION */}
        <div 
          className="card appointments-card"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '20px',
            padding: 'clamp(20px, 4vw, 36px)',
            marginBottom: '28px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.04), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
            boxSizing: 'border-box'
          }}
        >
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', color: '#1E293B', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📅</span> Upcoming Booked Appointments
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {appointments.map((apt) => (
              <div 
                key={apt.id}
                style={{
                  background: '#F0FDF4',
                  border: '1px solid #DCFCE7',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  transition: 'transform 0.2s ease'
                }}
              >
                <div>
                  <span style={{ fontWeight: '700', fontSize: '1rem', color: '#166534', display: 'block', marginBottom: '2px' }}>{apt.patientName}</span>
                  <span style={{ fontSize: '0.82rem', color: '#047857', display: 'block', marginBottom: '4px', fontWeight: '500' }}>🏥 {apt.hospital}</span>
                  <span style={{ fontSize: '0.85rem', color: '#374151' }}>{apt.type}</span>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', background: '#FFFFFF', padding: '8px 14px', borderRadius: '8px', border: '1px solid #BBF7D0', color: '#166534', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  {apt.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* INCOMING REQUESTS SECTION */}
        <div 
          className="card requests-card"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '20px',
            padding: 'clamp(20px, 4vw, 36px)',
            marginBottom: '28px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.04), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
            boxSizing: 'border-box'
          }}
        >
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', color: '#1E293B', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📥</span> Incoming Patient Connection Requests
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {requests.map((req) => (
              <div 
                key={req.id}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <span style={{ fontWeight: '700', fontSize: '1.05rem', color: '#1E293B', display: 'block' }}>{req.patientName}</span>
                    <span style={{ fontSize: '0.85rem', color: '#0D9488', fontWeight: '600' }}>🏥 {req.hospital}</span>
                  </div>
                  <span style={{ fontSize: '0.82rem', color: '#64748B', background: '#F1F5F9', padding: '4px 10px', borderRadius: '6px' }}>Requested on: {req.date}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.92rem', color: '#334155', lineHeight: '1.5', background: '#FFFFFF', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <strong style={{ color: '#0F172A' }}>Health Summary:</strong> {req.summary}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', flexWrap: 'wrap', gap: '10px' }}>
                  <span 
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: '600',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      backgroundColor: req.status === 'Accepted' ? '#DCFCE7' : req.status === 'Declined' ? '#FEF2F2' : '#FEF3C7',
                      color: req.status === 'Accepted' ? '#166534' : req.status === 'Declined' ? '#991B1B' : '#92400E'
                    }}
                  >
                    Status: {req.status}
                  </span>

                  {req.status === 'Pending' ? (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => handleAction(req.id, 'Accepted')}
                        style={{
                          background: '#10B981',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '8px 18px',
                          borderRadius: '8px',
                          fontWeight: '600',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
                        }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleAction(req.id, 'Declined')}
                        style={{
                          background: '#EF4444',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '8px 18px',
                          borderRadius: '8px',
                          fontWeight: '600',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
                        }}
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: '#64748B', fontStyle: 'italic' }}>
                      Request processed successfully
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="hersignal-container"
      style={{
        width: '100%',
        maxWidth: '900px',
        margin: '0 auto',
        padding: '40px 20px',
        boxSizing: 'border-box',
        backgroundColor: '#F9F8F6',
        minHeight: '100vh',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#2C3E50'
      }}
    >
      {/* BRAND HEADER & SLOGAN */}
      <div className="hersignal-header" style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <Logo size={64} />
        </div>
        <span 
          style={{ 
            display: 'inline-block', 
            fontSize: '0.85rem', 
            fontWeight: '700', 
            color: '#3B82F6',
            background: '#E0F2FE',
            padding: '6px 16px', 
            borderRadius: '20px',
            marginBottom: '14px',
            boxShadow: '0 2px 4px rgba(59, 130, 246, 0.08)'
          }}
        >
          HerSignal
        </span>
        <h1 style={{ margin: '0 0 10px 0', fontSize: 'clamp(2rem, 5vw, 2.8rem)', color: '#1E293B', fontWeight: '800', letterSpacing: '-0.02em' }}>
          Make the <span style={{ background: 'linear-gradient(135deg, #0369A1 0%, #7C3AED 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', padding: '0 2px', borderBottom: '3px solid #7C3AED' }}>invisible</span> <span style={{ background: 'linear-gradient(135deg, #2E7D32 0%, #0369A1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', padding: '0 2px', borderBottom: '3px solid #2E7D32' }}>visible</span>.
        </h1>
        <p style={{ margin: 0, fontSize: '1.1rem', color: '#64748B', fontStyle: 'italic', marginBottom: '20px' }}>
          "We help women understand what their bodies have been trying to tell them."
        </p>

        {/* DIRECT NO-LOGIN LINK TO DOCTOR'S INTERFACE */}
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={() => setViewMode('doctor')}
            style={{
              background: '#0D9488',
              color: '#FFFFFF',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '30px',
              fontWeight: '600',
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(13, 148, 136, 0.25)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            Are you a doctor? Click here →
          </button>
        </div>
      </div>

      {/* BRAND STORY CARD */}
      <div 
        className="card story-card"
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '20px',
          padding: 'clamp(20px, 4vw, 36px)',
          marginBottom: '28px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.04), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
          boxSizing: 'border-box'
        }}
      >
        <h3 style={{ margin: '0 0 12px 0', fontSize: '1.35rem', color: '#1E293B', fontWeight: '700' }}>
          From Fragments to Understanding
        </h3>
        <p style={{ margin: '0 0 16px 0', fontSize: '0.98rem', color: '#334155', lineHeight: '1.7' }}>
          Women's bodily changes rarely occur in isolation. A headache might be related to sleep or recur before menstruation; breast tenderness might be a short-term change or persist across multiple cycles; mood, pain, temperature, bleeding, and medication records may seem insignificant individually, but when placed on a timeline, they can form clear patterns.
        </p>
        <p style={{ margin: '0 0 24px 0', fontSize: '0.98rem', color: '#334155', lineHeight: '1.7', fontWeight: '600' }}>
          HerSignal doesn't just have users check off records; it completes three core steps:
        </p>

        {/* 3 STEPS GRID */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
            gap: '18px'
          }}
        >
          <div style={{ background: '#F0FDF4', padding: '20px', borderRadius: '14px', border: '1px solid #DCFCE7', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
            <span style={{ fontWeight: '700', color: '#4A7C59', display: 'block', marginBottom: '8px', fontSize: '1.05rem' }}>1. Capture</span>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#2F4F4F', lineHeight: '1.5' }}>
              Record menstrual cycles, symptoms, mood, temperature, sleep, medications, breast changes, and pregnancy-related information.
            </p>
          </div>

          <div style={{ background: '#F0FDFA', padding: '20px', borderRadius: '14px', border: '1px solid #CCFBF1', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
            <span style={{ fontWeight: '700', color: '#0D9488', display: 'block', marginBottom: '8px', fontSize: '1.05rem' }}>2. Connect</span>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#0F766E', lineHeight: '1.5' }}>
              Connect data from different dates and types to find recurring personal health patterns over time.
            </p>
          </div>

          <div style={{ background: '#F5F3FF', padding: '20px', borderRadius: '14px', border: '1px solid #EDE9FE', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
            <span style={{ fontWeight: '700', color: '#7C3AED', display: 'block', marginBottom: '8px', fontSize: '1.05rem' }}>3. Communicate</span>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#6D28D9', lineHeight: '1.5' }}>
              Transform complex records into clear health summaries that both you and your clinician can easily understand.
            </p>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', paddingBottom: '20px' }}>
        <button
          onClick={() => navigate('/login')}
          style={{
            background: '#3B82F6',
            color: '#FFFFFF',
            border: 'none',
            padding: '14px 28px',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
            transition: 'transform 0.2s ease'
          }}
        >
          Sign In to Your Health Hub
        </button>
        <button
          onClick={() => navigate('/signup')}
          style={{
            background: '#FFFFFF',
            color: '#1E293B',
            border: '1px solid #CBD5E1',
            padding: '14px 28px',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            transition: 'background-color 0.2s ease'
          }}
        >
          Create an Account
        </button>
      </div>
    </div>
  );
}