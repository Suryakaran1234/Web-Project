const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  _id: Object,
  address: {
    building: String,
    coord: [Number],
    street: String,
    zipcode: String,
  },
  borough: String,
  cuisine: String,
  grades: [
    {
      date: String,
      grade: String,
      score: Number,
    },
  ],
  name: String,
  restaurant_id: String,
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = { Restaurant, restaurantSchema };
