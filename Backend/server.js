const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Shani786',
    database: 'foodDB',
});

db.connect((err) => {
    if (err) throw err;
    console.log('✅ Connected to MySQL');
});

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
    console.log('✅ Restaurant table ready');
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shanisipra428@gmail.com',
        pass: 'oaqf rwba qrkj isxb',
    },
});

const otpStore = {};

app.post('/api/send-otp', (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiry = Date.now() + 60 * 1000;
    otpStore[email.trim()] = { otp, expiry };

    transporter.sendMail({
        from: 'shanisipra428@gmail.com',
        to: email,
        subject: 'Your OTP for Restaurant Registration',
        text: `Your OTP is ${otp}. It is valid for 1 minute.`,
    }, (error) => {
        if (error) return res.status(500).json({ message: 'Failed to send OTP.' });
        res.status(200).json({ message: 'OTP sent successfully!' });
    });
});

app.post('/api/verify-otp', (req, res) => {
    const { email, otp, name, description, password } = req.body;
    const record = otpStore[email.trim()];

    if (!record) {
        return res.status(400).json({ message: 'OTP not found.' });
    }

    if (Date.now() > record.expiry) {
        delete otpStore[email.trim()];
        return res.status(400).json({ message: 'OTP expired.' });
    }

    if (parseInt(otp) === record.otp) {
        delete otpStore[email.trim()]; // Remove OTP after successful verification

        // Hash the password and store user information in the database
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).json({ message: 'Server error. Please try again later.' });
            }

            const insertQuery = `
                INSERT INTO restaurants (name, email, description, password)
                VALUES (?, ?, ?, ?)
            `;
            db.query(insertQuery, [name.trim(), email.trim(), description, hashedPassword], (err) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(400).json({ message: 'A restaurant with this name or email already exists.' });
                    }
                    console.error('Database Error:', err);
                    return res.status(500).json({ message: 'Failed to store user information.' });
                }

                res.status(200).json({ message: 'OTP verified and user information stored successfully!' });
            });
        });
    } else {
        res.status(400).json({ message: 'Invalid OTP.' });
    }
});

app.post('/api/restaurants', async (req, res) => {
    const { name, email, description, password } = req.body;

    try {
        // Check if the restaurant name already exists
        const checkNameQuery = `SELECT * FROM restaurants WHERE LOWER(name) = LOWER(?)`;
        db.query(checkNameQuery, [name.trim()], async (err, results) => {
            if (err) {
                console.error('Database Error:', err);
                return res.status(500).json({ message: 'Server error. Please try again later.' });
            }

            if (results.length > 0) {
                return res.status(400).json({ message: 'A restaurant with this name already exists. Please choose a different name.' });
            }

            // Hash the password and insert the new restaurant
            const hashedPassword = await bcrypt.hash(password, 10);
            const insertQuery = `INSERT INTO restaurants (name, email, description, password) VALUES (?, ?, ?, ?)`;
            db.query(insertQuery, [name.trim(), email.trim(), description, hashedPassword], (err) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(400).json({ message: 'Email already exists.' });
                    }
                    return res.status(500).json({ message: 'Registration failed.' });
                }
                res.status(201).json({ message: 'Restaurant registered successfully!' });
            });
        });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// ✅ Fixed login logic
app.post('/api/authenticate', (req, res) => {
    const { name, email, password } = req.body;

    const sql = `SELECT * FROM restaurants WHERE LOWER(name) = LOWER(?) AND LOWER(email) = LOWER(?)`;
    db.query(sql, [name.trim(), email.trim()], async (err, results) => {
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
});

app.get('/api/restaurants/:name', (req, res) => {
    const { name } = req.params;
    const sql = `SELECT name, email, description, image FROM restaurants WHERE name = ?`;
    db.query(sql, [name], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching profile.' });
        if (results.length === 0) return res.status(404).json({ message: 'Restaurant not found.' });
        res.status(200).json(results[0]);
    });
});

app.listen(3000, () => console.log('🚀 Server running at http://localhost:3000'));
