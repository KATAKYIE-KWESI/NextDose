import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', birthYear: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await signup(form);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
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
          maxWidth: '440px',
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: 'clamp(20px, 5vw, 32px)',
          boxSizing: 'border-box',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}
      >
        
        {/* Circular Logo Monogram Area */}
        <div className="auth-avatar-container" style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div 
            className="auth-logo-ring"
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#fce7f3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #fbcfe8'
            }}
          >
            <span className="auth-logo-initials" style={{ fontWeight: '700', color: '#be185d', fontSize: '1.1rem' }}>ND</span>
          </div>
        </div>

        {/* Brand & Heading Header */}
        <div className="auth-header" style={{ textAlign: 'center', marginBottom: '20px' }}>
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
              marginBottom: '8px'
            }}
          >
            NextDose
          </span>
          <h1 style={{ margin: '0 0 6px 0', fontSize: 'clamp(1.4rem, 4vw, 1.7rem)', color: '#1E293B', fontWeight: '700' }}>
            Create your account
          </h1>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748B' }}>
            Private, judgment-free women's health tracking.
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

        <form onSubmit={onSubmit} className="auth-form" style={{ display: 'grid', gap: '14px' }}>
          <div className="field" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="name" style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
              Full Name
            </label>
            <input 
              id="name"
              type="text"
              placeholder="Your name"
              required 
              value={form.name} 
              onChange={update('name')} 
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
            <label htmlFor="email" style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
              Email address
            </label>
            <input 
              id="email"
              type="email" 
              placeholder="name@example.com"
              required 
              value={form.email} 
              onChange={update('email')} 
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
              placeholder="Min. 6 characters"
              required 
              minLength={6} 
              value={form.password} 
              onChange={update('password')} 
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
            <label htmlFor="birthYear" style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
              Birth year <span className="label-optional" style={{ color: '#94A3B8', fontWeight: '400', fontSize: '0.78rem' }}>(optional — for screening reminders)</span>
            </label>
            <input 
              id="birthYear"
              type="number" 
              placeholder="1998" 
              value={form.birthYear} 
              onChange={update('birthYear')} 
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
              marginTop: '6px'
            }}
          >
            {busy ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="auth-footer" style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.88rem', color: '#64748B' }}>
          Already have an account?{' '}
          <Link to="/login" className="auth-link" style={{ color: '#be185d', fontWeight: '600', textDecoration: 'none' }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}