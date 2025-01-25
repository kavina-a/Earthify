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
// const uploadRoutes = require('./routes/uploadRoutes.js')
const orderRoutes = require('./routes/orderRoutes.js');
const stripeRoute = require('./routes/stripeRoute.js');
const sellerRoutes = require('./routes/sellerRoutes.js');

// Utilities
const connectDB = require('./config/db.js');
const { log } = console; 

dotenv.config();

const allowedOrigins = [
    'https://earthifyy.vercel.app',
    'http://localhost:5001', 
];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true, 
}));

app.options('*', cors());

const port = process.env.PORT || 5000;

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes)
// app.use("/api/uploads", uploadRoutes)
app.use("/api/order", orderRoutes);
app.use("/api/stripe", stripeRoute);
app.use("/api/seller", sellerRoutes);

// const __dirname = path.resolve();
// app.use("/uploads", express.static(path.join(__dirname + "/uploads")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get('/', (req, res) => {
    res.send('API is running');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});