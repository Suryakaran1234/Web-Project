const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authenticate");
const { login, logout, home } = require("../controllers/user-controller");
const { getAllRestaurants } = require("../controllers/restaurant-controller");
const { Restaurant } = require("../models/Restaurant");

router.get("/", authenticateUser, home);
router.get("/login", (req, res) => res.render("login"));
router.post("/login", login);
router.get("/logout", logout);

// Route: POST /api/restaurants
router.post("/api/restaurants", async (req, res) => {
  try {
    const newRestaurant = req.body;
    const createdRestaurant = await Restaurant.create(newRestaurant);
    res.status(201).json(createdRestaurant);
  } catch (error) {
    console.error("Error adding a new restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route: GET /api/restaurants
router.get("/api/restaurants", async (req, res) => {
  try {
    const { page, perPage, borough } = req.query;
    const restaurants = await getAllRestaurants(page, perPage, borough);

    console.log(restaurants);
    res.json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route: GET /api/restaurants/:id
router.get("/api/restaurants/:id", async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.json(restaurant);
  } catch (error) {
    console.error("Error fetching a restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route: PUT /api/restaurants/:id
router.put("/api/restaurants/:id", async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const updatedRestaurantData = req.body;

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      updatedRestaurantData,
      { new: true } // Return the updated document
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.json(updatedRestaurant);
  } catch (error) {
    console.error("Error updating a restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route: DELETE /api/restaurants/:id
router.delete("/api/restaurants/:id", async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const deletedRestaurant = await Restaurant.findByIdAndDelete(restaurantId);

    if (!deletedRestaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    console.error("Error deleting a restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
