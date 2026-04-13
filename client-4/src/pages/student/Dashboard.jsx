import { useEffect, useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import API from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import PaymentWall from '../../components/student/PaymentWall';

function StudentDashboard() {
  const { user } = useAuth();
  const [enrollment, setEnrollment] = useState(null);
  const [payments, setPayments]     = useState([]);
  const [notices, setNotices]       = useState([]);
  const [attendance, setAttendance] = useState({ summary: { present: 0, absent: 0, leave: 0, total: 0 } });
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  const fetchData = () => {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    setLoading(true);
    setError(null);
    Promise.all([
      API.get('/students/me/enrollment'),
      API.get('/payment/history'),
      API.get('/notices?target=all'),
      API.get(`/attendance/my?month=${month}`),
    ]).then(([e, p, n, a]) => {
      setEnrollment(e.data);
      const paymentList = p.data.payments || p.data;
      setPayments(Array.isArray(paymentList) ? paymentList.slice(0, 5) : []);
      setNotices(Array.isArray(n.data) ? n.data.slice(0, 4) : []);
      setAttendance(a.data);
    }).catch(() => {
      setError('Failed to load dashboard data. Please refresh.');
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const statusColor = { active: 'badge-success', pending: 'badge-warning', expired: 'badge-danger', rejected: 'badge-danger' };
  const pct = attendance.summary.total > 0
    ? Math.round((attendance.summary.present / attendance.summary.total) * 100) : 0;

  if (loading) return (
    <div className="layout">
      <Sidebar />
      <div className="main-content loader"><div className="spinner" /></div>
    </div>
  );

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <div>
            <h1>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
            <p>Here's your academy overview</p>
          </div>
          {enrollment?.status === 'active' && (
            <Link to="/payment" className="btn btn-primary">💳 Pay This Month</Link>
          )}
        </div>

        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 10, padding: '14px 18px', marginBottom: 20 }}>
            <span style={{ color: '#991b1b' }}>{error}</span>
            <button onClick={fetchData} className="btn btn-outline btn-sm" style={{ marginLeft: 12 }}>Retry</button>
          </div>
        )}

        {enrollment?.status === 'pending' && (
          <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 10, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>⏳</span>
            <div>
              <div style={{ fontWeight: 600 }}>Enrollment Pending Approval</div>
              <div style={{ fontSize: 13, color: '#92400e' }}>Admin will approve your enrollment soon. You'll receive an email once approved.</div>
            </div>
          </div>
        )}

        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-icon">📋</span>
            <span className="stat-label">Enrollment Status</span>
            <span className={`badge ${statusColor[enrollment?.status] || 'badge-gray'}`} style={{ fontSize: 14, padding: '4px 12px' }}>
              {enrollment?.status || 'Not enrolled'}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🏃</span>
            <span className="stat-label">Plan</span>
            <span className="stat-value" style={{ fontSize: 16, textTransform: 'capitalize' }}>
              {enrollment?.type} — {enrollment?.plan}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">📅</span>
            <span className="stat-label">This Month Attendance</span>
            <span className="stat-value">{pct}%</span>
            <span style={{ fontSize: 12, color: '#6b7280' }}>{attendance.summary.present} present / {attendance.summary.absent} absent</span>
          </div>
          <div className="stat-card accent">
            <span className="stat-icon">💰</span>
            <span className="stat-label">Monthly Fee</span>
            <span className="stat-value">₹{enrollment?.feeAmount?.toLocaleString() || '0'}</span>
            <span style={{ fontSize: 12, opacity: 0.8 }}>Due by 5th every month</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Recent Payments</h3>
              <Link to="/payment" style={{ fontSize: 13, color: '#e94560' }}>View all →</Link>
            </div>
            {payments.length === 0 ? (
              <p style={{ color: '#9ca3af', fontSize: 14 }}>No payments yet</p>
            ) : payments.map(p => (
              <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{p.month || p.planName}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>{new Date(p.createdAt).toLocaleDateString('en-IN')}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700 }}>₹{p.amount?.toLocaleString()}</div>
                  <span className={`badge ${p.status === 'paid' ? 'badge-success' : p.status === 'failed' ? 'badge-danger' : 'badge-warning'}`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Notices</h3>
              <Link to="/notices" style={{ fontSize: 13, color: '#e94560' }}>View all →</Link>
            </div>
            {notices.length === 0 ? (
              <p style={{ color: '#9ca3af', fontSize: 14 }}>No notices</p>
            ) : notices.map(n => (
              <div key={n._id} className={`notice-card ${n.priority === 'urgent' ? 'urgent' : ''}`} style={{ marginBottom: 10 }}>
                <div className="notice-title">{n.priority === 'urgent' && '🚨 '}{n.title}</div>
                <div className="notice-meta">{new Date(n.createdAt).toLocaleDateString('en-IN')} · {n.createdBy?.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <PaymentWall>
      <StudentDashboard />
    </PaymentWall>
  );
}
