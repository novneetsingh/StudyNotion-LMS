import { createSlice } from "@reduxjs/toolkit";

// Define the initial state object for the authentication slice.
const initialState = {
  signupData: null, // holds data related to user signup
  loading: false, // represents the loading state of auth-related processes
  token: JSON.parse(localStorage.getItem("token")) || null, // retrieve the token from local storage or set to null if not available
};

const authSlice = createSlice({
  name: "auth", // name of the slice
  initialState, // initial state of the slice
  reducers: {
    // Reducers are defined here and automatically generate corresponding actions
    setSignupData(state, action) {
      state.signupData = action.payload; // Set the signup data to the payload
    },
    setLoading(state, action) {
      state.loading = action.payload; // Set the loading state to the payload
    },
    setToken(state, action) {
      state.token = action.payload; // Set the token to the payload
    },
  },
});

// Export the auto-generated action creators
export const { setSignupData, setLoading, setToken } = authSlice.actions;

// Export the reducer as a default export
export default authSlice.reducer;
