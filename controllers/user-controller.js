const User = require("../models/User");
const bcrypt = require("bcryptjs");

async function home(req, res) {
  res.render("home", { username: req.session.username });
}

async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || bcrypt.compareSync(password, user.password)) {
      return res.render("login", { error: "Invalid username or password" });
    }

    req.session.userId = user._id;
    req.session.username = user.username;

    res.redirect("/");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
}

function logout(req, res) {
  req.session.destroy(() => {
    res.redirect("/login");
  });
}

module.exports = { home, login, logout };
