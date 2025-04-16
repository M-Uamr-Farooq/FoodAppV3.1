import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function YourRestaurant() {
  const [restaurants, setRestaurants] = useState(
    JSON.parse(localStorage.getItem("restaurants")) || []
  );
  const [formData, setFormData] = useState({
    name: "",
    cuisine: "",
    description: "",
    image: null,
    menu: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const existingRestaurants = JSON.parse(localStorage.getItem("restaurants")) || [];
    const updatedRestaurants = [...existingRestaurants, formData];
    localStorage.setItem("restaurants", JSON.stringify(updatedRestaurants));
    setRestaurants(updatedRestaurants);
    setFormData({ name: "", cuisine: "", description: "", image: null, menu: "" });
    alert("Restaurant registered successfully!");
  };

  return (
    <div className="container py-5">
      <h1 className="text-center text-danger mb-4">Register Your Restaurant</h1>
      <form onSubmit={handleSubmit} className="mb-5 shadow p-4 rounded bg-white">
        <div className="mb-3">
          <label className="form-label">Restaurant Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Cuisine Type</label>
          <input
            type="text"
            name="cuisine"
            value={formData.cuisine}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            rows="3"
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Upload Restaurant Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Menu (Comma Separated)</label>
          <input
            type="text"
            name="menu"
            value={formData.menu}
            onChange={handleChange}
            className="form-control"
            placeholder="e.g., Pizza, Burger, Salad"
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100">
          Register Restaurant
        </button>
      </form>

      <h2 className="text-center text-danger mb-4">Registered Restaurants</h2>
      <div className="row g-4">
        {restaurants.map((restaurant, index) => (
          <div key={index} className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">
              <img
                src={restaurant.image}
                className="card-img-top"
                alt={restaurant.name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h4 className="card-title text-danger fw-bold">
                  {restaurant.name}
                </h4>
                <h6 className="text-muted">{restaurant.cuisine}</h6>
                <p className="card-text">{restaurant.description}</p>
                <p className="text-muted">
                  <strong>Menu:</strong> {restaurant.menu}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
