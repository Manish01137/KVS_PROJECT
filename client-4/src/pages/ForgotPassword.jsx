import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent! Check your email.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div style={{ fontSize: 40, marginBottom: 8 }}>🔑</div>
          <h1>Forgot Password</h1>
          <p>Enter your email to receive a reset link</p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: 10, padding: '18px 22px', marginBottom: 20 }}>
              <p style={{ color: '#065f46', fontWeight: 600, marginBottom: 4 }}>Reset link sent!</p>
              <p style={{ color: '#047857', fontSize: 14 }}>Check your email inbox for the password reset link. It expires in 30 minutes.</p>
            </div>
            <Link to="/login" style={{ color: '#e94560', fontWeight: 600, fontSize: 14 }}>Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email address</label>
              <input className="form-control" type="email" placeholder="your@email.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}
              style={{ width: '100%', padding: 12, marginTop: 8, fontSize: 15 }}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' }}>
              Remember your password?{' '}
              <Link to="/login" style={{ color: '#e94560', fontWeight: 600 }}>Login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
