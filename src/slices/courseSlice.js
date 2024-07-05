import { createSlice } from "@reduxjs/toolkit";

// Define the initial state of the course management section of the application
const initialState = {
  step: 1, // Current step in a multi-step form or process
  course: null, // The course data being edited or created
  paymentLoading: false, // Flag to indicate if a payment process is loading
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    // Set the current step in a multi-step form or process
    setStep: (state, action) => {
      state.step = action.payload;
    },
    // Set the course object currently being created or edited
    setCourse: (state, action) => {
      state.course = action.payload;
    },
    
    // Set the loading state for payment processing to provide feedback in UI
    setPaymentLoading: (state, action) => {
      state.paymentLoading = action.payload;
    },

    // Reset the course state to initial values when form is closed or submitted
    resetCourseState: (state) => {
      state.step = 1;
      state.course = null;
      state.paymentLoading = false;
    },
  },
});

// Export actions to be used in components for dispatching changes to the state
export const {
  setStep,
  setCourse,
  setPaymentLoading,
  resetCourseState,
} = courseSlice.actions;

// Default export of the reducer to be included in the store
export default courseSlice.reducer;
