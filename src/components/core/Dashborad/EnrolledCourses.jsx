import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";

export default function EnrolledCourses() {
  // Accessing the user's token from Redux store
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // State to store enrolled courses data
  const [enrolledCourses, setEnrolledCourses] = useState(null);

  // useEffect to trigger fetching of enrolled courses on component mount
  useEffect(() => {
    const getEnrolledCourses = async () => {
      try {
        const res = await getUserEnrolledCourses(token);
        setEnrolledCourses(res); // Storing the courses data in state
      } catch (error) {
        console.error("Could not fetch enrolled courses.", error);
      }
    };
    getEnrolledCourses();
  }, []);

  return (
    <div>
      <div className="text-3xl text-richblack-50 font-medium">
        Enrolled Courses
      </div>
      {/* Conditional rendering based on the courses data availability */}
      {!enrolledCourses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>{" "}
          {/* Placeholder for loading animation */}
        </div>
      ) : !enrolledCourses.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
          You have not enrolled in any course yet.
        </p>
      ) : (
        <div className="my-8 text-richblack-5">
          <div className="flex rounded-t-lg bg-richblack-500">
            {/* Table headings */}
            <p className="w-[50%] md:w-[40%] px-5 py-3">Course Name</p>
            <p className="w-[20%] md:w-1/4 px-2 py-3">Duration</p>
            <p className="w-[15%] md:w-1/4 px-2 py-3">Lectures</p>
          </div>

          {/* Mapping over each course to render its details */}
          {enrolledCourses.map((course, i, arr) => (
            <div
              className={`flex items-center border border-richblack-700 ${
                i === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
              }`}
              key={i}
            >
              {/* Navigational click handler for course detail */}
              <div
                className="flex w-[50%] md:w-[40%] cursor-pointer items-center gap-4 px-5 py-3"
                onClick={() => {
                  navigate(
                    `/view-course/${course?._id}/lecture/${course.courseContent?.[0]._id}`
                  );
                }}
              >
                <img
                  src={course.thumbnail}
                  alt="course_img"
                  className="h-14 w-14 rounded-lg object-cover"
                />
                <p className="font-semibold">{course.courseName}</p>
              </div>

              <div className="w-[20%] md:w-1/4 pl-6 py-3">
                {course?.totalDuration}
              </div>

              <div className="w-[15%] md:w-1/4 pl-8 py-3">
                {course.courseContent.length}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
