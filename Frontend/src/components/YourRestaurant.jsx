import React, { useEffect, useState } from 'react';
import axios from 'axios';

const YourRestaurant = () => {
  const [restaurant, setRestaurant] = useState(null);
  const restaurantName = sessionStorage.getItem('restaurantName');
  const restaurantEmail = sessionStorage.getItem('restaurantEmail');

  useEffect(() => {
    if (!restaurantName || !restaurantEmail) {
        alert('You are not logged in!');
        window.location.href = '/your-restaurant-auth'; // Redirect to login if not authenticated
        return;
    }

    // Fetch restaurant profile
    const fetchRestaurant = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/restaurants/${restaurantName}`);
            setRestaurant(response.data);
        } catch (error) {
            console.error('Error fetching restaurant profile:', error);
            alert('Failed to fetch restaurant profile.');
        }
    };

    fetchRestaurant();
}, [restaurantName, restaurantEmail]);

  if (!restaurant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Your Restaurant Profile</h2>
      <div className="card shadow-lg p-4">
        {restaurant.image && (
          <div className="text-center mb-4">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="img-fluid rounded shadow"
              style={{ maxWidth: '300px' }}
            />
          </div>
        )}
        <p><strong>Name:</strong> {restaurant.name}</p>
        <p><strong>Email:</strong> {restaurant.email}</p>
        <p><strong>Description:</strong> {restaurant.description}</p>
      </div>
    </div>
  );
};

export default YourRestaurant;
