import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Import all your pages here
import Home from "./components/Home";
import Buyer_signin from "./components/Buyer_signin";
import Buyer_signup from "./components/Buyer_signup";
import RegisterRestaurant from "./components/RegisterRestaurant";
import VerifyOtp from "./components/VerifyOtp";
import YourRestaurantAuth from "./components/YourRestaurantAuth";
import YourRestaurant from "./components/YourRestaurant";
import Cart from "./components/Cart";
import Order from "./components/Order";
import RestaurantOrders from "./components/RestaurantOrders";
import Delivered from "./components/Delivered";

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <div className="flex-grow-1">
          {/* Main content */}
          <div className="">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Home" element={<Home />} />
              <Route path="/buyer-signin" element={<Buyer_signin />} />
              <Route path="/buyer-signup" element={<Buyer_signup />} />
              <Route path="/register-restaurant" element={<RegisterRestaurant />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
              <Route path="/your-restaurant-auth" element={<YourRestaurantAuth />} />
              <Route path="/your-restaurant" element={<YourRestaurant />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order" element={<Order />} />
              <Route path="/restaurant-orders" element={<RestaurantOrders />} />
              <Route path="/delivered" element={<Delivered />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
