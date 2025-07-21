import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import axios from "axios";
import "../components/CSS/Cart.css";

export default function Cart() {
  const { user, cart, setCart } = useContext(AppContext);
  const [orderValue, setOrderValue] = useState(0);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const increment = (id, qty) => {
    const updatedCart = cart.map((product) =>
      product._id === id ? { ...product, qty: qty + 1 } : product
    );
    setCart(updatedCart);
  };

  const decrement = (id, qty) => {
    const updatedCart = cart.map((product) =>
      product._id === id ? { ...product, qty: Math.max(qty - 1, 0) } : product
    );
    setCart(updatedCart);
  };

  const handlePlaceOrder = async () => {
    try {
      const order = {
        email: user?.email,
        items: cart,
      };

      const result = await axios.post(`${API_URL}/api/orders`, order);
      console.log("Order stored:", result.data);

      navigate("/order", { state: { order: cart } });
      setCart([]);
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Failed to place order.");
    }
  };

  useEffect(() => {
    setOrderValue(
      cart.reduce((sum, value) => sum + value.qty * value.price, 0)
    );
  }, [cart]);

  return (
    <div className="cart-container">
      <h2 className="cart-title">My Cart</h2>

      {cart &&
        cart.map(
          (value) =>
            value.qty > 0 && (
              <div className="cart-item" key={value._id}>
                <div className="cart-details">
                  <div className="cart-product-name">{value.productName}</div>
                  <div className="cart-price">₹{value.price} per item</div>
                  <div className="cart-price">
                    Subtotal: ₹{value.price * value.qty}
                  </div>
                </div>
                <div className="cart-qty-controls">
                  <button onClick={() => decrement(value._id, value.qty)}>
                    -
                  </button>
                  <span>{value.qty}</span>
                  <button onClick={() => increment(value._id, value.qty)}>
                    +
                  </button>
                </div>
              </div>
            )
        )}

      <div className="cart-total">Total: ₹{orderValue}</div>

      {cart.length === 0 || cart.every((item) => item.qty === 0) ? (
        <div>
          <p className="empty-cart-msg">🛒 Cart is empty</p>
          <button
            className="cart-button cont-shopping-button"
            onClick={() => navigate("/")}
          >
            Continue Shopping...
          </button>
        </div>
      ) : (
        <div className="cart-buttons">
          {user?.token ? (
            <button className="cart-button" onClick={handlePlaceOrder}>
              Place Order
            </button>
          ) : (
            <button className="cart-button" onClick={() => navigate("/login")}>
              Login to Order
            </button>
          )}
          <button
            className="cart-button cont-shopping-button"
            onClick={() => navigate("/")}
          >
            Continue Shopping...
          </button>
        </div>
      )}
    </div>
  );
}
