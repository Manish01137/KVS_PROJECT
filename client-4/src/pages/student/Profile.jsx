import { useEffect, useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import PaymentWall from '../../components/student/PaymentWall';

function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({});
  const [saving, setSaving]   = useState(false);
  const [errors, setErrors]   = useState({});

  useEffect(() => {
    API.get('/students/me/profile').then(r => {
      setProfile(r.data);
      setForm(r.data.user);
    });
  }, []);

  const validate = () => {
    const errs = {};
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) errs.phone = 'Invalid phone number';
    if (form.guardianPhone && !/^[6-9]\d{9}$/.test(form.guardianPhone)) errs.guardianPhone = 'Invalid phone number';
    if (form.name && form.name.trim().length < 2) errs.name = 'Name too short';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await API.put('/auth/profile', form);
      setProfile(p => ({ ...p, user: { ...p.user, ...form } }));
      setEditing(false);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally { setSaving(false); }
  };

  if (!profile) return <div className="layout"><Sidebar /><div className="main-content loader"><div className="spinner" /></div></div>;
  const { user, enrollment } = profile;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <div><h1>👤 My Profile</h1><p>Your personal details</p></div>
          {!editing
            ? <button className="btn btn-outline" onClick={() => setEditing(true)}>✏️ Edit</button>
            : <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                <button className="btn btn-outline" onClick={() => { setEditing(false); setForm(user); setErrors({}); }}>Cancel</button>
              </div>
          }
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Personal Info</h3>
            {[
              ['Name', 'name'], ['Email', 'email'], ['Phone', 'phone'], ['Address', 'address'],
              ['Guardian', 'guardianName'], ['Guardian Phone', 'guardianPhone'],
            ].map(([label, key]) => (
              <div key={key} className="form-group">
                <label>{label}</label>
                {editing && key !== 'email' ? (
                  <>
                    <input className="form-control" value={form[key] || ''} aria-label={label}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                    {errors[key] && <span style={{ color: '#ef4444', fontSize: 12 }}>{errors[key]}</span>}
                  </>
                ) : (
                  <div style={{ padding: '10px 14px', background: '#f9fafb', borderRadius: 8, fontSize: 14 }}>{user[key] || '—'}</div>
                )}
              </div>
            ))}
          </div>

          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Enrollment Details</h3>
            {[
              ['Type', enrollment?.type],
              ['Plan', enrollment?.plan],
              ['Status', enrollment?.status],
              ['Join Date', enrollment?.joinDate ? new Date(enrollment.joinDate).toLocaleDateString('en-IN') : '—'],
              ['Monthly Fee', enrollment?.feeAmount ? `₹${enrollment.feeAmount.toLocaleString()}` : '—'],
              ['Discount', enrollment?.discount > 0 ? `${enrollment.discount}%` : 'None'],
              ['Fee Waived', enrollment?.isWaived ? `Yes${enrollment.waivedReason ? ` — ${enrollment.waivedReason}` : ''}` : 'No'],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ fontSize: 14, color: '#6b7280' }}>{label}</span>
                <span style={{ fontSize: 14, fontWeight: 500, textTransform: 'capitalize' }}>{val || '—'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const WrappedProfile = () => <PaymentWall><StudentProfile /></PaymentWall>;
export default WrappedProfile;
