import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // adjust path if needed

// Import all your pages here
import Home from "./components/Home";
import Buyer_signin from "./components/Buyer_signin";
import Buyer_signup from "./components/Buyer_signup";
import RegisterRestaurant from "./components/RegisterRestaurant";
import YourRestaurantAuth from "./components/YourRestaurantAuth";
import YourRestaurant from "./components/YourRestaurant";
import Cart from "./components/Cart";
import Order from "./components/Order";
import Ordered from "./components/Ordered";

function App() {
  return (
    <Router>
      {/* Navbar always visible */}
      <Navbar/>

      {/* Main content */}
      <div className="pt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/buyer-signin" element={<Buyer_signin />} />
          <Route path="/buyer-signup" element={<Buyer_signup />} />
          <Route path="/register-restaurant" element={<RegisterRestaurant />} />
          <Route path="/your-restaurant-auth" element={<YourRestaurantAuth />} />
          <Route path="/your-restaurant" element={<YourRestaurant />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<Order />} />
          <Route path="/ordered" element={<Ordered />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
