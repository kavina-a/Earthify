const mongoose = require("mongoose");


const AddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
});

const customerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10,
    },
    address: { 
      type: AddressSchema,
      required: true 
    },
    preferences: {
      type: Array, 
      default: [],
    },
    ecoPoints: {
      type: Number,
      default: 0,
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',  
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);