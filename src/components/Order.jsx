import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../components/CSS/Order.css";

export default function Order() {
  const location = useLocation();
  const [total, setTotal] = useState(0);
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    const order = location.state?.order || [];

    const filteredOrder = order.filter((item) => item.qty > 0);
    setOrderItems(filteredOrder);

    const totalAmount = filteredOrder.reduce(
      (sum, item) => sum + item.qty * item.price,
      0
    );
    setTotal(totalAmount);
  }, [location.state]);

  return (
    <div className="order-container">
      <h2>🎉 Order Placed Successfully!</h2>
      <p>Thank you for shopping with us.</p>

      {orderItems.length === 0 ? (
        <p>Your order is empty.</p>
      ) : (
        <>
          <h3>Your Order Summary:</h3>
          <ul className="order-list">
            {orderItems.map((item) => (
              <li key={item._id}>
                <span>
                  {item.productName} × {item.qty}
                </span>
                <span>₹{item.qty * item.price}</span>
              </li>
            ))}
          </ul>
          <div className="order-total">Total Billing Amount: ₹{total}</div>
        </>
      )}
    </div>
  );
}
