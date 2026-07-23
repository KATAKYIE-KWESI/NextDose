import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

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
        boxSizing: 'border-box'
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
          <span 
            className="auth-brand" 
            style={{ 
              display: 'inline-block', 
              fontSize: '0.85rem', 
              fontWeight: '700', 
              color: '#be185d', 
              background: '#fce7f3', 
              padding: '2px 10px', 
              borderRadius: '20px',
              marginBottom: '12px'
            }}
          >
            NextDose
          </span>
          <h1 style={{ margin: '0 0 6px 0', fontSize: 'clamp(1.5rem, 4vw, 1.8rem)', color: '#1E293B', fontWeight: '700' }}>
            Welcome back
          </h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748B' }}>
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
            <label htmlFor="email" style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
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
                outline: 'none'
              }}
            />
          </div>

          <div className="field" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="password" style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
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
                outline: 'none'
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
              background: '#ec4899',
              color: '#FFFFFF',
              fontWeight: '600',
              fontSize: '0.95rem',
              cursor: busy ? 'not-allowed' : 'pointer',
              marginTop: '4px'
            }}
          >
            {busy ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="auth-footer" style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.88rem', color: '#64748B' }}>
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link" style={{ color: '#be185d', fontWeight: '600', textDecoration: 'none' }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}