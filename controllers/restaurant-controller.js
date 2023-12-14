const { Restaurant } = require("../models/Restaurant");

async function addNewRestaurant(data) {
  try {
    const newRestaurant = new Restaurant(data);
    await newRestaurant.save();
    console.log("New restaurant added:", newRestaurant);
    return newRestaurant.toObject();
  } catch (error) {
    console.error("Error adding new restaurant:", error);
    throw error;
  }
}
async function getAllRestaurants(page, perPage, borough) {
  try {
    // Set default values if not provided
    page = page || 1;
    perPage = perPage || 10;

    // Parse numeric values
    const pageNumber = parseInt(page, 10);
    const perPageNumber = parseInt(perPage, 10);

    // Define query conditions based on optional borough parameter
    const query = borough ? { borough } : {};

    // Calculate the skip value based on the provided page and perPage values
    const skip = (pageNumber - 1) * perPageNumber;

    // Fetch total count for pagination
    const totalCount = await Restaurant.countDocuments(query);

    // Fetch restaurants based on paging, sorting, and optional borough filter
    const restaurants = await Restaurant.find(query)
      .skip(skip)
      .limit(perPageNumber)
      .sort({ restaurant_id: 1 })
      .lean();

    // Calculate pagination information
    const totalPages = Math.ceil(totalCount / perPageNumber);
    const hasPrev = pageNumber > 1;
    const hasNext = pageNumber < totalPages;
    const prevPage = hasPrev ? pageNumber - 1 : null;
    const nextPage = hasNext ? pageNumber + 1 : null;

    console.log({
      restaurants,
      totalPages,
      hasPrev,
      hasNext,
      prevPage,
      nextPage,
    });
    return {
      restaurants,
      totalPages,
      hasPrev,
      hasNext,
      prevPage,
      nextPage,
    };
  } catch (error) {
    console.error("Error fetching all restaurants:", error);
    throw error;
  }
}

async function getRestaurantById(Id) {
  try {
    const restaurant = await Restaurant.findById(Id).lean();

    if (!restaurant) {
      console.log(`Restaurant with ID ${Id} not found`);
      return null;
    }

    console.log("Restaurant found by ID:", restaurant);
    return restaurant;
  } catch (error) {
    console.error("Error fetching restaurant by ID:", error);
    throw error;
  }
}

async function updateRestaurantById(data, Id) {
  try {
    console.log(Id);
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(Id, data, {
      new: true,
    }).lean();
    if (!updatedRestaurant) {
      console.log(`Restaurant with ID ${Id} not found`);
      return null;
    }
    console.log("Restaurant updated:", updatedRestaurant);
    return updatedRestaurant;
  } catch (error) {
    console.error("Error updating restaurant by ID:", error);
    throw error;
  }
}

async function deleteRestaurantById(Id) {
  try {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(Id).lean();
    if (!deletedRestaurant) {
      console.log(`Restaurant with ID ${Id} not found`);
      return null;
    }
    console.log("Restaurant deleted:", deletedRestaurant);
    return deletedRestaurant;
  } catch (error) {
    console.error("Error deleting restaurant by ID:", error);
    throw error;
  }
}

module.exports = {
  addNewRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurantById,
  deleteRestaurantById,
};
