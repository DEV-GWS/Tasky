const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  verifyToken
} = require("../controllers/authController");

router.get("/verify", protect, verifyToken);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;