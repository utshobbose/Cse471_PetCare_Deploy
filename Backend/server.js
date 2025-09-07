require('dotenv').config()
const express = require('express');
const connectDB = require('./config/db');
const cors = require("cors");
const stripSlash = (url) => (url ? url.replace(/\/+$/, '') : url);
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/ProductRoutes');
// const galleryRoutes = require('./routes/galleryRoutes');
//const profileRoutes = require('./routes/profileRoutes');
const cartRoute = require('./routes/cartRoute');
//const orderRoutes = require('./routes/orderRoutes');
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

const allowed = new Set([
  stripSlash(process.env.CLIENT_ORIGIN), // prod Vercel origin
  'http://localhost:5173',               // local dev
]);

console.log('CORS allow origin:', stripSlash(process.env.CLIENT_ORIGIN));

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);      // allow non-browser clients
    const o = stripSlash(origin);
    if (allowed.has(o)) return cb(null, true);
    return cb(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
}));

// make sure preflights succeed
app.options('*', cors());

// parse JSON (you had this commented out — you need it!)
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
// app.use('/pets', profileRoutes);

// console.log('loading authRoutes');
// const authRoutes = require('./routes/authRoutes');
// console.log('loaded authRoutes');

// console.log('loading productRoutes');
// const productRoutes = require('./routes/ProductRoutes');
// console.log('loaded productRoutes');

// console.log('loading cartRoute');
// const cartRoute = require('./routes/cartRoute');
// console.log('loaded cartRoute');

// console.log('loading paymentRoutes');
// const paymentRoutes = require('./routes/paymentRoutes');
// console.log('loaded paymentRoutes');

// console.log('loading profileRoutes');
// const profileRoutes = require('./routes/profileRoutes');
// console.log('loaded profileRoutes');


//app.get('/', (req, res) => res.send('OK'));

// Test route
app.get('/', (req, res) => {
  res.send('PetCare Management System Backend is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});