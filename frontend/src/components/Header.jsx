import React, { useEffect, useState } from 'react';
import '../pages/Dashboard.css';
import axios from 'axios';

// StatCard component remains the same
const StatCard = ({ title, value, color }) => (
  <div className={`stat-card ${color}`}>
    <h2>{value}</h2>
    <p>{title}</p>
  </div>
);

const Header = () => {
  // State for all dashboard values
  const [username, setUsername] = useState('');
  const [productCount, setProductCount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        // Use Promise.all to fetch data concurrently for better performance
        const [supplierRes, productRes, orderRes] = await Promise.all([
          axios.get('http://localhost:5000/api/suppliers/me', config),
          axios.get('http://localhost:5000/api/products/myproducts', config),
          axios.get('http://localhost:5000/api/suppliers/orders', config), // ✅ Fetching orders
        ]);

        // 1. Set User and Product data
        setUsername(supplierRes.data.ownerName);
        setProductCount(productRes.data.length);

        // 2. Process Orders data
        const orders = orderRes.data;
        setTotalOrders(orders.length);

        // 3. Calculate Pending Orders
        const pending = orders.filter(order => order.deliveryStatus === 'pending');
        setPendingOrders(pending.length);

        // 4. Calculate Total Revenue from successful payments
        const revenue = orders
          .filter(order => order.paymentStatus === 'successful')
          .reduce((sum, order) => sum + order.totalAmount, 0);
        setTotalRevenue(revenue);

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []); // This effect runs once on component mount

  // Function to format the revenue into Indian Rupee currency format
  const formatRevenue = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <header className="dashboard-header">
      <h1>Welcome, {username}</h1>
      <div className="stats-container">
        <StatCard title="Total Orders Received" value={totalOrders} color="purple" />
        <StatCard title="Pending Orders" value={pendingOrders} color="green" />
        <StatCard title="Products" value={productCount} color="pink" />
        <StatCard title="Total Revenue" value={formatRevenue(totalRevenue)} color="yellow" />
      </div>
    </header>
  );
};

export default Header;