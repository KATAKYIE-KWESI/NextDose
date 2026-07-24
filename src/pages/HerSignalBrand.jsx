import { useNavigate } from 'react-router-dom';

export default function HerSignalBrand() {
  const navigate = useNavigate();

  return (
    <div 
      className="hersignal-container"
      style={{
        width: '100%',
        maxWidth: '850px',
        margin: '0 auto',
        padding: '40px 16px',
        boxSizing: 'border-box',
        backgroundColor: '#F8FAFC', // Warm off-white / modern background
        minHeight: '100vh',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#334155'
      }}
    >
      {/* BRAND HEADER & SLOGAN */}
      <div className="hersignal-header" style={{ textAlign: 'center', marginBottom: '36px' }}>
        <span 
          style={{ 
            display: 'inline-block', 
            fontSize: '0.85rem', 
            fontWeight: '700', 
            color: '#0369a1', // Soft blue / pale teal harmony
            background: '#e0f2fe', 
            padding: '6px 16px', 
            borderRadius: '20px',
            marginBottom: '14px'
          }}
        >
          HerSignal
        </span>
        <h1 style={{ margin: '0 0 10px 0', fontSize: 'clamp(2rem, 5vw, 2.6rem)', color: '#0F172A', fontWeight: '800' }}>
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
        <h3 style={{ margin: '0 0 12px 0', fontSize: '1.25rem', color: '#0F172A', fontWeight: '700' }}>
          From Fragments to Understanding
        </h3>
        <p style={{ margin: '0 0 16px 0', fontSize: '0.95rem', color: '#334155', lineHeight: '1.6' }}>
          Women's bodily changes rarely occur in isolation. A headache might be related to sleep or recur before menstruation; breast tenderness might be a short-term change or persist across multiple cycles; mood, pain, temperature, bleeding, and medication records may seem insignificant individually, but when placed on a timeline, they can form clear patterns.
        </p>
        <p style={{ margin: '0 0 20px 0', fontSize: '0.95rem', color: '#334155', lineHeight: '1.6', fontWeight: '600' }}>
          HerSignal doesn't just have users check off records; it completes three core steps:
        </p>

        {/* 3 STEPS GRID (Styled with Sage Green & Pale Teal accents) */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', 
            gap: '16px'
          }}
        >
          <div style={{ background: '#F0FDF4', padding: '16px', borderRadius: '10px', border: '1px solid #DCFCE7' }}>
            <span style={{ fontWeight: '700', color: '#166534', display: 'block', marginBottom: '6px' }}>1. Capture</span>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#15803D', lineHeight: '1.4' }}>
              Record menstrual cycles, symptoms, mood, temperature, sleep, medications, breast changes, and pregnancy-related information.
            </p>
          </div>

          <div style={{ background: '#F0F9FF', padding: '16px', borderRadius: '10px', border: '1px solid #E0F2FE' }}>
            <span style={{ fontWeight: '700', color: '#0369a1', display: 'block', marginBottom: '6px' }}>2. Connect</span>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#0284C7', lineHeight: '1.4' }}>
              Connect data from different dates and types to find recurring personal health patterns over time.
            </p>
          </div>

          <div style={{ background: '#FAF5FF', padding: '16px', borderRadius: '10px', border: '1px solid #F3E8FF' }}>
            <span style={{ fontWeight: '700', color: '#7E22CE', display: 'block', marginBottom: '6px' }}>3. Communicate</span>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#6B21A8', lineHeight: '1.4' }}>
              Transform complex records into clear health summaries that both you and your clinician can easily understand.
            </p>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS (Using calm modern teal/blue with Amber/Coral accents) */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate('/login')}
          style={{
            background: '#0EA5E9', // Pale Teal / Soft Blue modern action color
            color: '#FFFFFF',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '0.95rem',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(14, 165, 233, 0.2)'
          }}
        >
          Sign In to Your Workspace
        </button>
        <button
          onClick={() => navigate('/signup')}
          style={{
            background: '#FFFFFF',
            color: '#0F172A',
            border: '1px solid #CBD5E1',
            padding: '12px 24px',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '0.95rem',
            cursor: 'pointer'
          }}
        >
          Create an Account
        </button>
      </div>
    </div>
  );
}