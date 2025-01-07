const mongoose = require("mongoose");


const reviewSchema = mongoose.Schema(
  {
      name: { type: String, required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
  },
  { timestamps: true }
  );

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    reviews: [reviewSchema],
    certifications: [
      {
        type: String,
        required: false,
      }
    ],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    avgRating: {
        type: Number,
        required: true,
        default: 0,
        },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
      required: true,
    }, 
},{ timestamps: true }
);


module.exports = mongoose.model("Product", productSchema);
    
