import { toast } from "react-hot-toast";
import { setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiconnector";
import { settingsEndpoints } from "../apis";
import { logout } from "./authAPI";

// Destructuring endpoints from settingsEndpoints for easier access
const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingsEndpoints;

// Function to update display picture
export function updateDisplayPicture(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading..."); // Display loading toast
    try {
      // Call API to update display picture
      const response = await apiConnector(
        "PUT",
        UPDATE_DISPLAY_PICTURE_API,
        formData,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message); // Throw error if response is not successful
      }
      toast.success("Display Picture Updated Successfully"); // Show success toast
      dispatch(setUser(response.data.data)); // Update user in the state
    } catch (error) {
      console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error);
      toast.error("Could Not Update Display Picture"); // Show error toast
    }
    toast.dismiss(toastId); // Dismiss loading toast
  };
}

// Function to update profile
export function updateProfile(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading..."); // Display loading toast
    try {
      // Call API to update profile
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) {
        throw new Error(response.data.message); // Throw error if response is not successful
      }
      const userImage = response.data.updatedUserDetails.image;
      dispatch(
        setUser({ ...response.data.updatedUserDetails, image: userImage })
      ); // Update user in the state with new details
      toast.success("Profile Updated Successfully"); // Show success toast
    } catch (error) {
      console.log("UPDATE_PROFILE_API API ERROR............", error);
      toast.error("Could Not Update Profile"); // Show error toast
    }
    toast.dismiss(toastId); // Dismiss loading toast
  };
}

// Function to change password
export async function changePassword(token, formData) {
  const toastId = toast.loading("Loading..."); // Display loading toast
  try {
    // Call API to change password
    const response = await apiConnector("POST", CHANGE_PASSWORD_API, formData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message); // Throw error if response is not successful
    }
    toast.success("Password Changed Successfully"); // Show success toast
  } catch (error) {
    console.log("CHANGE_PASSWORD_API API ERROR............", error);
    toast.error(error.response.data.message); // Show error toast with error message
  }
  toast.dismiss(toastId); // Dismiss loading toast
}

// Function to delete profile
export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading..."); // Display loading toast
    try {
      // Call API to delete profile
      const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) {
        throw new Error(response.data.message); // Throw error if response is not successful
      }
      toast.success("Profile Deleted Successfully"); // Show success toast
      dispatch(logout(navigate)); // Dispatch logout action
    } catch (error) {
      console.log("DELETE_PROFILE_API API ERROR............", error);
      toast.error("Could Not Delete Profile"); // Show error toast
    }
    toast.dismiss(toastId); // Dismiss loading toast
  };
}
