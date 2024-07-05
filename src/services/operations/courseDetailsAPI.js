import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { courseEndpoints } from "../apis";

// Destructuring all endpoint constants from courseEndpoints
const {
  COURSE_DETAILS_API,
  COURSE_CATEGORIES_API,
  GET_ALL_COURSE_API,
  CREATE_COURSE_API,
  CREATE_LECTURE_API,
  GET_ALL_INSTRUCTOR_COURSES_API,
  DELETE_COURSE_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
} = courseEndpoints;

// Fetch all available courses
export const getAllCourses = async () => {
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("GET", GET_ALL_COURSE_API);
    if (!response?.data?.success) {
      throw new Error("Failed to fetch courses.");
    }
    return response.data.data;
  } catch (error) {
    console.error("GET_ALL_COURSE_API Error: ", error);
    toast.error(error.message);
  } finally {
    toast.dismiss(toastId);
  }
};

// Fetch details for a specific course
export const fetchCourseDetails = async (courseId) => {
  try {
    const response = await apiConnector("POST", COURSE_DETAILS_API, {
      courseId,
    });
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (error) {
    console.error("COURSE_DETAILS_API Error: ", error);
    return error.response.data;
  }
};

// Fetch all available course categories
export const fetchCourseCategories = async () => {
  try {
    const response = await apiConnector("GET", COURSE_CATEGORIES_API);
    if (!response?.data?.success) {
      throw new Error("Failed to fetch course categories.");
    }
    return response.data.data;
  } catch (error) {
    console.error("COURSE_CATEGORIES_API Error: ", error);
    toast.error(error.message);
  }
};

// Add new course details
export const addCourseDetails = async (data, token) => {
  const toastId = toast.loading("Adding course details...");
  try {
    const response = await apiConnector("POST", CREATE_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    if (!response.data.success) {
      throw new Error("Failed to add course details.");
    }
    toast.success("Course added successfully.");
    return response.data.data;
  } catch (error) {
    console.error("CREATE_COURSE_API Error: ", error);
    toast.error(error.message);
  } finally {
    toast.dismiss(toastId);
  }
};

// Create a new lecture
export const createLecture = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", CREATE_LECTURE_API, data, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Could Not Add Lecture");
    }
    toast.success("Lecture Added");
    result = response?.data?.data;
  } catch (error) {
    console.log("CREATE LECTURE API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

// Fetch all courses under a specific instructor
export const fetchInstructorCourses = async (token) => {
  let result = [];
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_INSTRUCTOR_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Instructor Courses");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("INSTRUCTOR COURSES API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

// Delete a course
export const deleteCourse = async (data, token) => {
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("DELETE", DELETE_COURSE_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Course");
    }
    toast.success("Course Deleted");
  } catch (error) {
    console.log("DELETE COURSE API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
};

// Get full details of a course
export const getFullDetailsOfCourse = async (courseId, token) => {
  const toastId = toast.loading("Loading...");
  let result = null;
  try {
    const response = await apiConnector(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      {
        courseId,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("COURSE_FULL_DETAILS_API API ERROR............", error);
    result = error.response.data;
  }
  toast.dismiss(toastId);
  return result;
};
