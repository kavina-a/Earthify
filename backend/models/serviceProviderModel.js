const mongoose = require('mongoose');

const ServiceProviderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User collection
    ref: 'User',
    required: true,
  },
  businessName: {
    type: String,
    required: true,
    trim: true,
  },
  businessLocation: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String, // URL or file path for the image
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true,
    match: [/^\d{10,15}$/, 'Invalid phone number format'], // Example regex for validation
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // Reference to a separate Product model
    },
  ],
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ServiceProvider', ServiceProviderSchema);