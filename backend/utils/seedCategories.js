const mongoose = require("mongoose");
require("dotenv").config({ path: __dirname + "/../.env" });

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  image: { type: String, required: true },
});

const Category = mongoose.model("Category", categorySchema);

const categories = [
  {
    name: "Renewable Products",
    image: "../images/reusable.jpg",
  },
  {
    name: "Sustainable Agriculture",
    image: "../images/eco.jpg",
  },
  {
    name: "Eco-Friendly Products",
    image: "../images/clothes.jpeg",
  },
  {
    name: "Green Energy Conservation",
    image: "../images/greenenergy.jpg",
  },
];

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB Atlas");

    await Category.deleteMany({});
    console.log("🗑️ Existing categories deleted");

    await Category.insertMany(categories);
    console.log("🌱 Categories inserted successfully");
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
  } finally {
    mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  }
}

seedCategories();
