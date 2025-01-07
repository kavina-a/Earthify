const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require("../models/userModel.js");

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/earthify');

// Create Admin User
const createAdmin = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin', salt);
    const admin = new User({
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin',
    });

    await admin.save();
    console.log('Admin user created successfully!');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error creating admin user:', error);
    mongoose.disconnect();
  }
};

createAdmin();