const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.authenticate = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required.' });

  db.query('SELECT * FROM restaurants WHERE LOWER(email) = LOWER(?)', [email.trim().toLowerCase()], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error.' });
    if (results.length === 0) return res.status(401).json({ message: 'Email or password is incorrect.' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Email or password is incorrect.' });

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