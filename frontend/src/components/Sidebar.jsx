import React from 'react';
// 1. Import NavLink instead of Link for the active class styling
import { NavLink } from 'react-router-dom';
import { FiHome, FiPackage, FiShoppingCart, FiLogOut } from 'react-icons/fi';
import { MdMoveToInbox } from 'react-icons/md';
import '../pages/Dashboard.css';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <ul>
        {/* 2. Replace <a> tags with NavLink and href with the 'to' prop */}
        <li><NavLink to="/dashboard" end title="Home"><FiHome /></NavLink></li>
        <li><NavLink to="/dashboard/orders-received" title="Orders Received"><FiPackage /></NavLink></li>
        <li><NavLink to="/dashboard/pending-orders" title="Pending Orders"><MdMoveToInbox /></NavLink></li>
        <li><NavLink to="/dashboard/products" title="Items"><FiShoppingCart /></NavLink></li>
        <li><NavLink to="/" title="Logout"><FiLogOut /></NavLink></li> {/* Logout can remain a simple link or be a button */}
      </ul>
    </nav>
  );
};

export default Sidebar;