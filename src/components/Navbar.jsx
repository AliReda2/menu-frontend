import React, {useEffect, useState} from "react";
import api from "../services/api";
import { NavLink } from "react-router-dom";
import "../style/Navbar.css";

const Navbar = () => {
  const [shop, setShop] = useState("");

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await api.get("/shops/3");
        setShop(response.data.shop);
        // console.log("Fetched shop:", response.data);

        // console.log("Fetched categories:", response.data.shop.categories);
      } catch (error) {
        console.error("Error fetching shop:", error);
      }
    };

    fetchShop();
  }, []);
  return (
    <nav className="navbar">
      <div className="logo">{shop.name}</div>
      <ul className="nav-links">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            About Us
          </NavLink>
        </li>
        {/* <li>
          <NavLink
            to="/feedback"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Feedback
          </NavLink>
        </li> */}
        <li>
          <NavLink
            to="/admin-login"
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
