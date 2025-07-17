import { Outlet, NavLink } from "react-router-dom";
import "../components/CSS/Admin.css";

export default function Admin() {
  return (
    <div>
      <div className="admin-navbar-wrapper">
        <nav className="admin-navbar">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Users
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Products
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Orders
          </NavLink>
        </nav>
      </div>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
