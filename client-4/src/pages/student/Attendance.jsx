import { useEffect, useState } from 'react';
import Sidebar from '../../components/common/Sidebar';
import API from '../../utils/api';
import PaymentWall from '../../components/student/PaymentWall';

export function StudentAttendance() {
  const [data, setData]   = useState({ records: [], summary: { present: 0, absent: 0, leave: 0, total: 0 } });
  const [month, setMonth] = useState(() => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    API.get(`/attendance/my?month=${month}`)
      .then(r => setData(r.data))
      .catch(() => setData({ records: [], summary: { present: 0, absent: 0, leave: 0, total: 0 } }));
  }, [month]);

  const getDaysInMonth = (m) => {
    const [y, mo] = m.split('-');
    return new Date(y, mo, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(month);
  const recordMap = {};
  data.records.forEach(r => {
    const d = new Date(r.date).getDate();
    recordMap[d] = r.status;
  });

  const colorClass = { present: 'att-present', absent: 'att-absent', leave: 'att-leave' };
  const pct = data.summary.total > 0 ? Math.round((data.summary.present / data.summary.total) * 100) : 0;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <div><h1>📅 Attendance</h1><p>Track your training attendance</p></div>
          <input type="month" className="form-control" style={{ width: 180 }} aria-label="Select month"
            value={month} onChange={e => setMonth(e.target.value)} />
        </div>

        <div className="stat-grid" style={{ marginBottom: 24 }}>
          {[
            { label: 'Present', value: data.summary.present || 0, icon: '✅', color: '#d1fae5' },
            { label: 'Absent',  value: data.summary.absent  || 0, icon: '❌', color: '#fee2e2' },
            { label: 'Leave',   value: data.summary.leave   || 0, icon: '🟡', color: '#fef3c7' },
            { label: 'Attendance %', value: `${pct}%`, icon: '📊', color: pct >= 75 ? '#d1fae5' : '#fee2e2' },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ background: s.color }}>
              <span className="stat-icon">{s.icon}</span>
              <span className="stat-label">{s.label}</span>
              <span className="stat-value">{s.value}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>
            {new Date(month + '-02').toLocaleString('en-IN', { month: 'long', year: 'numeric' })} Calendar
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 12 }}>
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#9ca3af', padding: '6px 0' }}>{d}</div>
            ))}
          </div>

          <div className="att-calendar">
            {Array.from({ length: new Date(month + '-01').getDay() }).map((_, i) => (
              <div key={'empty-' + i} className="att-day att-none" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const status = recordMap[day];
              return (
                <div key={day} className={`att-day ${status ? colorClass[status] : 'att-none'}`} title={status || 'Not marked'}>
                  {day}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
            {[['att-present','Present'],['att-absent','Absent'],['att-leave','Leave'],['att-none','Not marked']].map(([cls, label]) => (
              <div key={cls} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div className={`att-day ${cls}`} style={{ width: 20, height: 20, borderRadius: 4, fontSize: 0 }} />
                <span style={{ fontSize: 13, color: '#6b7280' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrapped export with PaymentWall
const WrappedAttendance = () => <PaymentWall><StudentAttendance /></PaymentWall>;
export default WrappedAttendance;
