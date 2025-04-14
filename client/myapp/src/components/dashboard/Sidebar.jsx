import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/sidebar.css';

function Sidebar() {
  
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="logo">fastcart</h2>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/dashboard" end className={({ isActive }) => isActive ? '' : 'active'}>
              <i className="icon dashboard-icon"></i>
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="#" className="inactive">
              <i className="icon orders-icon"></i>
              <span>Orders</span>
              <span className="badge">18</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="#" className="inactive">
              <i className="icon products-icon"></i>
              <span>Products</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/categories" className={({ isActive }) => isActive ? '' : 'active'}>
              <i className="icon categories-icon"></i>
              <span>Categories</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="#" className="inactive">
              <i className="icon customers-icon"></i>
              <span>Customers</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;