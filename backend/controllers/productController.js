const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const { json } = require("express");
const { uploadSingleImage } = require("../utils/upload");
const mongoose = require("mongoose");
const algoliasearch = require("algoliasearch");
const User = require("../models/userModel");
const Customer = require("../models/customerModel");

// Create Product (handle image upload as well)
const createProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, countInStock, certifications } =
      req.body;

    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const image = req.file.path; // ✅ Cloudinary URL
    const imagePublicId = req.file.filename; // ✅ Cloudinary public_id

    if (!name || !description || !price || !countInStock || !image) {
      return res
        .status(400)
        .json({
          error:
            "All fields (name, description, price, image, etc.) are required",
        });
    }

    // Get seller ID from authenticated user
    const sellerId = req.user._id;

    // Create a new product
    const newProduct = new Product({
      name,
      image, // ✅ Cloudinary URL
      imagePublicId, // ✅ Save Cloudinary public_id
      description,
      price,
      countInStock,
      category,
      seller: sellerId,
      certifications: certifications || [],
    });

    // Save the product to the database
    await newProduct.save();

    // Respond with success
    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;

    // Fetch the product from the database
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Log incoming request data for debugging
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    // Extract fields from the request body
    const { name, description, price, category, countInStock, certifications } =
      req.body;

    // Update product fields if provided
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock;
    product.certifications = certifications || product.certifications;

    // Update the image only if a new file is uploaded
    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    // Save the updated product
    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: error.message });
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const getProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);

    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.log(error);
    res.json(`Error when getting products : ${error}`);
  }
});

const getProductById = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(400).json({ message: "Product not = found" });
    }

    return res.json(product);
  } catch (error) {
    console.log(error);
    res.json(`Error when getting product : ${error}`);
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.log(error);
    res.json(`Error when getting products : ${error}`);
  }
});

// const getProductsBySeller = asyncHandler(async (req, res) => {
//     try {
//         console.log("In getProductsBySeller function");

//       // Convert req.user._id to ObjectId if it's a string
//       const userId = mongoose.Types.ObjectId(req.user._id);

//       // Log to check if the ID is valid
//       console.log("User ID as ObjectId:", userId);

//       const products = await Product.find({ seller: userId });
//       console.log("Products found:", products);

//       res.json(products);
//     } catch (error) {
//       console.log(error);
//       res.json(`Error when getting products : ${error}`);
//     }
//   });

const getProductsBySeller = asyncHandler(async (req, res) => {
  try {
    console.log(req.user._id);
    const products = await Product.find({ seller: req.user._id });
    res.json(products);
  } catch (error) {
    console.log(error);
    res.json(`Error when getting products : ${error}`);
  }
});

const getProductsByCategory = asyncHandler(async (req, res) => {
  try {
    const { category, excludeProductId } = req.params; // Get category and product ID to exclude
    console.log(
      `Category: ${category}, Exclude Product ID: ${excludeProductId}`
    );

    // Find all products that match the specified category but exclude the specified product
    const products = await Product.find({
      category,
      _id: { $ne: excludeProductId }, // Exclude the product with the given ID
    });

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for the given category." });
    }

    res.json(products);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: `Error when getting products by category: ${error.message}`,
      });
  }
});

const createReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const review = {
        name: req.user.firstName,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };
    }

    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({ message: "Review Added" });
  } catch (error) {
    console.log(error);
    res.json(`Error when creating reviews : ${error}`);
  }
});

const getTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

const getNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const getFilteredProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;
    console.log("Checked:", checked);
    console.log("Radio:", radio);

    //an empty object
    let args = {};
    //single line if statements, basically like the normal one
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const getFavorites = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const customer = await Customer.findOne({ user: req.user._id });

    if (!user || !customer) {
      return res.status(404).json({ message: "User or customer not found" });
    }

    const favoriteProducts = await Product.find({
      _id: { $in: customer.favorites },
    });

    return res.status(200).json(favoriteProducts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

const addToFavorites = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;
    const trimmedProductId = productId.trim();

    // For debugging:
    console.log("Raw productId:", JSON.stringify(productId));
    console.log("Trimmed productId:", JSON.stringify(trimmedProductId));

    const user = await User.findById(req.user._id);
    const customer = await Customer.findOne({ user: req.user._id });

    if (!user || !customer) {
      return res.status(404).json({ message: "User or customer not found" });
    }

    const product = await Product.findById(trimmedProductId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Use trimmedProductId for 'includes' check
    if (customer.favorites.includes(trimmedProductId)) {
      return res
        .status(400)
        .json({ message: "Product is already in your favorites" });
    }

    // Use trimmedProductId for pushing
    customer.favorites.push(trimmedProductId);
    await customer.save();

    return res.status(200).json({
      message: "Product added to favorites",
      favorites: customer.favorites,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

const removeFromFavorites = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;
    const trimmedProductId = productId.trim();

    const user = await User.findById(req.user._id);
    const customer = await Customer.findOne({ user: req.user._id });

    if (!user || !customer) {
      return res.status(404).json({ message: "User or customer not found" });
    }

    const product = await Product.findById(trimmedProductId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!customer.favorites.includes(trimmedProductId)) {
      return res
        .status(400)
        .json({ message: "Product is not in your favorites" });
    }

    customer.favorites.pull(trimmedProductId);

    await customer.save();

    return res.status(200).json({
      message: "Product removed from favorites",
      favorites: customer.favorites,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = {
  createProduct,
  updateProduct,
  removeProduct,
  getProducts,
  getProductById,
  getAllProducts,
  createReview,
  getTopProducts,
  getNewProducts,
  getProductsBySeller,
  getFilteredProducts,
  addToFavorites,
  getProductsByCategory,
  removeFromFavorites,
  getFavorites,
};
