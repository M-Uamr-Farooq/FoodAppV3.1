const db = require('../config/db');

exports.createOrder = async (req, res) => {
  const { buyer_name, address, contact, total, status, restaurantName } = req.body;

  if (!buyer_name || !address || !contact || !total || !restaurantName) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const query = `
      INSERT INTO orders (buyer_name, address, contact, total, status, restaurantName)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.promise().query(query, [
      buyer_name,
      address,
      contact,
      total,
      status,
      restaurantName,
    ]);

    res.status(201).json({ message: 'Order created successfully.', orderId: result.insertId });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Failed to create order.' });
  }
};

exports.getOrdersByRestaurant = async (req, res) => {
  const { restaurantName } = req.params;

  if (!restaurantName) {
    return res.status(400).json({ message: 'Restaurant name is required.' });
  }

  try {
    const query = `
      SELECT id, buyer_name, address, contact AS phone, total, status, created_at
      FROM orders
      WHERE restaurantName = ?
      ORDER BY created_at DESC
    `;
    const [orders] = await db.promise().query(query, [restaurantName]);

    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status, deliveryPerson } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Status is required.' });
  }

  try {
    // Update the order status in the database
    const query = 'UPDATE orders SET status = ?, delivery_person = ? WHERE id = ?';
    const [result] = await db.promise().query(query, [status, deliveryPerson || 'N/A', id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.json({ message: 'Order status updated successfully.' });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: 'Failed to update order status.' });
  }
};

exports.getNewOrdersCount = async (req, res) => {
  const { restaurantName } = req.params;
  if (!restaurantName) return res.status(400).json({ message: 'Restaurant name is required.' });

  try {
    const query = `
      SELECT COUNT(*) AS newOrdersCount
      FROM orders
      WHERE restaurantName = ? AND status = 'Placed'
    `;
    const [result] = await db.promise().query(query, [restaurantName]);
    res.status(200).json(result[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch new orders count.' });
  }
};