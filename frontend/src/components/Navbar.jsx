import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
          <span />
          <span />
          <span />
        </button>
        <div className="topbar-date">{dateStr}</div>
      </div>

      <div className="topbar-right">
        <div className="topbar-user">
          <div className="topbar-user-info">
            <div className="topbar-user-name">{user?.name}</div>
            <div className="topbar-user-role">{user?.role === 'admin' ? 'Administrator' : `ID: ${user?.studentId}`}</div>
          </div>
          <div className="avatar topbar-avatar">
            {user?.name?.[0]?.toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
