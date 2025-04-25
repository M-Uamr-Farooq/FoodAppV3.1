const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());

// Increase payload size limit for body-parser
app.use(bodyParser.json({ limit: '10mb' })); // Allow up to 10MB for JSON payloads
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // Allow up to 10MB for URL-encoded payloads

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Shani786',
    database: 'foodDB',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database!');
});

// Create restaurants table
const restaurantTable = `
CREATE TABLE IF NOT EXISTS restaurants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    password VARCHAR(255) NOT NULL,
    image TEXT
)`;
db.query(restaurantTable, (err) => {
    if (err) throw err;
    console.log('restaurants Table created!');
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shanisipra428@gmail.com', // Replace with your email
        pass: 'oaqf rwba qrkj isxb', // Replace with your email password or app password
    },
});

const otpStore = {}; // Temporary in-memory store for OTPs

// Send OTP
app.post('/api/send-otp', (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
    otpStore[email] = otp;

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Your OTP for Restaurant Registration',
        text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending OTP:', error);
            return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
        }
        res.status(200).json({ message: 'OTP sent successfully!' });
    });
});

// Verify OTP
app.post('/api/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    if (otpStore[email] && otpStore[email] === parseInt(otp)) {
        delete otpStore[email]; // Remove OTP after successful verification
        res.status(200).json({ message: 'OTP verified successfully!' });
    } else {
        res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }
});

// Register a restaurant
app.post('/api/restaurants', async (req, res) => {
    const { name, email, description, password, image } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const query = `
            INSERT INTO restaurants (name, email, description, password, image)
            VALUES (?, ?, ?, ?, ?)`;
        db.query(query, [name, email, description, hashedPassword, image], (err) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: 'Email already exists. Please choose a different one.' });
                }
                console.error('Database Error:', err); // Log the error for debugging
                return res.status(500).json({ message: 'Error registering restaurant.' });
            }
            res.status(201).json({ message: 'Restaurant registered successfully!' });
        });
    } catch (error) {
        console.error('Server Error:', error); // Log the error for debugging
        res.status(500).json({ message: 'Error registering restaurant.' });
    }
});

// Authenticate a restaurant
app.post('/api/authenticate', (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM restaurants WHERE email = ?`;
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error authenticating user.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const restaurant = results[0];
        const isPasswordValid = await bcrypt.compare(password, restaurant.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        res.status(200).json({ message: 'Authentication successful!' });
    });
});

// Fetch restaurant profile by email
app.get('/api/restaurants/:email', (req, res) => {
    const { email } = req.params;
    const query = `SELECT name, email, description, image FROM restaurants WHERE email = ?`;
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching restaurant profile.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Restaurant not found.' });
        }
        res.status(200).json(results[0]); // Return the first result
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});