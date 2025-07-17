import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../App";
import "../components/css/Orders.css";

export default function Orders() {
  const { user } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [totalBilling, setTotalBilling] = useState(0);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/orders`, {
          params: { email: user?.email },
        });

        const allOrders = response.data.orders || [];
        setOrders(allOrders);

        const total = allOrders.reduce((sum, order) => {
          return (
            sum +
            order.items.reduce(
              (orderSum, item) => orderSum + item.qty * item.price,
              0
            )
          );
        }, 0);
        setTotalBilling(total);
      } catch (err) {
        console.error("Error fetching orders", err);
        setError("Something went wrong while fetching orders");
      }
    };

    if (user?.email) {
      fetchOrders();
    }
  }, [user]);

  return (
    <div className="orders-container">
      <h2>🧾 Order History</h2>
      {error && <p className="error-message">{error}</p>}
      {!orders.length ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <>
          {orders.map((order, index) => {
            const orderTotal = order.items.reduce(
              (sum, item) => sum + item.qty * item.price,
              0
            );
            return (
              <div key={index} className="order-card">
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                <ul>
                  {order.items.map((item) => (
                    <li key={item._id}>
                      <span>
                        {item.productName} × {item.qty}
                      </span>
                      <span>₹{item.qty * item.price}</span>
                    </li>
                  ))}
                </ul>
                <p className="order-total">
                  <strong>Order Total:</strong> ₹{orderTotal}
                </p>
              </div>
            );
          })}
          <h3 className="total-billing">
            Total Billing Across All Orders: ₹{totalBilling}
          </h3>
        </>
      )}
    </div>
  );
}
