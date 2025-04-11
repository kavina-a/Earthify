const mongoose = require("mongoose");
const Product = require("../models/productModel"); // Adjust the path if needed
const Category = require("../models/categoryModel"); // Adjust the path if needed
const ServiceProvider = require("../models/serviceProviderModel"); // Adjust the path if needed

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/earthify", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create Products
const seedProducts = async () => {
  try {
    // Fetch or create necessary categories and sellers
    const categories = await Category.find();
    const sellers = await ServiceProvider.find();

    if (categories.length === 0 || sellers.length === 0) {
      console.log("Please add categories and sellers to the database first!");
      mongoose.disconnect();
      return;
    }

    // Clear existing products
    await Product.deleteMany();
    console.log("Existing products deleted.");

    // Sample products
    const products = [
      {
        name: "Eco-Friendly Water Bottle",
        image: "/images/bottle.jpg",
        category: categories[0]._id,
        description: "A reusable water bottle made from sustainable materials.",
        price: 20,
        countInStock: 50,
        certifications: ["BPA-Free", "Recyclable"],
        rating: 4.5,
        numReviews: 2,
        avgRating: 4.5,
        reviews: [
          {
            name: "John Doe",
            rating: 5,
            comment: "Absolutely love this bottle!",
          },
          {
            name: "Jane Smith",
            rating: 4,
            comment: "Great quality, but could be bigger.",
          },
        ],
        seller: sellers[0]._id,
      },
      {
        name: "Organic Cotton T-Shirt",
        image: "/images/tshirt.jpg",
        category: categories[1]._id,
        description: "A comfortable t-shirt made from 100% organic cotton.",
        price: 30,
        countInStock: 30,
        certifications: ["GOTS Certified"],
        rating: 4.8,
        numReviews: 3,
        avgRating: 4.8,
        reviews: [
          {
            name: "Alice Brown",
            rating: 5,
            comment: "Soft and comfortable. Highly recommend!",
          },
          {
            name: "Bob White",
            rating: 5,
            comment: "Fantastic quality and eco-friendly.",
          },
          {
            name: "Tom Green",
            rating: 4,
            comment: "A bit pricey, but worth it.",
          },
        ],
        seller: sellers[1]._id,
      },
      {
        name: "Bamboo Toothbrush",
        image: "/images/toothbrush.jpg",
        category: categories[0]._id,
        description: "An eco-friendly toothbrush made from bamboo.",
        price: 5,
        countInStock: 100,
        certifications: ["Plastic-Free"],
        rating: 4.2,
        numReviews: 1,
        avgRating: 4.2,
        reviews: [
          {
            name: "Lisa Red",
            rating: 4,
            comment: "Great toothbrush, but the bristles could be softer.",
          },
        ],
        seller: sellers[0]._id,
      },
      {
        name: "Recycled Paper Notebook",
        image: "/images/notebook.jpg",
        category: categories[0]._id,
        description: "A notebook made entirely from recycled paper.",
        price: 10,
        countInStock: 70,
        certifications: ["Recycled Materials"],
        rating: 4.7,
        numReviews: 3,
        avgRating: 4.7,
        reviews: [
          {
            name: "James Blue",
            rating: 5,
            comment: "Love the quality of this recycled paper.",
          },
          {
            name: "Evelyn Yellow",
            rating: 4,
            comment: "Great notebook, but wish it was slightly larger.",
          },
        ],
        seller: sellers[1]._id,
      },
      {
        name: "Reusable Grocery Bag",
        image: "/images/bag.jpeg",
        category: categories[1]._id,
        description:
          "A durable and reusable grocery bag made from recycled fabric.",
        price: 8,
        countInStock: 200,
        certifications: ["Recyclable", "Eco-Friendly"],
        rating: 4.6,
        numReviews: 5,
        avgRating: 4.6,
        reviews: [
          {
            name: "Anna Green",
            rating: 5,
            comment: "Perfect for grocery shopping, sturdy and reusable!",
          },
          {
            name: "Paul Red",
            rating: 4,
            comment: "Very useful and eco-friendly.",
          },
        ],
        seller: sellers[2]._id,
      },
      {
        name: "Solar-Powered Lantern",
        image: "/images/solarlantern.jpg",
        category: categories[1]._id,
        description: "A sustainable solar-powered lantern for outdoor use.",
        price: 25,
        countInStock: 40,
        certifications: ["Solar Energy"],
        rating: 4.8,
        numReviews: 4,
        avgRating: 4.8,
        reviews: [
          {
            name: "Chris Black",
            rating: 5,
            comment: "Bright and efficient, perfect for camping!",
          },
          {
            name: "Diana White",
            rating: 4,
            comment: "Works great, but took some time to charge.",
          },
        ],
        seller: sellers[0]._id,
      },
      {
        name: "Biodegradable Plant Pots",
        image: "/images/pots.jpg",
        category: categories[0]._id,
        description: "Plant pots made from biodegradable materials.",
        price: 15,
        countInStock: 80,
        certifications: ["Biodegradable"],
        rating: 4.9,
        numReviews: 6,
        avgRating: 4.9,
        reviews: [
          {
            name: "Emily Brown",
            rating: 5,
            comment: "Amazing pots, perfect for my garden!",
          },
          {
            name: "Mark Gray",
            rating: 5,
            comment: "Eco-friendly and durable.",
          },
        ],
        seller: sellers[1]._id,
      },
    ];

    // Insert products into the database
    await Product.insertMany(products);
    console.log("Products seeded successfully!");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding products:", error);
    mongoose.disconnect();
  }
};

seedProducts();
