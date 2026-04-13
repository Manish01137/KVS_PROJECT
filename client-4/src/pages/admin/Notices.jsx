import { useEffect, useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import API from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminNotices() {
  const [notices,  setNotices]  = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState({ title: '', message: '', target: 'all', priority: 'normal', expiresAt: '' });
  const [saving,   setSaving]   = useState(false);

  const load = () => API.get('/notices').then(r => setNotices(r.data));
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.post('/notices', form);
      toast.success('Notice published');
      setShowForm(false);
      setForm({ title: '', message: '', target: 'all', priority: 'normal', expiresAt: '' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create notice');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    await API.delete(`/notices/${id}`);
    toast.success('Notice deleted');
    load();
  };

  const targetLabel = { all: '📢 All Students', kabaddi: '🏃 Kabaddi Only', gym: '🏋️ Gym Only', admin: '🔒 Admin Only' };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <div><h1>📢 Notices</h1><p>Post announcements to students</p></div>
          <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
            {showForm ? '✕ Cancel' : '+ New Notice'}
          </button>
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: 24, border: '2px solid #e94560' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Create New Notice</h3>
            <form onSubmit={handleCreate}>
              <div className="form-row">
                <div className="form-group">
                  <label>Title *</label>
                  <input className="form-control" placeholder="Notice title" required
                    value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Target Audience</label>
                  <select className="form-control" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))}>
                    <option value="all">All Students</option>
                    <option value="kabaddi">Kabaddi Only</option>
                    <option value="gym">Gym Only</option>
                    <option value="admin">Admin Only</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Message *</label>
                <textarea className="form-control" rows={4} placeholder="Write the notice content here..." required
                  value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  style={{ resize: 'vertical' }} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select className="form-control" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                    <option value="normal">Normal</option>
                    <option value="urgent">🚨 Urgent</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Expires On (optional)</label>
                  <input type="date" className="form-control"
                    value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? 'Publishing...' : '📢 Publish Notice'}
              </button>
            </form>
          </div>
        )}

        {notices.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
            No notices yet. Create your first notice above.
          </div>
        ) : notices.map(n => (
          <div key={n._id} className={`notice-card ${n.priority === 'urgent' ? 'urgent' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div className="notice-title">{n.priority === 'urgent' && '🚨 '}{n.title}</div>
                <div className="notice-meta" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                  <span className={`badge ${n.priority === 'urgent' ? 'badge-danger' : 'badge-info'}`}>{n.priority}</span>
                  <span className="badge badge-gray">{targetLabel[n.target] || n.target}</span>
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>By {n.createdBy?.name} · {new Date(n.createdAt).toLocaleDateString('en-IN')}</span>
                  {n.expiresAt && <span style={{ fontSize: 12, color: '#f59e0b' }}>Expires: {new Date(n.expiresAt).toLocaleDateString('en-IN')}</span>}
                </div>
                <div className="notice-body">{n.message}</div>
              </div>
              <button className="btn btn-danger btn-sm" style={{ marginLeft: 12, flexShrink: 0 }}
                onClick={() => handleDelete(n._id)}>🗑 Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
