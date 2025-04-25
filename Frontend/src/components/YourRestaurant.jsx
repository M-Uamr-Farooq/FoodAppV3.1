import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const YourRestaurant = () => {
    const [restaurant, setRestaurant] = useState(null);
    const [menu, setMenu] = useState([]);
    const [newMenuItem, setNewMenuItem] = useState({ itemName: '', price: '', image: null });
    const [restaurantImage, setRestaurantImage] = useState(null);
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
                const response = await axios.get(`http://localhost:3000/api/restaurants/${restaurantName}`);
                setRestaurant(response.data);
                
                const menuResponse = await axios.get(`http://localhost:3000/api/menu/${restaurantName}`);
                setMenu(menuResponse.data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [restaurantName, navigate]);

    const handleImageUpload = async (e) => {
        e.preventDefault();
        if (!restaurantImage) {
            alert('Please select an image');
            return;
        }

        const formData = new FormData();
        formData.append('image', restaurantImage);
        formData.append('restaurantName', restaurantName);

        try {
            setIsLoading(true);
            const response = await axios.post(
                'http://localhost:3000/api/restaurants/update-image',
                formData,
                {
                    headers: { 
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.imagePath) {
                setRestaurant(prev => ({ ...prev, image: response.data.imagePath }));
                alert('Image updated successfully');
            } else {
                throw new Error('Invalid server response');
            }
        } catch (err) {
            console.error('Error uploading image:', err);
            alert(err.response?.data?.message || 'Failed to update image');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle adding a new menu item
    const handleAddMenuItem = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('restaurantName', restaurantName);
        formData.append('itemName', newMenuItem.itemName);
        formData.append('price', newMenuItem.price);
        formData.append('image', newMenuItem.image);

        try {
            setIsLoading(true);
            const response = await axios.post(
                'http://localhost:3000/api/menu',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );
            alert(response.data.message);
            // Refresh menu after adding new item
            const menuResponse = await axios.get(`http://localhost:3000/api/menu/${restaurantName}`);
            setMenu(menuResponse.data);
            setNewMenuItem({ itemName: '', price: '', image: null });
        } catch (err) {
            console.error('Error adding menu item:', err);
            alert(err.response?.data?.message || 'Failed to add menu item');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger m-5" role="alert">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="container mt-5">
            {restaurant && (
                <>
                    <h2 className="text-center mb-4 text-primary">🍴 Your Restaurant Profile</h2>
                    <div className="card shadow-lg p-4 mb-4">
                        <div className="card-body">
                            <h4 className="card-title text-center text-success">{restaurant.name}</h4>
                            <p className="card-text">
                                <strong>Email:</strong> {restaurant.email}
                            </p>
                            <p className="card-text">
                                <strong>Description:</strong> {restaurant.description}
                            </p>
                            <div className="text-center">
                                <img
                                    src={restaurant.image ? `http://localhost:3000/uploads/${restaurant.image}` : 'https://via.placeholder.com/150'}
                                    alt="Restaurant"
                                    className="img-fluid rounded"
                                    style={{ maxWidth: '200px' }}
                                />
                                <form onSubmit={handleImageUpload} className="mt-3">
                                    <input
                                        type="file"
                                        className="form-control"
                                        onChange={(e) => setRestaurantImage(e.target.files[0])}
                                        required
                                    />
                                    <button type="submit" className="btn btn-primary mt-2">
                                        Update Image
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-lg p-4 mb-4">
                        <h5 className="text-center text-warning mb-3">Add Menu Item</h5>
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
                                <label className="form-label">Price</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={newMenuItem.price}
                                    onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Image</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    onChange={(e) => setNewMenuItem({ ...newMenuItem, image: e.target.files[0] })}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-warning w-100">
                                Add Item
                            </button>
                        </form>
                    </div>

                    <div className="card shadow-lg p-4">
                        <h5 className="text-center text-success mb-3">Menu</h5>
                        {menu.length === 0 ? (
                            <p className="text-center">No menu items available.</p>
                        ) : (
                            <ul className="list-group">
                                {menu.map((item) => (
                                    <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{item.item_name}</strong> - ${Number(item.price).toFixed(2)}
                                            <br />
                                            {item.image && (
                                                <img 
                                                    src={`http://localhost:3000/uploads/${item.image}`} 
                                                    alt={item.item_name} 
                                                    className="img-fluid mt-2" 
                                                    style={{ maxWidth: '100px' }} 
                                                />
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default YourRestaurant;
