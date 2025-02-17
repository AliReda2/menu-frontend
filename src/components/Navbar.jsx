import React, { useEffect, useState } from "react";
import api from "../services/api";
import { NavLink } from "react-router-dom"; // Import useParams
import "../style/Navbar.css";
import { useGlobalState } from "../context/GlobalState";

const Navbar = () => {
  const { shopId } = useGlobalState();
  console.log("Navbar shopId:", shopId);
  const [shop, setShop] = useState(null);

  // Fetch shop details based on shopId
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await api.get(`/shops/${shopId}`);
        setShop(response.data.shop);
      } catch (error) {
        console.error("Error fetching shop:", error);
      }
    };

    fetchShop();
  }, [shopId]); // Re-fetch when shopId changes

  return (
    <nav className="navbar">
      <div className="logo">{shop ? shop.name : "Loading..."}</div>
      <ul className="nav-links">
        <li>
          <NavLink
            to={`/${shopId}`} // This ensures the current shopId is included in the URL
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/about`} // Include shopId in the About Us link
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            About Us
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin-login" // This doesn't need shopId in the URL
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
