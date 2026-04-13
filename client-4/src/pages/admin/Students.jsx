import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import API from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [total,    setTotal]    = useState(0);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [page,     setPage]     = useState(1);
  const limit = 15;

  const load = useCallback(() => {
    setLoading(true);
    API.get(`/admin/students?search=${search}&page=${page}&limit=${limit}`)
      .then(r => { setStudents(r.data.students); setTotal(r.data.total); })
      .finally(() => setLoading(false));
  }, [search, page]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };

  const toggleActive = async (id, name, current) => {
    try {
      await API.put(`/admin/students/${id}/toggle`);
      toast.success(`${name} ${current ? 'deactivated' : 'activated'}`);
      load();
    } catch { toast.error('Action failed'); }
  };

  const statusBadge = { active: 'badge-success', pending: 'badge-warning', expired: 'badge-danger', rejected: 'badge-danger' };
  const pages = Math.ceil(total / limit);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <div><h1>👥 Students</h1><p>{total} students registered</p></div>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              className="form-control"
              style={{ maxWidth: 320 }}
              placeholder="🔍 Search by name, email or phone..."
              value={search}
              onChange={handleSearch}
            />
            <span style={{ fontSize: 14, color: '#9ca3af' }}>{total} results</span>
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
                    <th>#</th>
                    <th>Student</th>
                    <th>Phone</th>
                    <th>Enrollment</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Last Payment</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr><td colSpan={9} style={{ textAlign: 'center', padding: 32, color: '#9ca3af' }}>No students found</td></tr>
                  ) : students.map((s, i) => (
                    <tr key={s._id}>
                      <td style={{ color: '#9ca3af', fontSize: 13 }}>{(page - 1) * limit + i + 1}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{s.name}</div>
                        <div style={{ fontSize: 12, color: '#9ca3af' }}>{s.email}</div>
                      </td>
                      <td style={{ fontSize: 14 }}>{s.phone}</td>
                      <td style={{ textTransform: 'capitalize', fontSize: 14 }}>{s.enrollment?.type || '—'}</td>
                      <td style={{ textTransform: 'capitalize', fontSize: 14 }}>{s.enrollment?.plan || '—'}</td>
                      <td>
                        <span className={`badge ${statusBadge[s.enrollment?.status] || 'badge-gray'}`}>
                          {s.enrollment?.status || 'no enrollment'}
                        </span>
                        {!s.isActive && <span className="badge badge-danger" style={{ marginLeft: 4 }}>Disabled</span>}
                      </td>
                      <td style={{ fontSize: 13 }}>
                        {s.lastPayment
                          ? <span style={{ color: '#10b981', fontWeight: 600 }}>₹{s.lastPayment.amount?.toLocaleString()} · {s.lastPayment.month}</span>
                          : <span style={{ color: '#9ca3af' }}>No payment</span>
                        }
                      </td>
                      <td style={{ fontSize: 13, color: '#9ca3af' }}>
                        {new Date(s.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <Link to={`/admin/students/${s._id}`} className="btn btn-outline btn-sm">👁 View</Link>
                          <button
                            className={`btn btn-sm ${s.isActive ? 'btn-warning' : 'btn-success'}`}
                            onClick={() => toggleActive(s._id, s.name, s.isActive)}
                          >
                            {s.isActive ? 'Disable' : 'Enable'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div style={{ display: 'flex', gap: 8, padding: '16px 20px', justifyContent: 'center', borderTop: '1px solid #f3f4f6' }}>
              <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              {Array.from({ length: pages }).map((_, i) => (
                <button key={i} className={`btn btn-sm ${page === i+1 ? 'btn-primary' : 'btn-outline'}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
              ))}
              <button className="btn btn-outline btn-sm" disabled={page === pages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
