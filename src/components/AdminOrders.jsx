import { useEffect, useState } from "react";
import axios from "axios";
import "../components/CSS/AdminOrders.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/orders/all`);
      setOrders(response.data.orders);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch orders.");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`${API_URL}/api/orders/${id}/status`, {
        status: newStatus,
      });
      const updatedOrders = orders.map((order) =>
        order._id === id ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="admin-orders-container">
      <h2>🧾 All User Orders</h2>
      {error && <p className="error-message">{error}</p>}
      {!orders.length ? (
        <p className="empty-message">No orders found.</p>
      ) : (
        orders.map((order) => {
          const billingAmount = order.items.reduce(
            (sum, item) => sum + item.qty * item.price,
            0
          );

          return (
            <div key={order._id} className="order-card">
              <p>
                <strong>User:</strong> {order.email}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">On the Way</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </p>
              <div>
                <strong>Items:</strong>
                <ul className="item-list">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.productName} × {item.qty} = ₹
                      {item.qty * item.price}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="billing-amount">
                <strong>Billing Amount:</strong> ₹{billingAmount}
              </p>
            </div>
          );
        })
      )}
    </div>
  );
}
