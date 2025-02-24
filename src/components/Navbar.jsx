import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../services/api";
import "../style/Navbar.css";
import { useGlobalState } from "../context/GlobalState";

const Navbar = () => {
  const { shopId } = useGlobalState();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!shopId) {
      setLoading(false);
      return;
    }

    const fetchShop = async () => {
      try {
        const response = await api.get(`/shops/${shopId}?fields=name`);
        setShop(response.data);
      } catch (err) {
        setError("Failed to fetch shop details.");
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [shopId]);

  return (
    <nav className="navbar">
      <div className="logo">
        <NavLink
          to={`/${shopId}`}
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          {loading
            ? "Fetching..."
            : error
            ? "Shop Not Found"
            : shop?.name || "Unnamed Shop"}
        </NavLink>
      </div>
      <ul className="nav-links">
        <li>
          <NavLink
            to={`/about/${shopId}`}
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            About Us
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Admin Panel
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
