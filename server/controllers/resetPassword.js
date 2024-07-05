const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Generate a password reset token and send reset email
exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists with the provided email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `The email ${email} is not registered with us. Please enter a valid email address.`,
      });
    }

    // Generate a random token for password reset
    const token = crypto.randomBytes(20).toString("hex");

    // Update user's token and resetPasswordExpires in the database
    await User.findOneAndUpdate(
      { email },
      {
        token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000, // Token expires in 5 minutes
      }
    );

    // Construct the password reset URL
    const url = `${process.env.FRONTEND_URL}/update-password/${token}`;

    // Send password reset email with the password reset URL
    await mailSender(
      email,
      "Password Reset",
      `Please click the following link to reset your password: ${url}`
    );

    // Return success response
    res.status(200).json({
      success: true,
      message: "Email sent successfully. Please check your inbox to continue.",
    });
  } catch (error) {
    // Return error response if any error occurs
    console.error("Error in resetPasswordToken:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while sending the reset email.",
      error: error.message,
    });
  }
};

// Reset password using the password reset token
exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match.",
      });
    }

    // Find user by token
    const user = await User.findOne({ token });

    // If no user found with the token or token expired
    if (!user || user.resetPasswordExpires < Date.now()) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    // Encrypt the new password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Update user's password in the database
    await User.findOneAndUpdate(
      { token },
      {
        password: encryptedPassword,
        token: undefined,
        resetPasswordExpires: undefined,
      }
    );

    // Return success response
    res.status(200).json({
      success: true,
      message: "Password reset successful.",
    });
  } catch (error) {
    // Return error response if any error occurs
    console.error("Error in resetPassword:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while resetting the password.",
      error: error.message,
    });
  }
};
