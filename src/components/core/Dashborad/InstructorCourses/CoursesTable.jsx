import { useSelector } from "react-redux";
import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../../services/formatDate";
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetailsAPI";
import ConfirmationModal from "../../../Common/ConfirmationModal";

export default function CoursesTable({ courses, setCourses }) {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);

  // Function to handle course deletion
  const handleCourseDelete = async (courseId) => {
    setLoading(true); // Set loading to true while the operation is in progress
    await deleteCourse({ courseId: courseId }, token); // Call API to delete the course
    const result = await fetchInstructorCourses(token); // Fetch the updated list of courses
    if (result) {
      setCourses(result); // Update the courses state with the new list
    }
    setConfirmationModal(null); // Close the confirmation modal
    setLoading(false); // Set loading to false after the operation is complete
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full rounded-xl border border-richblack-800 bg-richblack-900 text-left">
        <thead>
          <tr className=" text-richblack-100">
            <th className="px-6 py-4 text-sm font-medium uppercase">Courses</th>
            <th className="px-6 py-4 text-sm font-medium uppercase">
              No. of Lectures
            </th>
            <th className="px-6 py-4 text-sm font-medium uppercase">Price</th>
            <th className="px-6 py-4 text-sm font-medium uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses?.length === 0 ? (
            <tr>
              <td
                className="py-10 text-center text-2xl font-medium text-richblack-100"
                colSpan="4"
              >
                No courses found
              </td>
            </tr>
          ) : (
            courses?.map((course) => (
              <tr
                key={course._id}
                className="border-b border-richblack-800 bg-richblack-800 text-richblack-100 hover:bg-richblack-700"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {/* Course Thumbnail */}
                    <img
                      src={course?.thumbnail}
                      alt={course?.courseName}
                      className="h-[148px] w-[220px] object-cover rounded-xl mr-4"
                    />
                    <div className="flex flex-col justify-between">
                      {/* Course Name */}
                      <p className="text-xl font-semibold">
                        {course.courseName}
                      </p>
                      {/* Truncated Course Description */}
                      <p className="text-xs text-richblack-300 line-clamp-2">
                        {course.courseDescription}
                      </p>
                      {/* Creation Date */}
                      <p className="text-[12px] text-white">
                        Created: {formatDate(course.createdAt)}
                      </p>
                    </div>
                  </div>
                </td>
                {/* Number of Lectures */}
                <td className="pl-20 text-sm font-medium">
                  {course.courseContent.length}
                </td>
                {/* Course Price */}
                <td className="px-6 py-4 text-sm font-medium">
                  ₹{course.price}
                </td>
                {/* Actions: Delete */}
                <td className="pl-10 py-4 text-sm font-medium">
                  <button
                    disabled={loading}
                    onClick={() => {
                      setConfirmationModal({
                        text1: "Do you want to delete this course?",
                        text2:
                          "All the data related to this course will be deleted",
                        btn1Text: !loading ? "Delete" : "Loading...",
                        btn2Text: "Cancel",
                        btn1Handler: !loading
                          ? () => handleCourseDelete(course._id)
                          : () => {},
                        btn2Handler: !loading
                          ? () => setConfirmationModal(null)
                          : () => {},
                      });
                    }}
                    title="Delete"
                    className="transition-all duration-200 hover:scale-110 hover:text-red-500"
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Confirmation Modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
}
