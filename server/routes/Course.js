// Import the required modules
const express = require("express");
const router = express.Router();

// Import the Course Controllers
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  getInstructorCourses,
  deleteCourse,
} = require("../controllers/Course");

// Import the Category Controllers
const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} = require("../controllers/Category");

// Import the Section Controllers
const {
  createLecture
} = require("../controllers/Lecture");

// Importing Middlewares
const {
  auth,
  isInstructor,
  isAdmin,
} = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Create a new course (Only for instructors)
router.post("/createCourse", auth, isInstructor, createCourse);

// Add a new lecture to a course (Only for instructors)
router.post("/addLecture", auth, isInstructor, createLecture);

// Get all courses under a specific instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);

// Get all registered courses
router.get("/getAllCourses", getAllCourses);

// Get details for a specific course
router.post("/getCourseDetails", getCourseDetails);

// Get full details for a specific course (Only for authenticated users)
router.post("/getFullCourseDetails", auth, getFullCourseDetails);

// Delete a course (Only for instructors)
router.delete("/deleteCourse", auth, isInstructor, deleteCourse);

// ********************************************************************************************************
//                                      Category routes
// ********************************************************************************************************

// Create a new category (Only for admin)
router.post("/createCategory", auth, isAdmin, createCategory);

// Show all categories
router.get("/showAllCategories", showAllCategories);

// Get category page details
router.post("/getCategoryPageDetails", categoryPageDetails);

module.exports = router;
