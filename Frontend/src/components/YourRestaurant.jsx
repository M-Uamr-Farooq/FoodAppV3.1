import React, { useState, useEffect } from "react";
import axios from "axios";

export default function YourRestaurant() {
  const ownerEmail = sessionStorage.getItem("ownerEmail"); // set this on login
  const [formData, setFormData] = useState({ name: "", cuisine: "", description: "", image: "" });
  const [menuItem, setMenuItem] = useState({ name: "", image: "" });

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "restaurant") setFormData((prev) => ({ ...prev, image: reader.result }));
      else setMenuItem((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/api/restaurants", { ...formData, ownerEmail });
    alert("Profile saved!");
  };

  const addMenuItem = async () => {
    if (!menuItem.name || !menuItem.image) return alert("Fill name & image");
    await axios.post("/api/menu", { ...menuItem, ownerEmail });
    alert("Menu item added");
    setMenuItem({ name: "", image: "" });
  };

  return (
    <div className="container py-5">
      <h2>Your Restaurant</h2>
      <form onSubmit={handleSubmit}>
        <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Name" className="form-control mb-2" />
        <input value={formData.cuisine} onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })} placeholder="Cuisine" className="form-control mb-2" />
        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" className="form-control mb-2" />
        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "restaurant")} className="form-control mb-3" />
        <button className="btn btn-success">Save Profile</button>
      </form>

      <h4 className="mt-4">Add Menu Item</h4>
      <div className="d-flex gap-2">
        <input value={menuItem.name} onChange={(e) => setMenuItem({ ...menuItem, name: e.target.value })} placeholder="Item name" className="form-control" />
        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "menu")} className="form-control" />
        <button onClick={addMenuItem} className="btn btn-primary">Add</button>
      </div>
    </div>
  );
}
