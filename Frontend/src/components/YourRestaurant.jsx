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
        const menuRes = await axios.get(`http://localhost:3000/api/menu/${data.name}`);
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
    <div className="container-fluid py-5 d-flex flex-column align-items-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fffbe6 0%, #ffe0b2 100%)' }}>
      {/* Restaurant Info */}
      {restaurant && (
        <>
          <div className="w-100 d-flex flex-column align-items-center mb-4">
            <img
              src={restaurant.image || 'https://via.placeholder.com/900x420?text=Restaurant+Image'}
              alt="Restaurant"
              className="img-fluid shadow"
              style={{
                maxHeight: '420px',
                maxWidth: '100%',
                objectFit: 'cover',
                borderRadius: '32px',
                marginBottom: '1.5rem',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15), 0 1.5px 6px rgba(255,193,7,0.08)'
              }}
            />
            <h1
              className="fw-bold text-center px-4 py-3 mb-0"
              style={{
                fontSize: '2.8rem',
                color: '#ff9800',
                letterSpacing: '2px',
                background: '#fff9e6',
                borderRadius: '18px',
                boxShadow: '0 2px 12px rgba(255, 193, 7, 0.08)'
              }}
            >
              🍽️ <span style={{ fontFamily: 'cursive, sans-serif', textShadow: '1px 2px 8px #ffe0b2' }}>{restaurant.name}</span>
            </h1>
          </div>

          {/* Add Menu Item Form - Same width as Your Menu */}
          <div className="card shadow-lg p-4 mb-4 w-100" style={{ maxWidth: '1100px', background: '#fffbe6', borderRadius: '24px' }}>
            <h3 className="text-center text-warning mb-4 fw-bold" style={{ fontSize: '2rem', letterSpacing: '1px' }}>➕ Add Menu Item</h3>
            <form onSubmit={handleAddMenuItem} className="w-100">
              <div className="row g-3 justify-content-center">
                <div className="col-12 col-md-4">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Item Name"
                    value={newMenuItem.itemName}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, itemName: e.target.value })}
                    required
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
                  />
                </div>
                <div className="col-12 col-md-4">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Image URL"
                    value={newMenuItem.imageUrl}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, imageUrl: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-12 d-flex justify-content-center">
                  <button type="submit" className="btn btn-warning btn-lg fw-bold shadow-sm px-5">
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
          <div className="card shadow-lg p-4 w-100" style={{ maxWidth: '1100px', background: '#fff8cc', borderRadius: '24px' }}>
            <h4 className="text-center text-success mb-4 fw-bold" style={{ fontSize: '1.7rem' }}>📋 Your Menu</h4>
            {menu.length === 0 ? (
              <p className="text-center">No items added yet.</p>
            ) : (
              <div className="row g-4">
                {menu.map(item => (
                  <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={item.id}>
                    <div className="card h-100 shadow-sm border-0 position-relative">
                      <img
                        src={item.image}
                        className="card-img-top"
                        alt={item.item_name}
                        style={{ height: '180px', objectFit: 'cover', borderRadius: '12px 12px 0 0' }}
                      />
                      <div className="card-body d-flex flex-column align-items-center">
                        <h5 className="card-title text-primary fw-bold">{item.item_name}</h5>
                        <p className="card-text text-success fw-bold mb-2">
                          Rs {Number(item.price).toFixed(2)}
                        </p>
                        <button
                          className="btn btn-outline-danger btn-sm mt-auto"
                          onClick={() => handleRemoveMenuItem(item.id)}
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
