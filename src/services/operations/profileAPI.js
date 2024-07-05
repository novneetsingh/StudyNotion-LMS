import { toast } from "react-hot-toast";
import { setLoading, setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiconnector";
import { profileEndpoints } from "../apis";
import { logout } from "./authAPI";

const {
  GET_USER_DETAILS_API,
  GET_USER_ENROLLED_COURSES_API,
  GET_INSTRUCTOR_DATA_API,
} = profileEndpoints;

//  Fetch user details from the server and update the Redux store.
export function getUserDetails(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      // Make API call to get user details
      const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
        Authorization: `Bearer ${token}`,
      });

      // Check if the response is successful
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Dispatch user details to Redux store
      const userImage = response.data.data.image;
      dispatch(setUser({ ...response.data.data, image: userImage }));
    } catch (error) {
      // If an error occurs, log out the user and show an error toast
      dispatch(logout(navigate));
      console.log("GET_USER_DETAILS API ERROR............", error);
      toast.error("Could Not Get User Details");
    } finally {
      // Always dismiss the loading toast and update loading state
      toast.dismiss(toastId);
      dispatch(setLoading(false));
    }
  };
}

//  Fetch the list of courses the user is enrolled in.
export async function getUserEnrolledCourses(token) {
  let result = [];
  try {
    // Make API call to get enrolled courses
    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    // Check if the response is successful
    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    // Store the enrolled courses in the result variable
    result = response.data.data;
  } catch (error) {
    // Log the error and show an error toast
    console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error);
    toast.error("Could Not Get Enrolled Courses");
  }

  return result;
}

// Fetch the data related to the instructor's courses.
export async function getInstructorData(token) {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    // Make API call to get instructor data
    const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {
      Authorization: `Bearer ${token}`,
    });

    // Store the instructor courses in the result variable
    result = response?.data?.courses;
  } catch (error) {
    // Log the error and show an error toast
    console.log("GET_INSTRUCTOR_API ERROR", error);
    toast.error("Could not Get Instructor Data");
  } finally {
    // Always dismiss the loading toast
    toast.dismiss(toastId);
  }
  return result;
}
