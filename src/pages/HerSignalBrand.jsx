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
        boxSizing: 'border-box'
      }}
    >
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

      {/* ACTION BUTTONS */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate('/login')}
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
          Sign In to Your Workspace
        </button>
        <button
          onClick={() => navigate('/signup')}
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
          Create an Account
        </button>
      </div>
    </div>
  );
}