const db = require('../config/db');
const bcrypt = require('bcrypt');
const transporter = require('../config/mailer'); // Use the shared mailer

const otpStore = {};

exports.sendBuyerOtp = (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required.' });

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

  transporter.sendMail({
    from: 'shanisipra428@gmail.com',
    to: email,
    subject: 'Your OTP for FoodApp Signup',
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
  }, (err) => {
    if (err) {
      console.error('Failed to send OTP:', err);
      return res.status(500).json({ message: 'Failed to send OTP.' });
    }
    res.json({ message: 'OTP sent.' });
  });
};

exports.verifyBuyerOtpAndSignup = (req, res) => {
  const { name, email, password, otp } = req.body;
  if (!name || !email || !password || !otp)
    return res.status(400).json({ message: 'All fields required.' });

  const record = otpStore[email];
  if (!record || Date.now() > record.expires)
    return res.status(400).json({ message: 'OTP expired or not found.' });

  if (parseInt(otp) !== record.otp)
    return res.status(400).json({ message: 'Invalid OTP.' });

  db.query('SELECT * FROM buyers WHERE LOWER(email) = LOWER(?)', [email.trim().toLowerCase()], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error.' });
    if (results.length > 0) return res.status(400).json({ message: 'Email already registered.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO buyers (name, email, password) VALUES (?, ?, ?)',
      [name, email.trim().toLowerCase(), hashedPassword],
      (err2, result) => {
        if (err2) return res.status(500).json({ message: 'Signup failed.' });
        delete otpStore[email];
        res.status(201).json({ message: 'Signup successful!', buyerId: result.insertId, name, email });
      }
    );
  });
};

exports.buyerSignin = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required.' });

  db.query('SELECT * FROM buyers WHERE LOWER(email) = LOWER(?)', [email.trim().toLowerCase()], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error.' });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials.' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

    res.status(200).json({
      message: 'Login successful',
      buyer: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  });
};