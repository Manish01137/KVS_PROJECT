import { useEffect, useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import API from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminFees() {
  const [fees,    setFees]    = useState([]);
  const [history, setHistory] = useState([]);
  const [editing, setEditing] = useState(null); // fee id being edited
  const [form,    setForm]    = useState({});
  const [saving,  setSaving]  = useState(false);
  const [tab,     setTab]     = useState('fees'); // 'fees' | 'history'

  useEffect(() => {
    loadFees();
    loadHistory();
  }, []);

  const loadFees    = () => API.get('/fees').then(r => setFees(r.data));
  const loadHistory = () => API.get('/fees/history').then(r => setHistory(r.data));

  const startEdit = (fee) => {
    setEditing(fee._id);
    setForm({
      amount:        fee.amount,
      lateFee:       fee.lateFee,
      dueDayOfMonth: fee.dueDayOfMonth,
      description:   fee.description,
      isActive:      fee.isActive,
      reason:        '',
    });
  };

  const handleSave = async (id) => {
    setSaving(true);
    try {
      await API.put(`/fees/${id}`, form);
      toast.success('Fee updated successfully');
      setEditing(null);
      loadFees();
      loadHistory();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  const categoryColor = { kabaddi: 'badge-info', gym: 'badge-success', combo: 'badge-warning' };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <div>
            <h1>⚙️ Fee Settings</h1>
            <p>Manage all fee plans — changes apply to next billing cycle</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className={`btn ${tab === 'fees' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('fees')}>Fee Plans</button>
            <button className={`btn ${tab === 'history' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('history')}>Change History</button>
          </div>
        </div>

        {tab === 'fees' && (
          <>
            <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 10, padding: '12px 18px', marginBottom: 20, fontSize: 14, color: '#92400e' }}>
              ⚠️ Fee changes take effect from the <strong>next payment</strong>. Students who already paid this month are not affected.
            </div>

            <div style={{ display: 'grid', gap: 16 }}>
              {fees.map(fee => (
                <div key={fee._id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ padding: '16px 22px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{fee.displayName}</div>
                        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                          <span className={`badge ${categoryColor[fee.category] || 'badge-gray'}`}>{fee.category}</span>
                          <span className="badge badge-gray">{fee.type}</span>
                          {!fee.isActive && <span className="badge badge-danger">Inactive</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 24, fontWeight: 800 }}>₹{fee.amount?.toLocaleString()}</div>
                        <div style={{ fontSize: 12, color: '#9ca3af' }}>Late fee: ₹{fee.lateFee} · Due: {fee.dueDayOfMonth}th</div>
                      </div>
                      {editing === fee._id
                        ? <button className="btn btn-outline btn-sm" onClick={() => setEditing(null)}>Cancel</button>
                        : <button className="btn btn-secondary btn-sm" onClick={() => startEdit(fee)}>✏️ Edit</button>
                      }
                    </div>
                  </div>

                  {editing === fee._id && (
                    <div style={{ padding: '20px 22px', background: '#fafbff' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 14 }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label>Fee Amount (₹) *</label>
                          <input className="form-control" type="number" min="0"
                            value={form.amount} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))} />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label>Late Fee (₹)</label>
                          <input className="form-control" type="number" min="0"
                            value={form.lateFee} onChange={e => setForm(f => ({ ...f, lateFee: Number(e.target.value) }))} />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label>Due Day of Month</label>
                          <input className="form-control" type="number" min="1" max="28"
                            value={form.dueDayOfMonth} onChange={e => setForm(f => ({ ...f, dueDayOfMonth: Number(e.target.value) }))} />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label>Status</label>
                          <select className="form-control" value={form.isActive}
                            onChange={e => setForm(f => ({ ...f, isActive: e.target.value === 'true' }))}>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group" style={{ marginBottom: 14 }}>
                        <label>Description</label>
                        <input className="form-control" value={form.description}
                          onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                      </div>
                      <div className="form-group" style={{ marginBottom: 14 }}>
                        <label>Reason for change (optional — saved in history)</label>
                        <input className="form-control" placeholder="e.g. Annual revision, inflation adjustment..."
                          value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} />
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-primary" onClick={() => handleSave(fee._id)} disabled={saving}>
                          {saving ? 'Saving...' : '💾 Save Changes'}
                        </button>
                        <button className="btn btn-outline" onClick={() => setEditing(null)}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'history' && (
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Fee Change History</h3>
            {history.length === 0 ? (
              <p style={{ color: '#9ca3af' }}>No fee changes recorded yet.</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Plan</th><th>Old Amount</th><th>New Amount</th>
                      <th>Changed By</th><th>Reason</th><th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map(h => (
                      <tr key={h._id}>
                        <td style={{ fontWeight: 600 }}>{h.planName}</td>
                        <td style={{ color: '#ef4444', textDecoration: 'line-through' }}>₹{h.oldAmount?.toLocaleString()}</td>
                        <td style={{ color: '#10b981', fontWeight: 700 }}>₹{h.newAmount?.toLocaleString()}</td>
                        <td>{h.changedBy?.name || '—'}</td>
                        <td style={{ color: '#6b7280', fontSize: 13 }}>{h.reason || '—'}</td>
                        <td style={{ fontSize: 13, color: '#9ca3af' }}>{new Date(h.createdAt).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
