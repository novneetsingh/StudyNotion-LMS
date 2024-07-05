import { toast } from "react-hot-toast";
import { setLoading, setToken } from "../../slices/authSlice";
import { resetCart } from "../../slices/cartSlice";
import { setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiconnector";
import { endpoints } from "../apis";

// Destructuring endpoint constants from the imported endpoints object
const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints;

// Function to send OTP
export function sendOtp(email, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      // Sending request to the API to send OTP
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      });

      // Checking if the request was successful
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Notifying user about successful OTP sending
      toast.success("OTP Sent Successfully");
      // Navigating user to verify email page
      navigate("/verify-email");
    } catch (error) {
      // Handling error if OTP sending failed
      console.log("SENDOTP API ERROR............", error);
      toast.error("Could Not Send OTP");
    }
    // Resetting loading state and dismissing toast
    dispatch(setLoading(false));
  };
}

// Function to sign up user
export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      // Sending request to the API to sign up user
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      });

      // Checking if the request was successful
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      // Notifying user about successful sign up
      toast.success("Signup Successful");
      // Navigating user to login page
      navigate("/login");
    } catch (error) {
      // Handling error if sign up failed
      console.log("SIGNUP API ERROR............", error);
      toast.error("Signup Failed");
      // Navigating user login up page
      navigate("/login");
    }
    // Resetting loading state and dismissing toast
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

// Function to login user
export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      // Sending request to the API to login user
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      // Checking if the request was successful
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Notifying user about successful login
      toast.success("Login Successful");
      // Setting token in Redux store
      dispatch(setToken(response.data.token));
      // Setting user details in Redux store
      const userImage = response.data.user.image;
      dispatch(setUser({ ...response.data.user, image: userImage }));
      // Storing token in local storage
      localStorage.setItem("token", JSON.stringify(response.data.token));
      // Navigating user to dashboard after successful login
      navigate("/dashboard/my-profile");
    } catch (error) {
      // Handling error if login failed
      console.log("LOGIN API ERROR............", error);
      toast.error("Login Failed");
    }
    // Resetting loading state and dismissing toast
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

// Function to get password reset token
export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      // Sending request to the API to get password reset token
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      });

      // Checking if the request was successful
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Notifying user about successful sending of reset email
      toast.success("Reset Email Sent");
      // Updating email sent status in component state
      setEmailSent(true);
    } catch (error) {
      // Handling error if sending reset email failed
      console.log("RESETPASSTOKEN ERROR............", error);
      toast.error("Failed To Send Reset Email");
    }
    // Dismissing loading toast and resetting loading state
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}

// Function to reset password
export function resetPassword(password, confirmPassword, token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      // Sending request to the API to reset password
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      });

      // Checking if the request was successful
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Notifying user about successful password reset
      toast.success("Password Reset Successfully");
      // Navigating user to login page
      navigate("/login");
    } catch (error) {
      // Handling error if password reset failed
      console.log("RESETPASSWORD ERROR............", error);
      toast.error("Failed To Reset Password");
    }
    // Dismissing loading toast and resetting loading state
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}

// Function to logout user
export function logout(navigate) {
  return (dispatch) => {
    // Clearing token and user details from Redux store
    dispatch(setToken(null));
    dispatch(setUser(null));
    // Removing token and user details from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Notifying user about successful logout
    toast.success("Logged Out");
    // Navigating user to home page
    navigate("/");
  };
}
