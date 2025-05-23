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
        const menuRes = await axios.get(`http://localhost:3000/api/menu/${encodeURIComponent(data.name)}`);
        setMenu(menuRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, [navigate, actionMsg]);

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
    <div className="container-fluid py-3 px-1 px-md-4" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Responsive Banner */}
      <div className="position-relative mb-4">
        <div className="ratio ratio-21x9 rounded-4 overflow-hidden shadow" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <img
            src={restaurant?.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1100&q=80'}
            alt="Restaurant"
            className="object-fit-cover w-100 h-100"
            style={{ objectFit: 'cover' }}
          />
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ background: 'rgba(0,0,0,0.35)' }}>
            <h1 className="text-white fw-bold display-4 text-center text-shadow">{restaurant?.name}</h1>
          </div>
        </div>
      </div>

      {/* Add Menu Item Form */}
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-lg-10">
          <div className="card shadow rounded-4 p-3 p-md-4">
            <h3 className="text-center mb-3 text-success">
              <i className="bi bi-plus-circle me-2"></i>Add a Menu Item
            </h3>
            <form onSubmit={handleAddMenuItem}>
              <div className="row g-2 g-md-3">
                <div className="col-12 col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Item Name"
                    value={newMenuItem.itemName}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, itemName: e.target.value })}
                    required
                  />
                </div>
                <div className="col-12 col-md-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Price (Rs)"
                    value={newMenuItem.price}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
                    required
                  />
                </div>
                <div className="col-12 col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Image URL"
                    value={newMenuItem.imageUrl}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, imageUrl: e.target.value })}
                    required
                  />
                </div>
                <div className="col-12 col-md-1 d-grid">
                  <button type="submit" className="btn btn-success">
                    <i className="bi bi-plus-lg"></i>
                  </button>
                </div>
              </div>
            </form>
            {actionMsg && (
              <div className="alert alert-info text-center mt-3 mb-0 py-2">{actionMsg}</div>
            )}
          </div>
        </div>
      </div>

      {/* Menu Items Section */}
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="card shadow rounded-4 p-3 p-md-4">
            <h4 className="text-center mb-3 text-primary">
              <i className="bi bi-list-ul me-2"></i>Your Menu
            </h4>
            {menu.length === 0 ? (
              <p className="text-center">No items added yet.</p>
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {menu.map(item => (
                  <div className="col" key={item.id}>
                    <div
                      className="card h-100 border-0 shadow-sm position-relative rounded-3"
                      style={{
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0px 4px 12px rgba(0, 0, 0, 0.08)';
                      }}
                    >
                      <img
                        src={item.image}
                        className="card-img-top"
                        alt={item.item_name}
                        style={{
                          height: '140px',
                          objectFit: 'cover',
                          borderRadius: '12px 12px 0 0',
                        }}
                      />
                      <div className="card-body d-flex flex-column align-items-center text-center">
                        <h5 className="card-title" style={{
                          fontSize: '1.05rem',
                          marginBottom: '0.5rem',
                          color: '#222',
                          fontWeight: '600',
                        }}>
                          {item.item_name}
                        </h5>
                        <span className="badge bg-success mb-2" style={{ fontSize: '1rem' }}>
                          Rs {Number(item.price).toFixed(2)}
                        </span>
                        <button
                          className="btn btn-outline-danger btn-sm mt-auto"
                          onClick={() => handleRemoveMenuItem(item.id)}
                        >
                          <i className="bi bi-trash me-1"></i> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourRestaurant;
