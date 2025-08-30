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

// || 'http://localhost:5173'
// app.use(
//   cors({
//     origin: process.env.CLIENT_ORIGIN ,
//     credentials: true,
//   })
// );
// app.use(express.json());

const allowlist = [
  process.env.CLIENT_ORIGIN,        // prod vercel url
  'http://localhost:5173',          // local vite dev
];
console.log('CORS allow origin:', process.env.CLIENT_ORIGIN);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // allow curl, mobile apps, etc.
    if (allowlist.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));


app.options('*', cors());


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