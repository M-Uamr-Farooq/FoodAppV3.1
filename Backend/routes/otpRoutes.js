const express = require('express');
const router = express.Router();
const transporter = require('../config/mailer');
const otpStore = require('../utils/otpStore');
const db = require('../config/db');
const bcrypt = require('bcrypt');

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  try {
    await transporter.sendMail({
      from: '"FoodApp" <shanisipra428@gmail.com>',
      to: email,
      subject: 'Your FoodApp OTP Code',
      text: `Your OTP code is: ${otp}`,
      html: `<h2>Your OTP code is: <b>${otp}</b></h2>`
    });
    res.json({ message: 'OTP sent to email!' });
  } catch (err) {
    console.error('Mailer error:', err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Verify OTP and register restaurant
router.post('/verify-otp', async (req, res) => {
  const { email, otp, name, description, password, image } = req.body;
  if (!otpStore[email] || otpStore[email] !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }
  delete otpStore[email];

  db.query('SELECT * FROM restaurants WHERE LOWER(email) = LOWER(?)', [email.trim().toLowerCase()], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error.' });
    if (results.length > 0) return res.status(400).json({ message: 'Restaurant already registered.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO restaurants (name, email, password, description, image) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, description, image || null],
      (err2, result) => {
        if (err2) {
          console.error('Insert error:', err2);
          return res.status(500).json({ message: 'Failed to register restaurant.' });
        }
        res.json({ message: 'OTP verified and restaurant registered successfully!' });
      }
    );
  });
});

module.exports = router;