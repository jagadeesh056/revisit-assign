import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from '../common/Header';
import Categories from '../categories/Categories';
import '../../styles/dashboard.css';

function Dashboard({ onLogout }) {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <Header onLogout={onLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<div className="dashboard-welcome">Welcome to your Dashboard</div>} />
            <Route path="/categories" element={<Categories />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;