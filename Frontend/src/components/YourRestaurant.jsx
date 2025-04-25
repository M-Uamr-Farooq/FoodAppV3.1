import React, { useState, useEffect } from "react";
import axios from "axios";

export default function YourRestaurant() {
  const username = sessionStorage.getItem("username"); // Retrieve username from sessionStorage
  const [profile, setProfile] = useState({});
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    if (!username) {
      alert("You are not logged in!");
      window.location.href = "/your-restaurant-auth"; // Redirect to login if not authenticated
      return;
    }

    // Fetch restaurant profile and menu items
    const fetchData = async () => {
      try {
        const profileResponse = await axios.get(`http://localhost:3000/api/restaurants/${username}`);
        setProfile(profileResponse.data); // Update profile state

        const menuResponse = await axios.get(`http://localhost:3000/api/menu/${username}`);
        setMenuItems(menuResponse.data); // Update menu items state
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [username]);

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Your Restaurant Profile</h2>
      {profile.image && (
        <div className="text-center mb-4">
          <img
            src={profile.image}
            alt={profile.name}
            className="img-fluid rounded shadow"
            style={{ maxWidth: "300px" }}
          />
        </div>
      )}
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Address:</strong> {profile.address}</p>
      <p><strong>Phone:</strong> {profile.phone}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Description:</strong> {profile.description}</p>

      <h4 className="mt-4">Menu Items</h4>
      <ul>
        {menuItems.map((item, index) => (
          <li key={index}>
            <strong>{item.name}</strong> - ${item.price}
            {item.image && <img src={item.image} alt={item.name} style={{ width: "50px", marginLeft: "10px" }} />}
          </li>
        ))}
      </ul>
    </div>
  );
}
