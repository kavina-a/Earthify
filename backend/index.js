// Packages
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes.js');
const categoryRoutes = require('./routes/categoryRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const stripeRoute = require('./routes/stripeRoute.js');
const sellerRoutes = require('./routes/sellerRoutes.js');

// Utilities
const connectDB = require('./config/db.js');
dotenv.config();

// Create Express app
const app = express();

const allowedOrigins = [
    'https://earthifyy.vercel.app',
    'https://teal-taffy-af2df9.netlify.app', 
    'http://localhost:5173' // for dev
  ]
  
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS: ' + origin))
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
  }))
  
  // Preflight
  app.options('*', cors())
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to the database
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/stripe", stripeRoute);
app.use("/api/seller", sellerRoutes);

// Serve static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Root route
app.get('/', (req, res) => {
    res.send('API is running');
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});