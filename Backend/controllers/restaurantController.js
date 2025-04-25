const db = require('../config/db');

exports.getProfile = (req, res) => {
  const { name } = req.params;
  const query = 'SELECT name, email, description, image FROM restaurants WHERE LOWER(name) = LOWER(?)';
  db.query(query, [name.trim()], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching profile.' });
    if (results.length === 0) return res.status(404).json({ message: 'Restaurant not found.' });
    res.json(results[0]);
  });
};
