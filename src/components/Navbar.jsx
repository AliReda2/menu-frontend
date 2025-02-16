import React, { useEffect, useState } from "react";
import api from "../services/api";
import { NavLink, useParams } from "react-router-dom"; // Import useParams
import "../style/Navbar.css";
import { useGlobalState } from "../context/GlobalState";

const Navbar = () => {
  const [shop, setShop] = useState(null);
  const { setGlobalNumber } = useGlobalState(); // Access global state setter
  const { shopId } = useParams(); // Get shopId from URL

  // Update the global state with shopId if available
  useEffect(() => {
    if (shopId) {
      setGlobalNumber(Number(shopId)); // Store shopId in global state
    }
  }, [shopId, setGlobalNumber]);

  // Fetch shop details based on shopId
  useEffect(() => {
    const fetchShop = async () => {
      if (!shopId) return; // Prevent fetch if shopId is undefined

      try {
        const response = await api.get(`/shops/${shopId}`);
        setShop(response.data.shop);
      } catch (error) {
        console.error("Error fetching shop:", error);
      }
    };

    fetchShop();
  }, [shopId]); // Re-fetch when shopId changes

  if (!shopId) return null; // If no shopId in URL, return nothing or handle accordingly

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
            to={`/about/${shopId}`} // Include shopId in the About Us link
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
