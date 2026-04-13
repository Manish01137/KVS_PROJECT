import { useEffect, useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import API from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminAttendance() {
  const [students,  setStudents]  = useState([]);
  const [records,   setRecords]   = useState({}); // { userId: status }
  const [date,      setDate]      = useState(() => new Date().toISOString().split('T')[0]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [viewMonth, setViewMonth] = useState(() => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}`;
  });
  const [tab, setTab] = useState('mark'); // 'mark' | 'view'

  useEffect(() => {
    API.get('/admin/students?limit=200')
      .then(r => {
        setStudents(r.data.students.filter(s => s.enrollment?.status === 'active'));
        // default everyone to present
        const init = {};
        r.data.students.forEach(s => { if (s.enrollment?.status === 'active') init[s._id] = 'present'; });
        setRecords(init);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = (userId, status) => {
    setRecords(r => ({ ...r, [userId]: status }));
  };

  const markAll = (status) => {
    const updated = {};
    students.forEach(s => { updated[s._id] = status; });
    setRecords(updated);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const recordsArr = students.map(s => ({ userId: s._id, status: records[s._id] || 'absent' }));
      await API.post('/attendance/bulk', { records: recordsArr, date });
      toast.success(`Attendance marked for ${students.length} students`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark attendance');
    } finally { setSaving(false); }
  };

  const statusColor = { present: '#d1fae5', absent: '#fee2e2', leave: '#fef3c7' };
  const statusText  = { present: '#065f46', absent: '#991b1b', leave: '#92400e' };

  if (loading) return <div className="layout"><Sidebar /><div className="main-content loader"><div className="spinner"/></div></div>;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <div><h1>📅 Attendance</h1><p>Mark and view student attendance</p></div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className={`btn ${tab === 'mark' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('mark')}>Mark Attendance</button>
            <button className={`btn ${tab === 'view' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('view')}>View Records</button>
          </div>
        </div>

        {tab === 'mark' && (
          <>
            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, display: 'block' }}>Date</label>
                  <input type="date" className="form-control" style={{ width: 180 }}
                    value={date} onChange={e => setDate(e.target.value)} max={new Date().toISOString().split('T')[0]} />
                </div>
                <div style={{ marginTop: 22 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, marginRight: 8 }}>Mark all as:</span>
                  <button className="btn btn-success btn-sm" onClick={() => markAll('present')} style={{ marginRight: 6 }}>✅ Present</button>
                  <button className="btn btn-danger btn-sm" onClick={() => markAll('absent')} style={{ marginRight: 6 }}>❌ Absent</button>
                  <button className="btn btn-warning btn-sm" onClick={() => markAll('leave')}>🟡 Leave</button>
                </div>
                <div style={{ marginTop: 22, marginLeft: 'auto' }}>
                  <span style={{ fontSize: 14, color: '#6b7280' }}>
                    ✅ {Object.values(records).filter(v => v === 'present').length} present ·{' '}
                    ❌ {Object.values(records).filter(v => v === 'absent').length} absent ·{' '}
                    🟡 {Object.values(records).filter(v => v === 'leave').length} leave
                  </span>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 0 }}>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>#</th><th>Student</th><th>Type</th><th>Plan</th><th style={{ textAlign: 'center' }}>Status</th></tr>
                  </thead>
                  <tbody>
                    {students.map((s, i) => (
                      <tr key={s._id}>
                        <td style={{ color: '#9ca3af', fontSize: 13 }}>{i + 1}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{s.name}</div>
                          <div style={{ fontSize: 12, color: '#9ca3af' }}>{s.phone}</div>
                        </td>
                        <td style={{ textTransform: 'capitalize', fontSize: 14 }}>{s.enrollment?.type}</td>
                        <td style={{ textTransform: 'capitalize', fontSize: 14 }}>{s.enrollment?.plan}</td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', borderRadius: 8, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                            {['present','absent','leave'].map(st => (
                              <button key={st} onClick={() => handleStatusChange(s._id, st)}
                                style={{
                                  padding: '6px 14px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                                  background: records[s._id] === st ? statusColor[st] : '#fff',
                                  color: records[s._id] === st ? statusText[st] : '#9ca3af',
                                  transition: 'all 0.15s',
                                }}>
                                {st === 'present' ? '✅' : st === 'absent' ? '❌' : '🟡'} {st}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ padding: '16px 20px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={handleSubmit} disabled={saving || students.length === 0}>
                  {saving ? 'Saving...' : `💾 Save Attendance for ${new Date(date + 'T00:00:00').toLocaleDateString('en-IN')}`}
                </button>
              </div>
            </div>
          </>
        )}

        {tab === 'view' && (
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700 }}>Monthly Attendance Report</h3>
              <input type="month" className="form-control" style={{ width: 180, marginLeft: 'auto' }}
                value={viewMonth} onChange={e => setViewMonth(e.target.value)} />
            </div>
            <p style={{ color: '#9ca3af', fontSize: 14 }}>
              Select a student from the <a href="/admin/students" style={{ color: '#e94560' }}>Students page</a> to view their individual attendance calendar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
