import React, { useState, useEffect } from 'react';
import '../pages/Dashboard.css';
import axios from 'axios';

const OrderReceived = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get('http://localhost:5000/api/suppliers/orders', config);
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdatePayment = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(
        `http://localhost:5000/api/suppliers/orders/${orderId}/payment`,
        { paymentStatus: 'successful' },
        config
      );
      fetchOrders(); // Refresh the list to show the change
    } catch (error) {
      console.error("Failed to update payment status:", error);
      alert("An error occurred while updating payment status.");
    }
  };

  if (loading) {
    return <main className="main-content"><h2>Loading Orders...</h2></main>;
  }

  return (
    <main className="main-content">
      <h2>Orders Received</h2>
      
      {orders.length === 0 ? (
        <p>You have not received any orders yet.</p>
      ) : (
        <div className="orders-table received-orders-page">
          <div className="table-header">
            <span>Order ID</span>
            <span>Product</span>
            <span>Vendor</span>
            <span>Payment Status</span>
            <span>Delivery Status</span>
            <span>Actions</span>
          </div>
          {orders.map(order => (
            <div className="table-row" key={order._id}>
              <span>#{order._id.slice(-6)}</span>
              <span>{`${order.productId?.name} (${order.quantity}${order.productId?.unit})`}</span>
              <span>{order.vendorId?.name}</span>
              <span className={`status-${order.paymentStatus}`}>{order.paymentStatus}</span>
              <span className={`status-${order.deliveryStatus}`}>{order.deliveryStatus}</span>
              <td className="order-actions">
                {order.paymentStatus === 'pending' && (
                  <button 
                    className="action-button pay"
                    onClick={() => handleUpdatePayment(order._id)}
                  >
                    Mark as Paid
                  </button>
                )}
              </td>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default OrderReceived;