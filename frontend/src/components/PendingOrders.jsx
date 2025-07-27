import React from 'react';
import '../pages/Dashboard.css'; // Uses the same stylesheet

// Dummy data based on your design
const pendingOrdersData = [
  { id: '001', product: 'Walnuts (5kg)', cost: '₹1,725', payment: 'Card' },
  { id: '002', product: 'Pista (5kg)', cost: '₹13,200', payment: 'Cash on delivery' },
  // You can add more pending orders here
];

const PendingOrders = () => {
  return (
    // We add a specific class here to style the table with the correct color
    <main className="main-content pending-orders-page">
      <h2>Pending Orders</h2>
      <div className="orders-table">
        <div className="table-header">
          <span>Order Id</span>
          <span>Product Ordered</span>
          <span>Product Cost</span>
          <span>Mode of Payment</span>
        </div>
        {pendingOrdersData.map(order => (
          <div className="table-row" key={order.id}>
            <span>{order.id}</span>
            <span>{order.product}</span>
            <span>{order.cost}</span>
            <span>{order.payment}</span>
          </div>
        ))}
      </div>
    </main>
  );
};

export default PendingOrders;