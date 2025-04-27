const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  const { name, email, password, description, image } = req.body;
  if (!name || !email || !password || !description) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO restaurants (name, email, password, description, image) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, email, hashedPassword, description, image || null], (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error.' });
      res.status(201).json({ message: 'Restaurant registered successfully.' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};
