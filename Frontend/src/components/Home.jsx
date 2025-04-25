import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:3000/api/restaurants-with-menu");
      setRestaurants(res.data);
    };
    fetchData();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="text-center text-danger mb-4">🍴 Explore Delicious Menus 🍴</h2>
      <p className="text-center text-muted mb-5">
        Discover mouth-watering dishes from the best restaurants in town. Let your cravings guide you!
      </p>
      <div className="row g-4">
        {restaurants.map((item, idx) => (
          <div key={idx} className="col-lg-4 col-md-6 col-sm-12">
            <div className="card h-100 shadow-lg border-0">
              <img
                src={item.image}
                className="card-img-top"
                alt={item.menuItemName}
                style={{ height: "250px", objectFit: "cover", borderRadius: "10px 10px 0 0" }}
              />
              <div className="card-body text-center">
                <h5 className="card-title text-primary">{item.menuItemName}</h5>
                <p className="text-muted mb-1">by <strong>{item.restaurantName}</strong></p>
                <p className="text-success fw-bold mb-3">${item.price}</p>
                <p className="text-muted">{item.description}</p>
                <button className="btn btn-danger w-100">Order Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
