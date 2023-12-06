const express = require("express");
const mongoose = require("mongoose");
const handlebars = require("express-handlebars");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const helmet = require("helmet");
const dotenv = require("dotenv");
const https = require("https");
const fs = require("fs");
const path = require('path');

// Load environment variables from a .env file
dotenv.config();

const app = express();

// Enable secure headers with Helmet middleware
app.use(helmet());

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

// Middleware for handling cookies
app.use(cookieParser());

// Setup session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Setup Handlebars as the template engine
app.engine(".hbs", handlebars.engine({ defaultLayout: "main", extname: '.hbs' }));
app.set("view engine", "hbs");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

// Simple User model for demonstration
const User = mongoose.model("User", {
  username: String,
  password: String,
});

// Dummy data to initialize the database
const initialData = [
  { username: "user1", password: "password1" },
  { username: "user2", password: "password2" },
];

// Initialize the database with dummy data
db.once("open", async () => {
  try {
    await User.deleteMany({});
    await User.create(initialData);
    console.log("Database initialized with dummy data.");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
});

// Middleware to check if a user is authenticated
const authenticateUser = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  next();
};

// Routes

// Home route
app.get("/", authenticateUser, (req, res) => {
  res.render("home", { username: req.session.username });
});

// Login route
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.render("login", { error: "Invalid username or password" });
    }

    req.session.userId = user._id;
    req.session.username = user.username;

    res.redirect("/");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// Start the server
const port = process.env.PORT || 3000;

// Create an HTTPS server
// const server = http.createServer(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
