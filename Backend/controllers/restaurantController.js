const db = require('../config/db');

exports.getProfile = (req, res) => {
  const { name } = req.params;
  const query = 'SELECT name, email, description, image FROM restaurants WHERE LOWER(name) = LOWER(?)';
  db.query(query, [name.trim().toLowerCase()], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching profile.' });
    if (results.length === 0) return res.status(404).json({ message: 'Restaurant not found.' });
    res.json(results[0]);
  });
};

exports.updateProfileImage = (req, res) => {
  const { name } = req.params;
  const { image } = req.body;
  if (!image) return res.status(400).json({ message: 'No image provided.' });

  const query = 'UPDATE restaurants SET image = ? WHERE LOWER(name) = LOWER(?)';
  db.query(query, [image, name.trim().toLowerCase()], (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to update image.' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Restaurant not found.' });
    res.json({ message: 'Image updated successfully.' });
  });
};
