import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courseContent: [], // Array to store course content (lectures)
  courseEntireData: {}, // Object to store complete course data
};

const viewCourseSlice = createSlice({
  name: "viewCourse",
  initialState,
  reducers: {
    // Sets the course content (lectures)
    setCourseContent: (state, action) => {
      state.courseContent = action.payload;
    },
    // Sets all the data for the entire course
    setEntireCourseData: (state, action) => {
      state.courseEntireData = action.payload;
    },
  },
});

export const { setCourseContent, setEntireCourseData } = viewCourseSlice.actions;
export default viewCourseSlice.reducer;
