import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI";
import CoursesTable from "./InstructorCourses/CoursesTable";

export default function MyCourses() {
  // Get the authentication token from Redux store
  const { token } = useSelector((state) => state.auth);

  // State to store the list of courses
  const [courses, setCourses] = useState([]);

  // Fetch the instructor's courses when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      // Fetch courses from the API
      const result = await fetchInstructorCourses(token);
      if (result) {
        // Update the courses state if the fetch is successful
        setCourses(result);
      }
    };
    fetchCourses();
  }, [token]); // Ensure `token` is included in the dependency array

  return (
    <div>
      {/* Header section with title and Add Course button */}
      <div className="mb-14 flex items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>
      </div>
      {courses && <CoursesTable courses={courses} setCourses={setCourses} />}
    </div>
  );
}
