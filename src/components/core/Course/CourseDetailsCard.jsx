import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../../slices/cartSlice";
import { ACCOUNT_TYPE } from "../../../utils/constants";

function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Destructure necessary properties from the course object
  const {
    thumbnail: ThumbnailImage,
    price: CurrentPrice,
    _id: courseId,
    studentsEnrolled,
    courseName,
  } = course;

  // Function to handle adding the course to the cart
  const handleAddToCart = () => {
    // Check if the user is an instructor
    if (user && user.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.");
      return;
    }
    // Check if the user is logged in
    if (token) {
      dispatch(addToCart(course));
      return;
    }
    // Show a confirmation modal if the user is not logged in
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add to Cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  // Check if the user is enrolled in the course
  const isEnrolled = user && studentsEnrolled.includes(user._id);

  return (
    <div className="flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5">
      {/* Course Image */}
      <img
        src={ThumbnailImage}
        alt={courseName}
        className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
      />
      <div className="px-4">
        <div className="space-x-3 pb-4 text-3xl font-semibold">
          Rs. {CurrentPrice}
        </div>
        <div className="flex flex-col gap-4">
          <button
            className="yellowButton"
            onClick={
              isEnrolled
                ? () => navigate("/dashboard/enrolled-courses")
                : handleBuyCourse
            }
          >
            {isEnrolled ? "Go To Course" : "Buy Now"}
          </button>
          {!isEnrolled && (
            <button onClick={handleAddToCart} className="blackButton">
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseDetailsCard;
