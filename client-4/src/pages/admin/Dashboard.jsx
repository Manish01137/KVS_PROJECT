import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Sidebar from '../../components/common/Sidebar';
import API from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats]       = useState(null);
  const [pending, setPending]   = useState([]);
  const [actionLoading, setActionLoading] = useState(null); // enrollment id being processed
  const [error, setError]       = useState(null);

  const fetchData = useCallback(() => {
    setError(null);
    Promise.all([
      API.get('/admin/dashboard'),
      API.get('/enrollment/pending'),
    ]).then(([s, p]) => {
      setStats(s.data);
      setPending(p.data.slice(0, 5));
    }).catch(() => setError('Failed to load dashboard'));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await API.put(`/admin/enrollment/${id}/approve`);
      toast.success('Enrollment approved');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve');
    } finally { setActionLoading(null); }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      await API.put(`/admin/enrollment/${id}/reject`);
      toast.success('Enrollment rejected');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject');
    } finally { setActionLoading(null); }
  };

  if (!stats && !error) return <div className="layout"><Sidebar /><div className="main-content loader"><div className="spinner" /></div></div>;

  if (error) return (
    <div className="layout"><Sidebar /><div className="main-content">
      <div className="card" style={{ textAlign: 'center', padding: 40 }}>
        <p style={{ color: '#ef4444', marginBottom: 16 }}>{error}</p>
        <button className="btn btn-primary" onClick={fetchData}>Retry</button>
      </div>
    </div></div>
  );

  const chartData = (stats.revenueByMonth || []).reverse().map(r => ({
    month: r._id,
    revenue: r.total,
  }));

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <div><h1>📊 Admin Dashboard</h1><p>KVS Academy overview</p></div>
          <Link to="/admin/students" className="btn btn-primary">👥 View Students</Link>
        </div>

        <div className="stat-grid">
          {[
            { label: 'Total Students', value: stats.totalStudents, icon: '👥', accent: false },
            { label: 'Active Students', value: stats.activeStudents, icon: '✅', accent: false },
            { label: 'Gym Members', value: stats.gymMembers, icon: '🏋️', accent: false },
            { label: 'This Month Revenue', value: `₹${stats.monthlyRevenue?.toLocaleString()}`, icon: '💰', accent: true },
          ].map(s => (
            <div key={s.label} className={`stat-card ${s.accent ? 'accent' : ''}`}>
              <span className="stat-icon">{s.icon}</span>
              <span className="stat-label">{s.label}</span>
              <span className="stat-value">{s.value}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Monthly Revenue (Last 6 months)</h3>
            {chartData.length === 0 ? (
              <p style={{ color: '#9ca3af' }}>No payment data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${v / 1000}k`} />
                  <Tooltip formatter={v => [`₹${v.toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#e94560" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontWeight: 700 }}>
                Pending Approvals
                {stats.pendingApproval > 0 && (
                  <span className="badge badge-warning" style={{ marginLeft: 8 }}>{stats.pendingApproval}</span>
                )}
              </h3>
              <Link to="/admin/enrollments" style={{ fontSize: 13, color: '#e94560' }}>View all →</Link>
            </div>
            {pending.length === 0 ? (
              <p style={{ color: '#9ca3af', fontSize: 14 }}>No pending approvals 🎉</p>
            ) : pending.map(e => (
              <div key={e._id} style={{ padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{e.userId?.name}</div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>{e.type} · {e.plan} · {new Date(e.createdAt).toLocaleDateString('en-IN')}</div>
                <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                  <button className="btn btn-success btn-sm"
                    disabled={actionLoading === e._id}
                    onClick={() => handleApprove(e._id)}>
                    {actionLoading === e._id ? '...' : '✅ Approve'}
                  </button>
                  <button className="btn btn-danger btn-sm"
                    disabled={actionLoading === e._id}
                    onClick={() => handleReject(e._id)}>
                    {actionLoading === e._id ? '...' : '❌ Reject'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
