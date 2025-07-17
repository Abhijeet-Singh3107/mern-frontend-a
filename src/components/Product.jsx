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
      console.log(err);
      setError("Something went wrong");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const found = cart.find((item) => item._id === product._id);
    if (!found) {
      product.qty = 1;
      setCart([...cart, product]);
    }

    setClickedId(product._id);
    setTimeout(() => setClickedId(null), 200);
  };

  return (
    <div className="product-page-container">
      <h2>🛍️ All Products</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="product-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            {/* <img src={`${API_URL}/${product.imgUrl}`} alt={product.productName} /> */}
            <img src={`/${product.imgUrl}`} alt={product.productName} />
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

      <div className="cart-btn-container">
        <button onClick={() => navigate("/cart")} className="cart-btn">
          🛒 Go to Cart ({cart.length})
        </button>
      </div>
    </div>
  );
}
