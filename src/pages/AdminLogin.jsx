import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../style/AdminLogin.css";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/users/login", {
        name: username,
        password: password,
      });

      console.log("Login response:", response.data); // Debugging

      if (response.data.success) {
        const shopId = response.data.user.shop_id; // Use optional chaining to avoid errors

        if (shopId) {
          localStorage.setItem("shop_id", shopId);
          localStorage.setItem("isAdminAuthenticated", "true"); // Store login state
          console.log("Redirecting to:", `/admin/${shopId}`); // Debugging
          navigate(`/admin/${shopId}`); // Redirect to the correct route
        } else {
          console.error("No shop_id found in response:", response.data);
          setErrorMessage("Shop ID not found. Please contact support.");
        }
      } else {
        setErrorMessage("Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Admin Login</h2>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
