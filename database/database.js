const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { seedDatabase } = require("../models/seed.js");
const { restaurantSchema } = require("../models/Restaurant");

dotenv.config();

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Initialize the database with dummy data
    await seedDatabase();

    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}
async function initializeRestaurantModel() {
  // Initialize the "Restaurant" model with the "restaurant" collection
  console.log("Initializing Restaurant model");
  mongoose.model("Restaurant", restaurantSchema);
}

module.exports = { connectToDatabase, initializeRestaurantModel };
