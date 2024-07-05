const express = require("express");
const router = express.Router();

// Import controllers and middleware functions
const {
  login,
  signUp,
  sendOTP,
  changePassword,
} = require("../controllers/Auth");
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/resetPassword");
const { auth } = require("../middlewares/auth");

// Authentication Routes
router.post("/login", login); // User login route
router.post("/signup", signUp); // User signup route
router.post("/sendotp", sendOTP); // Route for sending OTP to user's email
router.post("/changepassword", auth, changePassword); // Route for changing password

// Reset Password Routes
router.post("/reset-password-token", resetPasswordToken); // Route for generating reset password token
router.post("/reset-password", resetPassword); // Route for resetting user's password after verification

module.exports = router;