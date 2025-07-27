import React from 'react';
import '../pages/Dashboard.css';

const StatCard = ({ title, value, color }) => (
  <div className={`stat-card ${color}`}>
    <h2>{value}</h2>
    <p>{title}</p>
  </div>
);

const Header = () => {
  return (
    <header className="dashboard-header">
      <h1>Welcome User</h1>
      <div className="stats-container">
        <StatCard title="Total Orders Received" value="120" color="purple" />
        <StatCard title="Pending Orders" value="8" color="green" />
        <StatCard title="Products" value="15" color="pink" />
        <StatCard title="Avg Revenue" value="₹25,000" color="yellow" />
      </div>
    </header>
  );
};

export default Header;