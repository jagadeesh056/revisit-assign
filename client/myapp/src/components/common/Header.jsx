import React from 'react';
import '../../styles/common.css';

function Header({ onLogout }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  return (
    <header className="header">
      <div className="search-container">
        <i className="search-icon"></i>
        <input type="text" placeholder="Search..." className="search-input" />
      </div>
      
      <div className="header-actions">
        <button className="icon-button">
          <i className="notification-icon"></i>
        </button>
        
        <div className="user-profile">
          <div className="avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="dropdown">
            <span className="user-name">{user.name || 'User'}</span>
            <i className="dropdown-icon"></i>
            <div className="dropdown-menu">
              <button onClick={onLogout}>Logout</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;