require('dotenv').config()
const express = require('express');
const connectDB = require('./config/db');
const cors = require("cors");
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/ProductRoutes');
//const galleryRoutes = require('./routes/galleryRoutes');
const profileRoutes = require('./routes/profileRoutes');
const cartRoute = require('./routes/cartRoute');
// const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const PORT = process.env.PORT || 1782;


app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// Connect to MongoDB
connectDB();


// API Routes
app.use('/', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoute);
// app.use('/orders', orderRoutes);
app.use('/payment', paymentRoutes);
//app.use('/gallery', galleryRoutes);
app.use('/pets', profileRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('PetCare Management System Backend is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});