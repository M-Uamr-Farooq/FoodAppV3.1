import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const YourRestaurant = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [newMenuItem, setNewMenuItem] = useState({ itemName: '', price: '', imageUrl: '' });
  const [restaurantImageUrl, setRestaurantImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const restaurantName = sessionStorage.getItem('restaurantName');

  useEffect(() => {
    if (!restaurantName) {
      navigate('/your-restaurant-auth');
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`http://localhost:3000/api/restaurants/${restaurantName}`);
        const menuRes = await axios.get(`http://localhost:3000/api/menu/${restaurantName}`);
        setRestaurant(res.data);
        setMenu(menuRes.data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [restaurantName, navigate]);

  const handleImageUpdate = async (e) => {
    e.preventDefault();
    if (!restaurantImageUrl.trim()) return alert('Enter a valid image URL');

    try {
      const res = await axios.put(`http://localhost:3000/api/restaurants/update-image`, {
        restaurantName,
        imageUrl: restaurantImageUrl
      });

      if (res.data.success) {
        setRestaurant(prev => ({ ...prev, image: restaurantImageUrl }));
        alert('Image URL updated');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update image');
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    const { itemName, price, imageUrl } = newMenuItem;
    if (!itemName || !price || !imageUrl) return alert('Fill all fields');

    try {
      const res = await axios.post(`http://localhost:3000/api/menu`, {
        restaurantName,
        itemName,
        price,
        image: imageUrl
      });

      alert(res.data.message);
      const menuRes = await axios.get(`http://localhost:3000/api/menu/${restaurantName}`);
      setMenu(menuRes.data);
      setNewMenuItem({ itemName: '', price: '', imageUrl: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to add item');
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-warning" role="status"></div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger mt-4 text-center">Error: {error}</div>;
  }

  return (
    <div className="container py-5 d-flex flex-column align-items-center">
      {restaurant && (
        <>
          <h2 className="mb-4 text-warning">🍽️ {restaurant.name}</h2>

          <div className="card shadow-sm p-4 mb-4" style={{ maxWidth: '500px', width: '100%', backgroundColor: '#fff9e6' }}>
            <div className="text-center">
              <img
                src={restaurant.image || 'https://via.placeholder.com/250'}
                alt="Restaurant"
                className="img-fluid rounded mb-3"
                style={{ maxHeight: '250px', objectFit: 'cover', borderRadius: '12px' }}
              />
              <form onSubmit={handleImageUpdate}>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Paste image URL"
                  value={restaurantImageUrl}
                  onChange={(e) => setRestaurantImageUrl(e.target.value)}
                />
                <button type="submit" className="btn btn-warning w-100">Update Image</button>
              </form>
              <p className="mt-3 text-muted">{restaurant.description}</p>
            </div>
          </div>

          <div className="card shadow-sm p-4 mb-4" style={{ maxWidth: '500px', width: '100%', backgroundColor: '#fffbe6' }}>
            <h4 className="text-center text-warning mb-3">➕ Add Menu Item</h4>
            <form onSubmit={handleAddMenuItem}>
              <div className="mb-3">
                <label className="form-label">Item Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newMenuItem.itemName}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, itemName: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Price ($)</label>
                <input
                  type="number"
                  className="form-control"
                  value={newMenuItem.price}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Image URL</label>
                <input
                  type="text"
                  className="form-control"
                  value={newMenuItem.imageUrl}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, imageUrl: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-warning w-100">Add Item</button>
            </form>
          </div>

          <div className="card shadow-sm p-4" style={{ maxWidth: '900px', width: '100%', backgroundColor: '#fff8cc' }}>
            <h4 className="text-center text-success mb-4">📋 Your Menu</h4>
            {menu.length === 0 ? (
              <p className="text-center">No items added yet.</p>
            ) : (
              <div className="row">
                {menu.map(item => (
                  <div className="col-md-4 mb-4" key={item.id}>
                    <div className="card h-100 shadow-sm border-0">
                      <img
                        src={item.image}
                        className="card-img-top"
                        alt={item.item_name}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{item.item_name}</h5>
                        <p className="card-text text-muted">${Number(item.price).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default YourRestaurant;
