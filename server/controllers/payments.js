const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const crypto = require("crypto");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const mongoose = require("mongoose");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const {
  paymentSuccessEmail,
} = require("../mail/templates/paymentSuccessEmail");

// Capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;

  try {
    // Validate if courses array is provided
    if (!courses || courses.length === 0) {
      return res.json({ success: false, message: "Please Provide Course ID" });
    }

    let totalAmount = 0;

    // Iterate over each course to calculate total amount
    for (const courseId of courses) {
      try {
        // Find the course by its ID
        let course = await Course.findById(courseId);

        // If the course is not found, return an error
        if (!course) {
          return res
            .status(404)
            .json({ success: false, message: "Could not find the Course" });
        }

        // Check if the user is already enrolled in the course
        const uid = new mongoose.Types.ObjectId(userId);
        if (course.studentsEnrolled.includes(uid)) {
          return res
            .status(400)
            .json({ success: false, message: "Student is already Enrolled" });
        }

        // Add the price of the course to the total amount
        totalAmount += course.price;
      } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
      }
    }

    // Configure payment options
    const options = {
      amount: totalAmount * 100, // Amount in smallest currency unit (e.g., paise for INR)
      currency: "INR",
      receipt: Math.random(Date.now()).toString(), // Generate a random receipt ID
    };

    // Initiate the payment using Razorpay
    const paymentResponse = await instance.orders.create(options);

    // Send success response with payment data
    res.json({
      success: true,
      data: paymentResponse,
    });
  } catch (error) {
    console.log(error);
    // Send error response if there's an issue with payment initiation
    res
      .status(500)
      .json({ success: false, message: "Could not initiate order." });
  }
};

// Verify the payment and enroll the user in courses
exports.verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    courses,
  } = req.body;
  const userId = req.user.id;

  try {
    // Validate input
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !courses ||
      !userId
    ) {
      throw new Error("Invalid request parameters");
    }

    // Verify Razorpay signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");
    if (expectedSignature !== razorpay_signature) {
      throw new Error("Invalid Razorpay signature");
    }

    // Enroll user in courses
    await enrollStudents(courses, userId);

    // Send success response
    res.status(200).json({ success: true, message: "Payment verified" });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Enroll the user in the specified courses
const enrollStudents = async (courses, userId, res) => {
  // Check if courses and userId are provided
  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please Provide Course ID and User ID",
    });
  }

  // Iterate over each courseId provided
  for (const courseId of courses) {
    try {
      // Find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      // If the course is not found, return a 500 status with an error message
      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, error: "Course not found" });
      }

      // Find the student and add the course to their list of enrolled courses
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
          },
        },
        { new: true }
      );

      // Send an email notification to the enrolled student
      await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      );
    } catch (error) {
      // If any error occurs, log the error and return a 400 status with the error message
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  }
};

// Send payment success email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;
  const userId = req.user.id;

  try {
    // Validate input
    if (!orderId || !paymentId || !amount || !userId) {
      throw new Error("Missing required fields");
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Send payment success email
    await mailSender(
      user.email,
      "Payment Received",
      paymentSuccessEmail(
        `${user.firstName} ${user.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );

    // Send success response
    res
      .status(200)
      .json({ success: true, message: "Payment success email sent" });
  } catch (error) {
    console.error("Error sending payment success email:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
