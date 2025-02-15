import React from "react";
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

const App = () => {
  const { shopId } = useParams(); // Extract shopId from the URL
  return (
    <Router>
      <Navbar shopId={shopId} />
      <Routes>
        <Route path={`/:${shopId}`} element={<Home />} />
        <Route path={`/about/:${shopId}`} element={<AboutUs />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path={`/admin/:${shopId}`}
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
