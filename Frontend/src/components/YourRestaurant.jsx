import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/YourRestaurant.css';

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
      className="container-fluid py-5"
      style={{
        minHeight: '100vh',
        background: '#f8f9fa', // Changed background to low white
        color: '#fff',
      }}
    >
      {restaurant ? (
        <div className="d-flex flex-column align-items-center">
          {/* Restaurant Image and Name */}
          <div className="w-100 mb-4 d-flex justify-content-center">
            <img
              src={restaurant.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1100&q=80'}
              alt="Restaurant"
              style={{
                width: '100%',
                maxWidth: 1100,
                height: '370px',
                objectFit: 'cover',
                display: 'block',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            />
          </div>
          <h1
            className="text-center mt-2"
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '2.75rem',
              color: '#333', // Changed color to dark gray
              fontWeight: '600',
            }}
          >
            {restaurant.name}
          </h1>

          {/* Add Menu Item Form */}
          <div
            className="w-100 mb-4"
            style={{
              maxWidth: '1100px',
              padding: '30px',
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3
              className="text-center mb-4"
              style={{
                fontSize: '2rem',
                color: '#333',
                fontWeight: '500',
              }}
            >
              Add a Menu Item
            </h3>
            <form onSubmit={handleAddMenuItem} className="w-100">
              <div className="row g-4">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Item Name"
                    value={newMenuItem.itemName}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, itemName: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    placeholder="Price (Rs)"
                    value={newMenuItem.price}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Image URL"
                    value={newMenuItem.imageUrl}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, imageUrl: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-1">
                  <button type="submit" className="btn btn-success btn-lg">
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

          {/* Menu Items */}
          <div
            className="w-100"
            style={{
              maxWidth: '1100px',
              padding: '30px',
              background: 'rgba(241, 241, 241, 0.7)',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h4
              className="text-center mb-4"
              style={{
                fontSize: '1.75rem',
                color: '#333',
                fontWeight: '500',
              }}
            >
              Your Menu
            </h4>
            {menu.length === 0 ? (
              <p className="text-center">No items added yet.</p>
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {menu.map(item => (
                  <div className="col" key={item.id}>
                    <div
                      className="card h-100 border-0 shadow-sm position-relative"
                      style={{
                        background: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1), 0px 0px 20px rgba(0, 0, 0, 0.05)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.1), 0px 0px 20px rgba(0, 0, 0, 0.05)';
                      }}
                    >
                      <img
                        src={item.image}
                        className="card-img-top"
                        alt={item.item_name}
                        style={{
                          height: '190px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                        }}
                      />
                      <div className="card-body d-flex flex-column align-items-center text-center">
                        <h5
                          className="card-title"
                          style={{
                            fontSize: '1.25rem',
                            marginBottom: '0.5rem',
                            color: '#333',
                            fontWeight: '600',
                          }}
                        >
                          {item.item_name}
                        </h5>
                        <p className="card-text" style={{ fontSize: '1.1rem', color: '#28a745' }}>
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
        </div>
      ) : (
        <div className="alert alert-warning text-center">Loading restaurant data...</div>
      )}
    </div>
  );
};

export default YourRestaurant;
