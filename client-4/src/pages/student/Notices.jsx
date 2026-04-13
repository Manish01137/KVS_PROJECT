import { useEffect, useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import API from '../../utils/api';
import PaymentWall from '../../components/student/PaymentWall';

function StudentNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/notices')
      .then(r => setNotices(r.data))
      .catch(() => setNotices([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="layout"><Sidebar /><div className="main-content loader"><div className="spinner" /></div></div>;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header"><div><h1>📢 Notices</h1><p>Academy announcements</p></div></div>
        {notices.length === 0
          ? <div className="card" style={{ textAlign: 'center', color: '#9ca3af', padding: 40 }}>No notices yet.</div>
          : notices.map(n => (
            <div key={n._id} className={`notice-card ${n.priority === 'urgent' ? 'urgent' : ''}`}>
              <div className="notice-title">{n.priority === 'urgent' && '🚨 '}{n.title}</div>
              <div className="notice-meta">
                <span className={`badge ${n.priority === 'urgent' ? 'badge-danger' : 'badge-info'}`}>{n.priority}</span>
                {' · '}{n.createdBy?.name}{' · '}{new Date(n.createdAt).toLocaleDateString('en-IN')}
              </div>
              <div className="notice-body">{n.message}</div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

const WrappedNotices = () => <PaymentWall><StudentNotices /></PaymentWall>;
export default WrappedNotices;
