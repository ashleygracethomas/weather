// routes/auth.js
const express = require("express");

const router = express.Router();
const authMiddleware = require("../middleware/auth");

const authController = require("../controllers/authController");
router.post("/signup", authController.signup);
router.post("/send-otp", authController.sendOTP);
router.post("/verify-otp", authController.verifyOTP);
router.post("/login", authController.login);
router.get("/profile", authMiddleware, authController.getProfile);
router.put("/profile", authMiddleware, authController.updateProfile);

module.exports = router;
