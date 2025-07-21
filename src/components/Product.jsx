import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";
import "../components/CSS/Product.css";

export default function Product() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const { cart, setCart } = useContext(AppContext);
  const navigate = useNavigate();
  const [clickedId, setClickedId] = useState(null);

  const fetchProducts = async () => {
    try {
      const result = await axios.get(`${API_URL}/api/products/all`);
      setProducts(result.data.products);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const found = cart.find((item) => item._id === product._id);

    if (!found) {
      const newProduct = { ...product, qty: 1 };
      setCart([...cart, newProduct]);
    } else {
      const updatedCart = cart.map((item) =>
        item._id === product._id ? { ...item, qty: item.qty + 1 } : item
      );
      setCart(updatedCart);
    }

    setClickedId(product._id);
    setTimeout(() => setClickedId(null), 200);
  };

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="product-page-container">
      {error && <p className="error-message">{error}</p>}
      <div className="cart-btn-container">
        <button onClick={() => navigate("/cart")} className="cart-btn">
          🛒 Go to Cart ({totalQty})
        </button>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <img
              src={
                product.imgUrl.startsWith("http")
                  ? product.imgUrl
                  : `/images/${product.imgUrl.replace(/^.*[\\/]/, "")}`
              }
              alt={product.productName}
            />
            <h3>{product.productName}</h3>
            <p>{product.description}</p>
            <h4>₹{product.price}</h4>
            <button
              onClick={() => addToCart(product)}
              className={clickedId === product._id ? "clicked" : ""}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
