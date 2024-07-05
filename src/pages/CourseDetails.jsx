import React, { useEffect, useState } from "react";
import { HiOutlineVideoCamera } from "react-icons/hi";
import { BiInfoCircle } from "react-icons/bi";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmationModal from "../components/Common/ConfirmationModal";
import Footer from "../components/Common/Footer";
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard";
import { formatDate } from "../services/formatDate";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import { buyCourse } from "../services/operations/studentFeaturesAPI";

function CourseDetails() {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.profile);
  const { paymentLoading } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get courseId from URL parameters
  const { courseId } = useParams();

  // State to store course details and manage confirmation modal
  const [course, setCourse] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);

  useEffect(() => {
    // Fetch course details when courseId changes
    const fetchDetails = async () => {
      try {
        const res = await fetchCourseDetails(courseId);

        if (res.success) {
          setCourse(res.data.courseDetails);
        } else {
          // Handle failure to fetch course details
          console.log("Could not fetch Course Details");
        }
      } catch (error) {
        console.log("Could not fetch Course Details", error);
      }
    };

    fetchDetails();
  }, [courseId]);

  // Handle course purchase
  const handleBuyCourse = () => {
    if (token) {
      buyCourse(token, [courseId], user, navigate, dispatch);
    } else {
      setConfirmationModal({
        text1: "You are not logged in!",
        text2: "Please login to purchase the course.",
        btn1Text: "Login",
        btn2Text: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModal(null),
      });
    }
  };

  // Handle loading states
  if (loading || !course) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  // Destructure course details
  const {
    courseName,
    courseDescription,
    thumbnail,
    price,
    courseContent,
    instructor,
    studentsEnrolled,
    createdAt,
  } = course;

  // Handle payment loading state
  if (paymentLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full bg-richblack-800">
        {/* Hero Section */}
        <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative">
          <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
            <div className="relative block max-h-[30rem] lg:hidden">
              <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
              <img
                src={thumbnail}
                alt="course thumbnail"
                className="aspect-auto w-full"
              />
            </div>
            <div className="z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5">
              <div>
                <p className="text-4xl font-bold text-richblack-5 sm:text-[42px]">
                  {courseName}
                </p>
              </div>
              <p className="text-richblack-200">{courseDescription}</p>
              <div className="text-md flex flex-wrap items-center gap-2">
                <span>{`${studentsEnrolled.length} students enrolled`}</span>
              </div>
              <div>
                <p>
                  Created By {`${instructor.firstName} ${instructor.lastName}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-5 text-lg">
                <p className="flex items-center gap-2">
                  <BiInfoCircle /> Created at {formatDate(createdAt)}
                </p>
                <p className="flex items-center gap-2">
                  <HiOutlineGlobeAlt /> English
                </p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4 lg:hidden">
              <p className="space-x-3 pb-4 text-3xl font-semibold text-richblack-5">
                Rs. {price}
              </p>
              <button className="yellowButton" onClick={handleBuyCourse}>
                Buy Now
              </button>
              <button className="blackButton">Add to Cart</button>
            </div>
          </div>
          {/* Course Details Card */}
          <div className="right-[1rem] top-[120px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute lg:block">
            <CourseDetailsCard
              course={course}
              setConfirmationModal={setConfirmationModal}
              handleBuyCourse={handleBuyCourse}
            />
          </div>
        </div>
      </div>
      <div className="mx-auto box-content px-4 py-20 text-start text-richblack-5 lg:w-[1260px]">
        <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
          {/* Course Content Section */}
          <div className="max-w-[830px]">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] font-semibold">Course Content</p>
              <div className="flex flex-wrap justify-between gap-2">
                <div className="grid grid-cols-2 gap-4">
                  {courseContent.map((lecture, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-richblack-700 rounded-md"
                    >
                      <HiOutlineVideoCamera className="text-yellow-500 text-lg" />
                      <span className="text-lg">{lecture.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Author Details */}
            <div className="mb-12 pt-20">
              <p className="text-[28px] font-semibold">Author</p>
              <div className="flex items-center gap-4 py-4">
                <img
                  src={instructor.image}
                  alt="Author"
                  className="h-14 w-14 rounded-full object-cover"
                />
                <p className="text-lg">{`${instructor.firstName} ${instructor.lastName}`}</p>
              </div>
              <p className="text-richblack-50">
                {instructor?.additionalDetails?.about}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}

export default CourseDetails;
