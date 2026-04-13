import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    address: '', dob: '', gender: 'male',
    guardianName: '', guardianPhone: '',
    enrollmentType: 'kabaddi', plan: 'training',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (key, value) => {
    setForm(f => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }));
  };

  const validateForm = () => {
    const errs = {};
    if (!form.name || form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Valid email is required';
    if (!form.password || form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) errs.password = 'Must contain uppercase, lowercase, and a number';
    if (!form.phone || !/^[6-9]\d{9}$/.test(form.phone)) errs.phone = 'Valid 10-digit phone number required';
    if (form.guardianPhone && !/^[6-9]\d{9}$/.test(form.guardianPhone)) errs.guardianPhone = 'Valid phone number required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Password strength indicator
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 2) return { level: 1, label: 'Weak', color: '#ef4444' };
    if (score <= 4) return { level: 2, label: 'Medium', color: '#f59e0b' };
    return { level: 3, label: 'Strong', color: '#10b981' };
  };
  const pwdStrength = getPasswordStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await register(form);
      toast.success('Registered! Awaiting admin approval.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page" style={{ padding: '24px 0', alignItems: 'flex-start' }}>
      <div className="auth-card" style={{ maxWidth: 560, margin: '0 auto' }}>
        <div className="auth-logo">
          <div style={{ fontSize: 36, marginBottom: 6 }}>🏆</div>
          <h1>Join KVS Academy</h1>
          <p>Fill in your details to register</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ fontWeight: 600, fontSize: 13, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Personal Info</div>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input className="form-control" placeholder="Ramesh Kumar" aria-label="Full name"
                value={form.name} onChange={e => set('name', e.target.value)} required />
              {errors.name && <span style={{ color: '#ef4444', fontSize: 12 }}>{errors.name}</span>}
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input className="form-control" placeholder="9876543210" aria-label="Phone number"
                value={form.phone} onChange={e => set('phone', e.target.value)} required maxLength={10} />
              {errors.phone && <span style={{ color: '#ef4444', fontSize: 12 }}>{errors.phone}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input className="form-control" type="email" placeholder="email@example.com" autoComplete="email"
                aria-label="Email" value={form.email} onChange={e => set('email', e.target.value)} required />
              {errors.email && <span style={{ color: '#ef4444', fontSize: 12 }}>{errors.email}</span>}
            </div>
            <div className="form-group">
              <label>Password *</label>
              <input className="form-control" type="password" placeholder="Min 8 characters" autoComplete="new-password"
                aria-label="Password" value={form.password} onChange={e => set('password', e.target.value)} required minLength={8} />
              {form.password && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#e5e7eb' }}>
                    <div style={{ width: `${(pwdStrength.level / 3) * 100}%`, height: '100%', borderRadius: 2, background: pwdStrength.color, transition: 'all 0.3s' }} />
                  </div>
                  <span style={{ fontSize: 11, color: pwdStrength.color, fontWeight: 600 }}>{pwdStrength.label}</span>
                </div>
              )}
              {errors.password && <span style={{ color: '#ef4444', fontSize: 12 }}>{errors.password}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Date of Birth</label>
              <input className="form-control" type="date" aria-label="Date of birth"
                value={form.dob} onChange={e => set('dob', e.target.value)} max={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select className="form-control" aria-label="Gender" value={form.gender} onChange={e => set('gender', e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Address</label>
            <input className="form-control" placeholder="Village, District, State" aria-label="Address"
              value={form.address} onChange={e => set('address', e.target.value)} />
          </div>

          <div style={{ fontWeight: 600, fontSize: 13, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '16px 0 12px' }}>Guardian Info</div>
          <div className="form-row">
            <div className="form-group">
              <label>Guardian Name</label>
              <input className="form-control" placeholder="Father/Mother name" aria-label="Guardian name"
                value={form.guardianName} onChange={e => set('guardianName', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Guardian Phone</label>
              <input className="form-control" placeholder="Guardian contact" aria-label="Guardian phone"
                value={form.guardianPhone} onChange={e => set('guardianPhone', e.target.value)} maxLength={10} />
              {errors.guardianPhone && <span style={{ color: '#ef4444', fontSize: 12 }}>{errors.guardianPhone}</span>}
            </div>
          </div>

          <div style={{ fontWeight: 600, fontSize: 13, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '16px 0 12px' }}>Enrollment</div>
          <div className="form-row">
            <div className="form-group">
              <label>Enrollment Type *</label>
              <select className="form-control" aria-label="Enrollment type" value={form.enrollmentType} onChange={e => set('enrollmentType', e.target.value)}>
                <option value="kabaddi">Kabaddi Only</option>
                <option value="gym">Gym Only</option>
                <option value="both">Kabaddi + Gym (Combo)</option>
              </select>
            </div>
            {form.enrollmentType !== 'gym' && (
              <div className="form-group">
                <label>Kabaddi Plan *</label>
                <select className="form-control" aria-label="Kabaddi plan" value={form.plan} onChange={e => set('plan', e.target.value)}>
                  <option value="training">Training Only</option>
                  <option value="hostel">Hostel + Training</option>
                </select>
              </div>
            )}
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ width: '100%', padding: 12, marginTop: 8, fontSize: 15 }}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#6b7280' }}>
          Already registered? <Link to="/login" style={{ color: '#e94560', fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
