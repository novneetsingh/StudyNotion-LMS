import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar";
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI";
import {
  setCourseContent,
  setEntireCourseData,
} from "../slices/viewCourseSlice";

export default function ViewCourse() {
  // Get the courseId from the URL parameters
  const { courseId } = useParams();
  // Get the authentication token from the Redux store
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // Function to fetch course details
    const fetchCourseDetails = async () => {
      try {
        // Call the API to get full details of the course
        const courseData = await getFullDetailsOfCourse(courseId, token);
        // Dispatch actions to update the Redux store with course data
        dispatch(setCourseContent(courseData.courseDetails.courseContent));
        dispatch(setEntireCourseData(courseData.courseDetails));
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    // Fetch course details when component mounts or when courseId/token changes
    fetchCourseDetails();
  }, [courseId, token, dispatch]);

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
      {/* Sidebar component for video details */}
      <VideoDetailsSidebar />
      {/* Main content area */}
      <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
        <div className="mx-6">
          <Outlet /> {/* Render nested routes */}
        </div>
      </div>
    </div>
  );
}
