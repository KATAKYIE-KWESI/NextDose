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
    <div className="auth-page">
      <div className="card auth-card">
        
        {/* Updated Circular Logo Area: Text Monogram replaces Illustration */}
        <div className="auth-avatar-container">
          <div className="auth-logo-ring">
            <span className="auth-logo-initials">ND</span>
          </div>
        </div>

        {/* Brand & Heading Header */}
        <div className="auth-header">
          <span className="auth-brand">NextDose</span>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Private, judgment-free women's health tracking.</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={onSubmit} className="auth-form">
          <div className="field">
            <label htmlFor="name">Full Name</label>
            <input 
              id="name"
              type="text"
              placeholder="Your name"
              required 
              value={form.name} 
              onChange={update('name')} 
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email address</label>
            <input 
              id="email"
              type="email" 
              placeholder="name@example.com"
              required 
              value={form.email} 
              onChange={update('email')} 
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              placeholder="Min. 6 characters"
              required 
              minLength={6} 
              value={form.password} 
              onChange={update('password')} 
            />
          </div>

          <div className="field">
            <label htmlFor="birthYear">
              Birth year <span className="label-optional">(optional — for screening reminders)</span>
            </label>
            <input 
              id="birthYear"
              type="number" 
              placeholder="1998" 
              value={form.birthYear} 
              onChange={update('birthYear')} 
            />
          </div>

          <button className="auth-btn" type="submit" disabled={busy}>
            {busy ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Log in</Link>
        </p>
      </div>
    </div>
  );
}