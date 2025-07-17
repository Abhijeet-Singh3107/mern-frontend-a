import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../components/css/Order.css";

export default function Order() {
  const location = useLocation();
  const [total, setTotal] = useState(0);
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    const order = location.state?.order || [];
    setOrderItems(order);

    const totalAmount = order.reduce(
      (sum, item) => sum + item.qty * item.price,
      0
    );
    setTotal(totalAmount);
  }, [location.state]);

  return (
    <div>
      <h2>🎉 Order placed successfully!</h2>
      <p>Thank you for shopping with us.</p>

      {orderItems.length === 0 ? (
        <p>Your order is empty.</p>
      ) : (
        <>
          <h3>Your Order Summary:</h3>
          <ul>
            {orderItems.map((item) => (
              <li key={item._id}>
                {item.productName} × {item.qty} = ₹{item.qty * item.price}
              </li>
            ))}
          </ul>
          <h4>Total Billing Amount: ₹{total}</h4>
        </>
      )}
    </div>
  );
}
