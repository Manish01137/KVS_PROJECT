import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});
  const { login } = useAuth();
  const navigate  = useNavigate();

  const validateForm = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div style={{ fontSize: 40, marginBottom: 8 }}>🏆</div>
          <h1>KVS Kabaddi Academy</h1>
          <p>Login to your portal</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="login-email">Email address</label>
            <input id="login-email" className="form-control" type="email" placeholder="your@email.com"
              autoComplete="email" aria-label="Email address"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            {errors.email && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input id="login-password" className="form-control" type="password" placeholder="Enter password"
              autoComplete="current-password" aria-label="Password"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            {errors.password && <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4, display: 'block' }}>{errors.password}</span>}
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ width: '100%', padding: 12, marginTop: 8, fontSize: 15 }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link to="/forgot-password" style={{ color: '#6b7280', fontSize: 13 }}>Forgot password?</Link>
        </div>
        <p style={{ textAlign: 'center', marginTop: 12, fontSize: 14, color: '#6b7280' }}>
          New student?{' '}
          <Link to="/register" style={{ color: '#e94560', fontWeight: 600 }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}
