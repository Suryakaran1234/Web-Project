const session = require("express-session");
const dotenv = require("dotenv");

dotenv.config();

function setup(app) {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );
}

module.exports = { setup };
