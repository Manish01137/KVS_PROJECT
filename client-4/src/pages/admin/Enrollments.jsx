import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import API from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [filter, setFilter]           = useState('pending');
  const [loading, setLoading]         = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const load = (f) => {
    setLoading(true);
    const url = f === 'pending' ? '/enrollment/pending' : '/enrollment/all';
    API.get(url).then(r => setEnrollments(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(filter); }, [filter]);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await API.put(`/admin/enrollment/${id}/approve`);
      toast.success('Enrollment approved');
      load(filter);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve');
    } finally { setActionLoading(null); }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      await API.put(`/admin/enrollment/${id}/reject`);
      toast.success('Enrollment rejected');
      load(filter);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject');
    } finally { setActionLoading(null); }
  };

  const statusBadge = { active: 'badge-success', pending: 'badge-warning', expired: 'badge-danger', rejected: 'badge-danger' };
  const typeColor = { kabaddi: '#dbeafe', gym: '#d1fae5', both: '#fef3c7' };
  const typeText = { kabaddi: '#1e40af', gym: '#065f46', both: '#92400e' };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <div>
            <h1>📋 Enrollments</h1>
            <p>Approve or reject student enrollment requests</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('pending')}>
              Pending {filter === 'pending' && `(${enrollments.length})`}
            </button>
            <button className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('all')}>
              All Enrollments
            </button>
          </div>
        </div>

        {!loading && filter === 'pending' && enrollments.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>All caught up!</div>
            <div style={{ color: '#9ca3af', marginTop: 4 }}>No pending enrollments to review.</div>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {enrollments.map(e => (
              <div key={e._id} className="card" style={{ padding: '18px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%', background: '#e94560',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 700, fontSize: 16, flexShrink: 0,
                    }} aria-hidden="true">
                      {e.userId?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{e.userId?.name}</div>
                      <div style={{ fontSize: 13, color: '#6b7280' }}>{e.userId?.email} · {e.userId?.phone}</div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 5, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 12, fontWeight: 600, padding: '2px 10px', borderRadius: 12, background: typeColor[e.type], color: typeText[e.type] }}>
                          {e.type === 'both' ? '🏃+🏋️ Combo' : e.type === 'gym' ? '🏋️ Gym' : '🏃 Kabaddi'}
                        </span>
                        <span className="badge badge-gray" style={{ textTransform: 'capitalize' }}>{e.plan}</span>
                        <span className={`badge ${statusBadge[e.status] || 'badge-gray'}`}>{e.status}</span>
                        {e.feeAmount > 0 && (
                          <span className="badge badge-info">₹{e.feeAmount?.toLocaleString()}/mo</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <div style={{ fontSize: 13, color: '#9ca3af' }}>
                      Applied: {new Date(e.createdAt).toLocaleDateString('en-IN')}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/admin/students/${e.userId?._id}`} className="btn btn-outline btn-sm">👁 Profile</Link>
                      {e.status === 'pending' && (
                        <>
                          <button className="btn btn-success btn-sm" disabled={actionLoading === e._id}
                            onClick={() => handleApprove(e._id)}>
                            {actionLoading === e._id ? '...' : '✅ Approve'}
                          </button>
                          <button className="btn btn-danger btn-sm" disabled={actionLoading === e._id}
                            onClick={() => handleReject(e._id)}>
                            {actionLoading === e._id ? '...' : '❌ Reject'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
