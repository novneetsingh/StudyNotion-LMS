const Profile = require("../models/Profile");
const Course = require("../models/Course");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const convertSecondsToDuration = require("../utils/secToDuration");

// Method for updating a user's profile
exports.updateProfile = async (req, res) => {
  try {
    // Destructure request body to extract required fields
    const { dateOfBirth, about, contactNumber, gender, firstName, lastName } =
      req.body;
    const userId = req.user.id; // Extract user ID from request

    // Find the user and their associated profile by ID
    const userDetails = await User.findById(userId);
    const profile = await Profile.findById(userDetails.additionalDetails);

    const user = await User.findByIdAndUpdate(userId, {
      firstName,
      lastName,
    });
    await user.save();

    // Update the profile fields
    profile.dateOfBirth = dateOfBirth;
    profile.about = about;
    profile.contactNumber = contactNumber;
    profile.gender = gender;

    // Save the updated profile
    await profile.save();

    // Find the updated user details
    const updatedUserDetails = await User.findById(userId)
      .populate("additionalDetails")
      .exec();

    // Return success response with updated profile
    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });
  } catch (error) {
    // Handle errors and return error response
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Method for fetching all details of the currently logged-in user
exports.getAllUserDetails = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from request
    // Find the user by ID and populate additional details
    const userDetails = await User.findById(userId)
      .populate("additionalDetails")
      .exec();
    // Return success response with user details
    return res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    // Return error response if an error occurs
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Method for updating the display picture of the currently logged-in user
exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture; // Extract display picture from request files
    const userId = req.user.id; // Extract user ID from request

    // Upload display picture to Cloudinary
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );

    // Update user's display picture
    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      { image: image.secure_url },
      { new: true }
    );

    // Return success response with updated user data
    res.send({
      success: true,
      message: `Image updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    // Return error response if an error occurs
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Method for deleting a user's account
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from request

    // Find the user by ID
    const user = await User.findById(userId);

    // If user not found, return error response
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete associated profile with the user
    await Profile.findByIdAndDelete(user.additionalDetails);

    // Remove user from enrolled courses
    for (const courseId of user.courses) {
      await Course.findByIdAndUpdate(courseId, {
        $pull: { studentsEnrolled: userId },
      });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    // Return success response
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    // Return error response if an error occurs
    return res.status(500).json({
      success: false,
      message: "User cannot be deleted successfully",
    });
  }
};

// Method for fetching enrolled courses of the currently logged-in user
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from request

    // Find user details including enrolled courses, and populate related data
    let userDetails = await User.findById(userId)
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          model: "Lecture",
        },
      })
      .exec();

    if (!userDetails) {
      // If user details not found, return error response
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userId}`,
      });
    }

    userDetails = userDetails.toObject(); // Convert user details to plain JavaScript object

    // Loop through each enrolled course
    for (let i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0;

      // Calculate total duration of the course
      for (let j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += parseInt(userDetails.courses[i].courseContent[j].timeDuration);
      }

      // Calculate total duration of the course in human-readable format
      userDetails.courses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds);
    }

    // Send success response with enrolled courses data
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    // If an error occurs, return error response
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

