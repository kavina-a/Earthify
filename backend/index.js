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

// Define allowed origins
const allowedOrigins = [
    'https://earthifyy.vercel.app', // Frontend production domain
    'http://localhost:3000',       // Frontend development domain
];

// Apply CORS middleware
app.use(cors({
    origin: '*', // Specify allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
    credentials: true, // Allow credentials (e.g., cookies)
}));

// Handle preflight requests
app.options('*', cors());

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