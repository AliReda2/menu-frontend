import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AboutUs from "./pages/About";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { ShopProvider, useShopId } from "./context/ShopContext";

const App = () => {
  return (
    <ShopProvider>
      <Router>
        <Routes>
          {/* Extract shopId from URL and save it in context */}
          <Route path="/:shopId" element={<NavbarWrapper />} />
          <Route path="/:shopId" element={<Home />} />
          <Route path="/about/:shopId" element={<AboutUs />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/admin/:shopId"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ShopProvider>
  );
};

// A wrapper component to extract and save shopId to context
const NavbarWrapper = () => {
  const { shopId } = useParams();
  const { setShopId } = useShopId();

  useEffect(() => {
    setShopId(shopId); // Store shopId in context
  }, [shopId, setShopId]);

  return <Navbar />;
};

export default App;
