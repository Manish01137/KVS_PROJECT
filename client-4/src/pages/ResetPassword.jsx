import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword]       = useState('');
  const [confirmPassword, setConfirm] = useState('');
  const [loading, setLoading]         = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (password.length < 8) {
      return toast.error('Password must be at least 8 characters');
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return toast.error('Password must contain uppercase, lowercase, and a number');
    }
    setLoading(true);
    try {
      await API.post('/auth/reset-password', { token, password });
      toast.success('Password reset successful! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div style={{ fontSize: 40, marginBottom: 8 }}>🔒</div>
          <h1>Reset Password</h1>
          <p>Enter your new password</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input className="form-control" type="password" placeholder="Min 8 characters"
              value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
            <span style={{ fontSize: 12, color: '#9ca3af', marginTop: 4, display: 'block' }}>
              Must contain uppercase, lowercase, and a number
            </span>
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input className="form-control" type="password" placeholder="Re-enter password"
              value={confirmPassword} onChange={e => setConfirm(e.target.value)} required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ width: '100%', padding: 12, marginTop: 8, fontSize: 15 }}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' }}>
            <Link to="/login" style={{ color: '#e94560', fontWeight: 600 }}>Back to Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
