import React from 'react';
import '../pages/Dashboard.css';

const ordersData = [
  { id: '001', product: 'Kaju (10kg)', cost: '₹8,000', payment: 'Cash on delivery' },
  { id: '002', product: 'Badam (5kg)', cost: '₹10,000', payment: 'Upi' },
  // Add more orders here
];

const OrderReceived = () => {
  return (
    <main className="main-content">
      <h2>Orders Received</h2>
      <div className="orders-table">
        <div className="table-header">
          <span>Order Id</span>
          <span>Product Ordered</span>
          <span>Product Cost</span>
          <span>Mode of Payment</span>
        </div>
        {ordersData.map(order => (
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

export default OrderReceived;