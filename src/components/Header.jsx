import { Link } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../App";
import "../components/CSS/Header.css";

export default function Header() {
  const { user } = useContext(AppContext);

  return (
    <div className="header">
      <h1>YUMYUM</h1>
      <nav className="nav-links">
        <Link to="/">Home</Link>

        {user?.role === "user" && (
          <>
            <Link to="/cart">My Cart</Link>
            <Link to="/orders">My Orders</Link>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <Link to="/admin">Admin</Link>
            <Link to="/admin/orders">Order History</Link>
          </>
        )}

        {user?.token ? (
          <Link to="/profile">Profile</Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </div>
  );
}
