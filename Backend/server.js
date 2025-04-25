const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

require('./config/db');

const restaurantRoutes = require('./routes/restaurantRoutes');
const menuRoutes = require('./routes/menuRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes);

app.listen(3000, () => console.log('🚀 Server running at http://localhost:3000'));
