import React from 'react';
import { Outlet } from 'react-router-dom'; // We only need Outlet here
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import "./Dashboard.css"; // Make sure this path is correct

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Header />
        {/* The active page component will render here */}
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;