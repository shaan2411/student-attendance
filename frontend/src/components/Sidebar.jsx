import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Sidebar.css';

const adminLinks = [
  { to: '/admin',           icon: '⊞', label: 'Dashboard' },
  { to: '/admin/students',  icon: '👥', label: 'Students' },
  { to: '/admin/mark',      icon: '✓',  label: 'Mark Attendance' },
  { to: '/admin/attendance',icon: '📊', label: 'Attendance Report' },
];

const studentLinks = [
  { to: '/student',         icon: '⊞', label: 'Dashboard' },
  { to: '/student/attendance', icon: '📋', label: 'My Attendance' },
];

const Sidebar = ({ mobileOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <>
      {mobileOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar${mobileOpen ? ' sidebar-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">🎓</div>
          <div>
            <div className="logo-name">EduTrack</div>
            <div className="logo-sub">Attendance System</div>
          </div>
        </div>

        <div className="sidebar-divider" />

        {/* User Info */}
        <div className="sidebar-user">
          <div className="avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name}</div>
            <div className={`badge badge-${user?.role}`}>{user?.role}</div>
          </div>
        </div>

        <div className="sidebar-divider" />

        {/* Nav Links */}
        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin' || link.to === '/student'}
              className={({ isActive }) =>
                `sidebar-link${isActive ? ' sidebar-link-active' : ''}`
              }
              onClick={onClose}
            >
              <span className="sidebar-link-icon">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={handleLogout}>
            <span>⇠</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
