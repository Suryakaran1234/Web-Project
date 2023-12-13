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
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const app = express();

// Connect to the database
connectToDatabase()
  .then(() => {
    // Initialize the Restaurant model
    initializeRestaurantModel();
  })
  .catch((err) => console.log(err));

// Use method-override middleware
app.use(methodOverride('_method'));

// All the middlewares
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

handlebarsSetup.setup(app);
sessionSetup.setup(app);

app.use("/", routes);

module.exports = app;
