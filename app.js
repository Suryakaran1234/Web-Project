const express = require("express");
const helmet = require("helmet");
const path = require("path");
const handlebarsSetup = require("./setup/handlebars-setup");
const sessionSetup = require("./setup/session-setup");
const routes = require("./routes/routes");
const {
  connectToDatabase,
  initializeRestaurantModel,
} = require("./database/database");

const app = express();

// Connect to the database
connectToDatabase()
  .then(() => {
    // Initialize the Restaurant model
    initializeRestaurantModel();
  })
  .catch((err) => console.log(err));

// All the middlewares
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

handlebarsSetup.setup(app);
sessionSetup.setup(app);

app.use("/", routes);

module.exports = app;
