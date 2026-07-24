import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

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
        boxShadow: '0 2px 6px rgba(3, 105, 161, 0.08)',
        border: '1px solid #BAE6FD',
        boxSizing: 'border-box',
        padding: `${size * 0.18}px`
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

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div 
      className="auth-page" 
      style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box',
        backgroundColor: '#F8F9FA'
      }}
    >
      <div 
        className="card auth-card"
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: 'clamp(20px, 5vw, 32px)',
          boxSizing: 'border-box',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}
      >
        {/* Brand Header */}
        <div className="auth-header" style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <Logo size={48} />
          </div>
          <span 
            className="auth-brand" 
            style={{ 
              display: 'inline-block', 
              fontSize: '0.85rem', 
              fontWeight: '700', 
              color: '#2B6CB0',
              background: '#E6FFFA',
              padding: '2px 10px', 
              borderRadius: '20px',
              marginBottom: '12px'
            }}
          >
              HerSignal
          </span>
          <h1 style={{ margin: '0 0 6px 0', fontSize: 'clamp(1.5rem, 4vw, 1.8rem)', color: '#2D3748', fontWeight: '700' }}>
            Welcome back
          </h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#4A5568' }}>
            Log in to your private health workspace.
          </p>
        </div>

        {error && (
          <div 
            className="error-banner"
            style={{
              background: '#FEF2F2',
              border: '1px solid #EF4444',
              color: '#991B1B',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.88rem',
              marginBottom: '16px'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="auth-form" style={{ display: 'grid', gap: '16px' }}>
          <div className="field" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="email" style={{ fontSize: '0.85rem', fontWeight: '600', color: '#2D3748' }}>
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.95rem',
                boxSizing: 'border-box',
                outline: 'none',
                backgroundColor: '#FAFAF9'
              }}
            />
          </div>

          <div className="field" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="password" style={{ fontSize: '0.85rem', fontWeight: '600', color: '#2D3748' }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.95rem',
                boxSizing: 'border-box',
                outline: 'none',
                backgroundColor: '#FAFAF9'
              }}
            />
          </div>

          <button
            className="auth-btn"
            type="submit"
            disabled={busy}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background: '#319795',
              color: '#FFFFFF',
              fontWeight: '600',
              fontSize: '0.95rem',
              cursor: busy ? 'not-allowed' : 'pointer',
              marginTop: '4px',
              boxShadow: '0 2px 4px rgba(49, 151, 149, 0.2)'
            }}
          >
            {busy ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="auth-footer" style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.88rem', color: '#718096' }}>
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link" style={{ color: '#3182CE', fontWeight: '600', textDecoration: 'none' }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}