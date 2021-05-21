const express = require('express');
const app = express();

//* 3rd Party Middlewares 
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');

//* Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

//* Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(morgan('dev'));

//* Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1', productRoutes);
app.use('/api/v1', orderRoutes);

app.get('/',(req, res) => res.send('Hello world'));


module.exports = app;