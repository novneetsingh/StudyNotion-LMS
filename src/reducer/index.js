// Import combineReducers utility from Redux Toolkit
import { combineReducers } from "@reduxjs/toolkit";

// Import each slice reducer
import authReducer from "../slices/authSlice";
import cartReducer from "../slices/cartSlice";
import courseReducer from "../slices/courseSlice";
import profileReducer from "../slices/profileSlice";
import viewCourseReducer from "../slices/viewCourseSlice";

// Combine all the slice reducers into a single root reducer
const rootReducer = combineReducers({
  // Assign the authReducer to manage the 'auth' slice of the state
  auth: authReducer,
  // Assign the profileReducer to manage the 'profile' slice of the state
  profile: profileReducer,
  // Assign the courseReducer to manage the 'course' slice of the state
  course: courseReducer,
  // Assign the cartReducer to manage the 'cart' slice of the state
  cart: cartReducer,
  // Assign the viewCourseReducer to manage the 'viewCourse' slice of the state
  viewCourse: viewCourseReducer,
});

// Export the combined reducer as the default export
export default rootReducer;
