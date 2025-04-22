import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("/api/restaurants-with-menu");
      setRestaurants(res.data);
    };
    fetchData();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="text-center text-danger mb-4">All Restaurants' Menus</h2>
      <div className="row g-4">
        {restaurants.map((restaurant) =>
          restaurant.menuItems.map((item, idx) => (
            <div key={`${restaurant.id}-${idx}`} className="col-md-4">
              <div className="card h-100 shadow-sm">
                <img src={item.image} className="card-img-top" alt={item.name} style={{ height: "200px", objectFit: "cover" }} />
                <div className="card-body text-center">
                  <h5>{item.name}</h5>
                  <p className="text-muted">by {restaurant.name}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
