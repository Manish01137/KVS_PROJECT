import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const studentNav = [
  { to: '/dashboard',  icon: '🏠', label: 'Dashboard' },
  { to: '/payment',    icon: '💳', label: 'Pay Fees' },
  { to: '/attendance', icon: '📅', label: 'Attendance' },
  { to: '/notices',    icon: '📢', label: 'Notices' },
  { to: '/profile',    icon: '👤', label: 'My Profile' },
];

const adminNav = [
  { to: '/admin',             icon: '📊', label: 'Dashboard' },
  { to: '/admin/students',    icon: '👥', label: 'Students' },
  { to: '/admin/enrollments', icon: '📋', label: 'Enrollments' },
  { to: '/admin/fees',        icon: '⚙️', label: 'Fee Settings' },
  { to: '/admin/payments',    icon: '💰', label: 'Payments' },
  { to: '/admin/attendance',  icon: '📅', label: 'Attendance' },
  { to: '/admin/notices',     icon: '📢', label: 'Notices' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = user?.role === 'admin' ? adminNav : studentNav;

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="sidebar-toggle"
        onClick={() => setMobileOpen(v => !v)}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? '✕' : '☰'}
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <nav className={`sidebar ${mobileOpen ? 'open' : ''}`} aria-label="Main navigation">
        <div className="sidebar-logo">
          <h2>⚡ KVS Academy</h2>
          <p>{user?.role === 'admin' ? 'Admin Panel' : 'Student Portal'}</p>
        </div>

        <div className="sidebar-nav">
          {nav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin' || item.to === '/dashboard'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="icon" aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="sidebar-footer">
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>
            <div style={{ fontWeight: 600, color: '#fff' }}>{user?.name}</div>
            <div style={{ fontSize: 11 }}>{user?.email}</div>
          </div>
          <button className="logout-btn" onClick={handleLogout} aria-label="Logout">🚪 Logout</button>
        </div>
      </nav>
    </>
  );
}
