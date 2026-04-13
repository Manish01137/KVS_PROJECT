import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import API from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminStudentDetail() {
  const { id } = useParams();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null); // 'waive' | 'discount'
  const [mForm,   setMForm]   = useState({});
  const [saving,  setSaving]  = useState(false);

  const load = () => {
    setLoading(true);
    API.get(`/admin/students/${id}`)
      .then(r => setData(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const handleApprove = async () => {
    await API.put(`/admin/enrollment/${data.enrollment._id}/approve`);
    toast.success('Enrollment approved');
    load();
  };

  const handleReject = async () => {
    await API.put(`/admin/enrollment/${data.enrollment._id}/reject`);
    toast.success('Enrollment rejected');
    load();
  };

  const handleModalSave = async () => {
    setSaving(true);
    try {
      if (modal === 'waive') {
        await API.put(`/fees/waive/${data.enrollment._id}`, { reason: mForm.reason });
        toast.success('Fee waived for this student');
      } else if (modal === 'discount') {
        await API.put(`/fees/discount/${data.enrollment._id}`, { discount: Number(mForm.discount), discountReason: mForm.reason });
        toast.success('Discount applied');
      }
      setModal(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="layout"><Sidebar /><div className="main-content loader"><div className="spinner"/></div></div>;
  if (!data)   return <div className="layout"><Sidebar /><div className="main-content"><p>Student not found</p></div></div>;

  const { user, enrollment, payments } = data;
  const statusBadge = { active: 'badge-success', pending: 'badge-warning', expired: 'badge-danger', rejected: 'badge-danger' };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/admin/students" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: 20 }}>←</Link>
            <div>
              <h1>{user.name}</h1>
              <p>{user.email} · {user.phone}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {enrollment?.status === 'pending' && (
              <>
                <button className="btn btn-success" onClick={handleApprove}>✅ Approve</button>
                <button className="btn btn-danger"  onClick={handleReject}>❌ Reject</button>
              </>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          {/* Personal info */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 14 }}>Personal Details</h3>
            {[
              ['Gender',         user.gender],
              ['Date of Birth',  user.dob ? new Date(user.dob).toLocaleDateString('en-IN') : '—'],
              ['Address',        user.address],
              ['Guardian',       user.guardianName],
              ['Guardian Phone', user.guardianPhone],
              ['Account Status', user.isActive ? '✅ Active' : '❌ Disabled'],
              ['Registered On',  new Date(user.createdAt).toLocaleDateString('en-IN')],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #f3f4f6', fontSize: 14 }}>
                <span style={{ color: '#6b7280' }}>{label}</span>
                <span style={{ fontWeight: 500, textTransform: 'capitalize', textAlign: 'right', maxWidth: '60%' }}>{val || '—'}</span>
              </div>
            ))}
          </div>

          {/* Enrollment info */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 14 }}>Enrollment Details</h3>
            {[
              ['Type',       enrollment?.type],
              ['Plan',       enrollment?.plan],
              ['Status',     enrollment?.status],
              ['Join Date',  enrollment?.joinDate ? new Date(enrollment.joinDate).toLocaleDateString('en-IN') : '—'],
              ['Fee Amount', enrollment?.feeAmount ? `₹${enrollment.feeAmount.toLocaleString()}` : '—'],
              ['Discount',   enrollment?.discount > 0 ? `${enrollment.discount}% — ${enrollment.discountReason}` : 'None'],
              ['Fee Waived', enrollment?.isWaived ? `Yes — ${enrollment.waivedReason}` : 'No'],
              ['Approved By',enrollment?.approvedBy ? 'Admin' : '—'],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #f3f4f6', fontSize: 14 }}>
                <span style={{ color: '#6b7280' }}>{label}</span>
                <span style={{ fontWeight: 500, textTransform: 'capitalize', textAlign: 'right', maxWidth: '60%' }}>{val || '—'}</span>
              </div>
            ))}

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button className="btn btn-outline btn-sm" onClick={() => { setModal('waive'); setMForm({ reason: '' }); }}>
                🎁 Waive Fee
              </button>
              <button className="btn btn-outline btn-sm" onClick={() => { setModal('discount'); setMForm({ discount: enrollment?.discount || 0, reason: enrollment?.discountReason || '' }); }}>
                🏷️ Set Discount
              </button>
            </div>
          </div>
        </div>

        {/* Payment history */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Payment History ({payments.length} records)</h3>
          {payments.length === 0 ? (
            <p style={{ color: '#9ca3af' }}>No payments recorded.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Month</th><th>Plan</th><th>Amount</th><th>Late Fee</th><th>Status</th><th>Payment ID</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p._id}>
                      <td style={{ fontWeight: 600 }}>{p.month || '—'}</td>
                      <td style={{ fontSize: 13 }}>{p.planName}</td>
                      <td style={{ fontWeight: 700 }}>₹{p.amount?.toLocaleString()}</td>
                      <td>{p.lateFeeAmount > 0 ? <span style={{ color: '#ef4444' }}>₹{p.lateFeeAmount}</span> : '—'}</td>
                      <td><span className={`badge ${p.status === 'paid' ? 'badge-success' : p.status === 'failed' ? 'badge-danger' : 'badge-warning'}`}>{p.status}</span></td>
                      <td style={{ fontSize: 12, color: '#9ca3af' }}>{p.razorpayPaymentId || '—'}</td>
                      <td style={{ fontSize: 13, color: '#9ca3af' }}>{p.paidAt ? new Date(p.paidAt).toLocaleDateString('en-IN') : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {modal && (
          <div className="modal-overlay" onClick={() => setModal(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h2>{modal === 'waive' ? '🎁 Waive Fee' : '🏷️ Apply Discount'}</h2>
              {modal === 'discount' && (
                <div className="form-group">
                  <label>Discount Percentage (%)</label>
                  <input className="form-control" type="number" min="0" max="100"
                    value={mForm.discount} onChange={e => setMForm(f => ({ ...f, discount: e.target.value }))} />
                </div>
              )}
              <div className="form-group">
                <label>Reason</label>
                <input className="form-control" placeholder={modal === 'waive' ? 'e.g. Financial hardship, scholarship' : 'e.g. Merit discount'}
                  value={mForm.reason} onChange={e => setMForm(f => ({ ...f, reason: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary" onClick={handleModalSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Confirm'}
                </button>
                <button className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
