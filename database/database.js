const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { seedDatabase } = require("../models/seed.js");

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

module.exports = { connectToDatabase };
