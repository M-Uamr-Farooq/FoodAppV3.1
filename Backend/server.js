const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

require('./config/db');

const restaurantRoutes = require('./routes/restaurantRoutes');
const menuRoutes = require('./routes/menuRoutes'); // <-- Add this line
const buyerAuthRoutes = require('./routes/buyerAuthRoutes');
const restaurantAuthRoutes = require('./routes/restaurantAuthRoutes');
const otpRoutes = require('./routes/otpRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes); // <-- Add this line
app.use('/api', buyerAuthRoutes);
app.use('/api', restaurantAuthRoutes);
app.use('/api', otpRoutes);

app.listen(3000, () => console.log('🚀 Server running at http://localhost:3000'));
