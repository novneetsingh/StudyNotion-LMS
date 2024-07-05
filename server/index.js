const express = require("express");
const app = express();
require("dotenv").config(); // Load environment variables from .env file
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// Import routes
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payments");

// Define port number
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(cookieParser()); // Parse cookies
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON requests

// Connect to database and cloudinary
require("./config/database").dbconnect(); // Connect to database
require("./config/cloudinary").cloudinaryConnect(); // Connect to cloudinary

// File upload middleware setup
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/", // Temporary directory for file uploads
  })
);

// Route setup
app.use("/api/v1/auth", userRoutes); // User authentication routes
app.use("/api/v1/profile", profileRoutes); // User profile routes
app.use("/api/v1/course", courseRoutes); // Course routes
app.use("/api/v1/payment", paymentRoutes); // Payment routes

// Default route
app.get("/", (req, res) => {
  res.send("<h1>Hello Hi Bye</h1>"); // Simple response for root route
});

// Activate server
app.listen(PORT, () => {
  console.log("Server is running on port", PORT); // Log server activation
});
