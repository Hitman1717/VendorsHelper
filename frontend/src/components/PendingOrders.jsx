import React, { useState, useEffect } from 'react';
import '../pages/Dashboard.css'; // Uses the same stylesheet
import axios from 'axios';

const PendingOrders = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetches all orders and filters for pending ones
  const fetchPendingOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get('http://localhost:5000/api/suppliers/orders', config);
      const filteredOrders = response.data.filter(order => order.deliveryStatus === 'pending');
      setPendingOrders(filteredOrders);
    } catch (error) {
      console.error("Failed to fetch pending orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  // Handles updating the order status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(
        `http://localhost:5000/api/suppliers/orders/${orderId}/status`,
        { deliveryStatus: newStatus },
        config
      );
      // Refresh the list after a successful update
      fetchPendingOrders(); 
    } catch (error) {
      // Show the specific error from the backend (e.g., "Not enough stock")
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        console.error("Failed to update order status:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  if (loading) {
    return <main className="main-content"><h2>Loading Pending Orders...</h2></main>;
  }

  return (
    <main className="main-content pending-orders-page">
      <h2>Pending Orders</h2>

      {pendingOrders.length === 0 ? (
        <p>No pending orders at the moment. Well done!</p>
      ) : (
        <div className="orders-table">
          <div className="table-header">
            <span>Order ID</span>
            <span>Product Ordered</span>
            <span>Vendor Name</span>
            <span>Cost</span>
            <span>Actions</span>
          </div>
          {pendingOrders.map(order => (
            <div className="table-row" key={order._id}>
              <span>#{order._id.slice(-6)}</span>
              <span>{`${order.productId?.name} (${order.quantity}${order.productId?.unit})`}</span>
              <span>{order.vendorId?.name}</span>
              <span>{`₹${order.totalAmount}`}</span>
              <td className="order-actions">
                <button 
                  className="action-button ship" 
                  onClick={() => handleUpdateStatus(order._id, 'shipped')}
                >
                  Mark as Shipped
                </button>
                <button 
                  className="action-button cancel"
                  onClick={() => handleUpdateStatus(order._id, 'cancelled')}
                >
                  Cancel
                </button>
              </td>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default PendingOrders;