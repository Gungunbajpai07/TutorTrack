const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Register new tutor
router.post("/register", authController.register);

// Login tutor
router.post("/login", authController.login);

// Get current tutor
router.get("/me", authMiddleware, authController.me);

module.exports = router;

