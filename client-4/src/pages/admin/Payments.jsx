import { useEffect, useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import API from '../../utils/api';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [total,    setTotal]    = useState(0);
  const [loading,  setLoading]  = useState(true);
  const [page,     setPage]     = useState(1);
  const [filters,  setFilters]  = useState({ month: '', status: '' });
  const limit = 20;

  useEffect(() => {
    setLoading(true);
    const q = new URLSearchParams({ page, limit, ...Object.fromEntries(Object.entries(filters).filter(([,v]) => v)) });
    API.get(`/payment/all?${q}`)
      .then(r => { setPayments(r.data.payments); setTotal(r.data.total); })
      .finally(() => setLoading(false));
  }, [page, filters]);

  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const pages = Math.ceil(total / limit);

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <div><h1>💰 Payments</h1><p>All payment records</p></div>
        </div>

        {/* Stats */}
        <div className="stat-grid" style={{ marginBottom: 20 }}>
          <div className="stat-card">
            <span className="stat-icon">📄</span>
            <span className="stat-label">Total Records</span>
            <span className="stat-value">{total}</span>
          </div>
          <div className="stat-card accent">
            <span className="stat-icon">💰</span>
            <span className="stat-label">Filtered Revenue</span>
            <span className="stat-value">₹{totalRevenue.toLocaleString()}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <label style={{ fontSize: 12, color: '#6b7280', marginBottom: 4, display: 'block' }}>Month</label>
              <input type="month" className="form-control" style={{ width: 180 }}
                value={filters.month} onChange={e => { setFilters(f => ({ ...f, month: e.target.value })); setPage(1); }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#6b7280', marginBottom: 4, display: 'block' }}>Status</label>
              <select className="form-control" style={{ width: 140 }}
                value={filters.status} onChange={e => { setFilters(f => ({ ...f, status: e.target.value })); setPage(1); }}>
                <option value="">All</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="created">Pending</option>
              </select>
            </div>
            <button className="btn btn-outline btn-sm" style={{ marginTop: 20 }}
              onClick={() => { setFilters({ month: '', status: '' }); setPage(1); }}>
              Clear filters
            </button>
            <button className="btn btn-outline btn-sm" style={{ marginTop: 20 }}
              onClick={() => setFilters(f => ({ ...f, month: currentMonth }))}>
              This month
            </button>
          </div>
        </div>

        <div className="card" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Student</th><th>Month</th><th>Plan</th>
                    <th>Amount</th><th>Late Fee</th><th>Status</th>
                    <th>Payment ID</th><th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32, color: '#9ca3af' }}>No payments found</td></tr>
                  ) : payments.map(p => (
                    <tr key={p._id}>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{p.userId?.name || '—'}</div>
                        <div style={{ fontSize: 12, color: '#9ca3af' }}>{p.userId?.phone}</div>
                      </td>
                      <td style={{ fontWeight: 500 }}>{p.month || '—'}</td>
                      <td style={{ fontSize: 13, color: '#6b7280' }}>{p.planName}</td>
                      <td style={{ fontWeight: 700, color: '#1a1a2e' }}>₹{p.amount?.toLocaleString()}</td>
                      <td>
                        {p.lateFeeAmount > 0
                          ? <span style={{ color: '#ef4444', fontSize: 13 }}>₹{p.lateFeeAmount}</span>
                          : <span style={{ color: '#9ca3af' }}>—</span>
                        }
                      </td>
                      <td>
                        <span className={`badge ${p.status === 'paid' ? 'badge-success' : p.status === 'failed' ? 'badge-danger' : 'badge-warning'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, color: '#9ca3af', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.razorpayPaymentId || '—'}
                      </td>
                      <td style={{ fontSize: 13, color: '#9ca3af' }}>
                        {p.paidAt ? new Date(p.paidAt).toLocaleDateString('en-IN') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pages > 1 && (
            <div style={{ display: 'flex', gap: 8, padding: '16px 20px', justifyContent: 'center', borderTop: '1px solid #f3f4f6' }}>
              <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <span style={{ padding: '6px 12px', fontSize: 14, color: '#6b7280' }}>Page {page} of {pages}</span>
              <button className="btn btn-outline btn-sm" disabled={page === pages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
