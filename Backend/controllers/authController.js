const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.authenticate = (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) return res.status(400).json({ message: 'Name, email, and password required.' });

  const sql = `SELECT * FROM restaurants WHERE LOWER(email) = LOWER(?) AND LOWER(name) = LOWER(?)`;
  db.query(sql, [email.trim().toLowerCase(), name.trim().toLowerCase()], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error.' });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials.' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

    res.status(200).json({
      message: 'Login successful',
      restaurant: {
        id: user.id,
        name: user.name,
        email: user.email,
        description: user.description,
        image: user.image,
      },
    });
  });
};
