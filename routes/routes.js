const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authenticate");
const { login, logout, home } = require("../controllers/user-controller");

router.get("/", authenticateUser, home);
router.get("/login", (req, res) => res.render("login"));
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;
