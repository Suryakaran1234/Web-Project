const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authenticate");
const { login, logout, home } = require("../controllers/user-controller");
const {
  getAllRestaurants,
  getRestaurantById,
  addNewRestaurant,
  updateRestaurantById,
} = require("../controllers/restaurant-controller");
const { Restaurant } = require("../models/Restaurant");
const { query, validationResult } = require("express-validator");

router.get("/", authenticateUser, home);
router.get("/login", (req, res) => res.render("login"));
router.post("/login", login);
router.get("/logout", logout);

// Add New Restaurant Form
router.get("/api/restaurants/add", authenticateUser, async (req, res) => {
  try {
    res.status(201).render("restaurants/create");
  } catch (error) {
    console.error("Error adding a new restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route: POST /api/restaurants
router.post("/api/restaurants", authenticateUser, async (req, res) => {
  try {
    const newRestaurant = req.body;
    const createdRestaurant = await addNewRestaurant(newRestaurant);
    res
      .status(201)
      .render("success", {
        message: "Restaurant Added SuccessFully!",
        createdRestaurant,
      });
  } catch (error) {
    console.error("Error adding a new restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route: GET /api/restaurants
router.get(
  "/api/restaurants",

  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Destructure and parse query parameters
      const { page, perPage, borough } = req.query;
      const pageNumber = parseInt(page, 10);
      const perPageNumber = parseInt(perPage, 10);

      // Implement pagination and filtering based on parameters
      const offset = (pageNumber - 1) * perPageNumber;
      const limit = perPageNumber;
      const restaurants = await getAllRestaurants(offset, limit, borough);

      res.render("restaurants/index", { restaurants });
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      res
        .status(500)
        .json({ error: "Error fetching restaurants. Please try again later." });
    }
  }
);

// Route: GET /api/restaurants/:id
router.get("/api/restaurants/:id", authenticateUser, async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const restaurant = await getRestaurantById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.render("restaurants/show", { restaurant });
  } catch (error) {
    console.error("Error fetching a restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route: PUT /api/restaurants/:id
router.put("/api/restaurants/:id", authenticateUser, async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const updatedRestaurantData = req.body;

    const updatedRestaurant = await updateRestaurantById(restaurantId, updatedRestaurantData);

    if (!updatedRestaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.render("restaurants/show", { updatedRestaurant });
  } catch (error) {
    console.error("Error updating a restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route: DELETE /api/restaurants/:id
router.delete("/api/restaurants/:id", authenticateUser, async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const deletedRestaurant = await Restaurant.findByIdAndDelete(restaurantId);

    if (!deletedRestaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.render("success", {
      message: "Restaurant deleted successfully",
      deletedRestaurant,
    });
  } catch (error) {
    console.error("Error deleting a restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
