import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/menu");
        setMenuItems(res.data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        alert("Failed to fetch menu items.");
      }
    };
    fetchMenuItems();
  }, []);

  const buyer = JSON.parse(localStorage.getItem('buyer'));
const cartKey = buyer ? `cartItems_${buyer.email}` : 'cartItems_guest';

const handleAddToCart = (item) => {
  if (!buyer) {
    alert("Please sign in or sign up to add items to your cart.");
    return; // This prevents adding the item if not signed in
  }
  const stored = localStorage.getItem(cartKey);
  const cartItems = stored ? JSON.parse(stored) : [];
  cartItems.push(item);
  localStorage.setItem(cartKey, JSON.stringify(cartItems));
  alert("Item added to cart!");
};

  return (
    <div className="container py-5">
      <h2 className="text-center text-danger mb-4">🍴 Explore Delicious Menus 🍴</h2>
      <p className="text-center text-muted mb-2">
        Discover mouth-watering dishes from the best restaurants in town. Let your cravings guide you!
      </p>
      <p className="text-center text-success mb-4" style={{ fontWeight: 500, fontSize: "1.1rem" }}>
        💸 Enjoy hassle-free <span style={{ color: "#ff9800" }}>Cash on Delivery</span> on every order!
      </p>
      {/* Search Bar */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Hungry? Search for burgers, pizza, biryani..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="row g-4">
        {menuItems
          .filter(item =>
            !search ||
            item.item_name.toLowerCase().includes(search.toLowerCase()) ||
            item.restaurant_name.toLowerCase().includes(search.toLowerCase())
          )
          .map((item, idx) => (
            <div key={idx} className="col-lg-4 col-md-6 col-sm-12">
              <div className="card h-100 shadow-lg border-0">
                <img
                  src={item.image}
                  className="card-img-top"
                  alt={item.item_name}
                  style={{ height: "250px", objectFit: "cover", borderRadius: "10px 10px 0 0" }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title text-primary">{item.item_name}</h5>
                  <p className="text-muted mb-1">by <strong>{item.restaurant_name}</strong></p>
                  <p className="text-success fw-bold mb-3">
                    Rs {Number(item.price).toFixed(2)}
                  </p>
                  <button
                    className="btn btn-danger w-100"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
