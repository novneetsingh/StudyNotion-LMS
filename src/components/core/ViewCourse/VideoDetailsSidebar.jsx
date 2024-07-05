import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

export default function VideoDetailsSidebar() {
  // State to keep track of the currently active lecture
  const [activeLecture, setActiveLecture] = useState(null);
  // Hook to navigate programmatically
  const navigate = useNavigate();
  // Hook to get the current location
  const location = useLocation();
  // Get the lectureId from the URL parameters
  const { lectureId } = useParams();
  // Get course content and entire course data from the Redux store
  const { courseContent, courseEntireData } = useSelector(
    (state) => state.viewCourse
  );

  useEffect(() => {
    // Return early if course content is not loaded
    if (!courseContent.length) return;
    // Find the index of the current lecture based on the lectureId
    const currentLectureIndex = courseContent.findIndex(
      (lecture) => lecture._id === lectureId
    );
    // Get the ID of the active lecture
    const activeLectureId = courseContent[currentLectureIndex]?._id;
    // Set the active lecture state
    setActiveLecture(activeLectureId);
  }, [courseContent, location.pathname]); // Dependency array to re-run the effect when course content or location changes

  return (
    <aside className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
      <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
        <div className="flex w-full items-center justify-between">
          <div
            onClick={() => {
              navigate(`/dashboard/enrolled-courses`); // Navigate to the enrolled courses page
            }}
            className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
            title="Back"
          >
            <IoIosArrowBack size={30} /> {/* Back button icon */}
          </div>
        </div>
        <div className="flex flex-col">
          <p>{courseEntireData?.courseName}</p> {/* Display course name */}
        </div>
      </div>
      <div className="h-[calc(100vh - 5rem)] overflow-y-auto text-richblack-5">
        {courseContent.map((lecture, index) => (
          <div
            className={`flex gap-3 px-5 py-2 ${
              activeLecture === lecture._id
                ? "bg-yellow-200 font-semibold text-richblack-800" // Highlight active lecture
                : "hover:bg-richblack-900" // Highlight on hover
            }`}
            key={index}
            onClick={() => {
              navigate(
                `/view-course/${courseEntireData?._id}/lecture/${lecture?._id}`
              ); // Navigate to the selected lecture
              setActiveLecture(lecture._id); // Set the active lecture state
            }}
          >
            <div>{lecture.title}</div> {/* Display lecture title */}
          </div>
        ))}
      </div>
    </aside>
  );
}
