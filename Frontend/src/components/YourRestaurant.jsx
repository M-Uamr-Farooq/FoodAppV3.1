import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FIVE_HOURS = 5 * 60 * 60 * 1000;

const YourRestaurant = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMsg, setActionMsg] = useState('');
  const [newMenuItem, setNewMenuItem] = useState({ itemName: '', price: '', imageUrl: '' });
  const navigate = useNavigate();

  // Check sessionStorage for restaurant info and expiry
  useEffect(() => {
    const stored = sessionStorage.getItem('restaurant');
    if (!stored) {
      navigate('/your-restaurant-auth');
      return;
    }
    const data = JSON.parse(stored);
    if (!data.name) {
      sessionStorage.removeItem('restaurant');
      navigate('/your-restaurant-auth');
      return;
    }
    if (Date.now() - data.loginTime > FIVE_HOURS) {
      sessionStorage.removeItem('restaurant');
      navigate('/your-restaurant-auth');
      return;
    }
    setRestaurant(data);

    // Fetch menu
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const menuRes = await axios.get(`http://localhost:3000/api/menu/${encodeURIComponent(data.name)}`); // Use the new route
        setMenu(menuRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, [navigate, actionMsg]);

  // Remove menu item
  const handleRemoveMenuItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this item?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/menu/${itemId}`);
      setMenu(menu.filter(item => item.id !== itemId));
      setActionMsg('Item removed!');
    } catch {
      setActionMsg('Failed to remove item');
    }
    setTimeout(() => setActionMsg(''), 2000);
  };

  // Add menu item
  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    const { itemName, price, imageUrl } = newMenuItem;
    if (!itemName || !price || !imageUrl) {
      setActionMsg('Fill all fields');
      return;
    }
    try {
      const res = await axios.post(`http://localhost:3000/api/menu`, {
        restaurantName: restaurant.name,
        itemName,
        price,
        image: imageUrl
      });
      setActionMsg(res.data.message || 'Item added!');
      // Refresh menu
      const menuRes = await axios.get(`http://localhost:3000/api/menu/${restaurant.name}`);
      setMenu(menuRes.data);
      setNewMenuItem({ itemName: '', price: '', imageUrl: '' });
    } catch (err) {
      setActionMsg('Failed to add item');
    }
    setTimeout(() => setActionMsg(''), 2000);
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
    <div
      className="container-fluid py-5 d-flex flex-column align-items-center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fffbe6 0%, #ffe0b2 100%)',
      }}
    >
      {restaurant && (
        <>
          {/* Modern Restaurant Banner */}
          <div className="w-100 d-flex flex-column align-items-center mb-4">
            <div
              style={{
                width: '100%',
                maxWidth: 1100,
                borderRadius: '36px',
                overflow: 'hidden',
                boxShadow: '0 8px 40px 0 rgba(255, 140, 0, 0.18), 0 2px 8px 0 rgba(255,193,7,0.10)',
                background: 'linear-gradient(120deg, #fff3e0 60%, #ffe0b2 100%)',
              }}
            >
              <img
                src={restaurant.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1100&q=80'}
                alt="Restaurant"
                style={{
                  width: '100%',
                  height: '370px',
                  objectFit: 'cover',
                  filter: 'brightness(0.93) saturate(1.18) contrast(1.08)',
                  transition: '0.3s',
                  display: 'block',
                }}
              />
            </div>
            {/* Restaurant Name - below the image, no background */}
            <h1
              className="fw-bold mt-4 mb-3 text-center"
              style={{
                fontFamily: "'Pacifico', cursive, sans-serif",
                fontSize: '2.8rem',
                color: '#ff6f00',
                letterSpacing: '2px',
                textShadow: '0 6px 24px #ffe082, 0 2px 8px #fffbe6, 0 1px 0 #fff9e6',
                lineHeight: 1.1,
                display: 'block',
              }}
            >
              <span role="img" aria-label="plate">🍽️</span> {restaurant.name}
            </h1>
          </div>

          {/* Add Menu Item Card */}
          <div
            className="card shadow-lg p-4 mb-4 w-100"
            style={{
              maxWidth: '1100px',
              background: 'linear-gradient(120deg, #fffbe6 80%, #ffe0b2 100%)',
              borderRadius: '24px',
              border: 'none',
              boxShadow: '0 4px 32px 0 rgba(255, 193, 7, 0.13)',
            }}
          >
            <h3
              className="text-center mb-4 fw-bold"
              style={{
                fontSize: '2.1rem',
                letterSpacing: '1px',
                color: '#ff9800',
                fontFamily: "'Baloo 2', cursive, sans-serif",
                textShadow: '0 2px 8px #ffe0b2',
              }}
            >
              <span role="img" aria-label="add">🍔</span> Add a Mouth-Watering Menu Item
            </h3>
            <form onSubmit={handleAddMenuItem} className="w-100">
              <div className="row g-3 justify-content-center">
                <div className="col-12 col-md-4">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Item Name (e.g. Cheesy Burger)"
                    value={newMenuItem.itemName}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, itemName: e.target.value })}
                    required
                    style={{ fontWeight: 500, fontSize: '1.1rem' }}
                  />
                </div>
                <div className="col-12 col-md-3">
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    placeholder="Price (Rs)"
                    value={newMenuItem.price}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
                    required
                    style={{ fontWeight: 500, fontSize: '1.1rem' }}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Image URL (make it tasty!)"
                    value={newMenuItem.imageUrl}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, imageUrl: e.target.value })}
                    required
                    style={{ fontWeight: 500, fontSize: '1.1rem' }}
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-12 d-flex justify-content-center">
                  <button
                    type="submit"
                    className="btn btn-warning btn-lg fw-bold shadow-sm px-5"
                    style={{
                      fontSize: '1.3rem',
                      letterSpacing: '1px',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px #ffe082',
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            </form>
          </div>

          {actionMsg && (
            <div className="alert alert-info text-center w-100" style={{ maxWidth: '600px' }}>
              {actionMsg}
            </div>
          )}

          {/* Menu */}
          <div
            className="card shadow-lg p-4 w-100"
            style={{
              maxWidth: '1100px',
              background: 'linear-gradient(120deg, #fff8cc 80%, #ffe0b2 100%)',
              borderRadius: '24px',
              border: 'none',
              boxShadow: '0 4px 32px 0 rgba(255, 193, 7, 0.13)',
            }}
          >
            <h4
              className="text-center text-success mb-4 fw-bold"
              style={{
                fontSize: '1.7rem',
                fontFamily: "'Baloo 2', cursive, sans-serif",
                letterSpacing: '1px',
                textShadow: '0 2px 8px #fffbe6',
              }}
            >
              <span role="img" aria-label="menu">📋</span> Your Menu
            </h4>
            {menu.length === 0 ? (
              <p className="text-center">No items added yet.</p>
            ) : (
              <div className="row g-4">
                {menu.map(item => (
                  <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={item.id}>
                    <div
                      className="card h-100 shadow-sm border-0 position-relative"
                      style={{
                        borderRadius: '18px',
                        background: '#fffbe6',
                        boxShadow: '0 2px 12px #ffe082',
                        transition: 'transform 0.15s',
                      }}
                    >
                      <img
                        src={item.image}
                        className="card-img-top"
                        alt={item.item_name}
                        style={{
                          height: '180px',
                          objectFit: 'cover',
                          borderRadius: '12px 12px 0 0',
                          filter: 'saturate(1.15) contrast(1.08)',
                        }}
                      />
                      <div className="card-body d-flex flex-column align-items-center">
                        <h5
                          className="card-title text-primary fw-bold"
                          style={{
                            fontFamily: "'Baloo 2', cursive, sans-serif",
                            fontSize: '1.2rem',
                            letterSpacing: '1px',
                          }}
                        >
                          {item.item_name}
                        </h5>
                        <p className="card-text text-success fw-bold mb-2" style={{ fontSize: '1.1rem' }}>
                          Rs {Number(item.price).toFixed(2)}
                        </p>
                        <button
                          className="btn btn-outline-danger btn-sm mt-auto"
                          onClick={() => handleRemoveMenuItem(item.id)}
                          style={{
                            borderRadius: '8px',
                            fontWeight: 500,
                            letterSpacing: '1px',
                          }}
                        >
                          Remove
                        </button>
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
