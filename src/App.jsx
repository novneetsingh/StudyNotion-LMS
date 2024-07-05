import React, { useEffect } from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Common/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Error from "./pages/Error";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import MyProfile from "./components/core/Dashborad/MyProfile";
import Settings from "./components/core/Dashborad/Settings/Settings";
import { ACCOUNT_TYPE } from "./utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "./services/operations/profileAPI";
import EnrolledCourses from "./components/core/Dashborad/EnrolledCourses";
import Cart from "./components/core/Dashborad/Cart/Cart";
import AddCourse from "./components/core/Dashborad/AddCourse/AddCourse";
import MyCourses from "./components/core/Dashborad/MyCourses";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.profile);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = JSON.parse(localStorage.getItem("token"));
      dispatch(getUserDetails(token, navigate));
    }
  }, []);

  return (
    <div className="w-screen min-h-screen bg-richblack-900 font-poppins">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="catalog/:catalogName" element={<Catalog />} />

        <Route path="courses/:courseId" element={<CourseDetails />} />

        {/* Open routes accessible to everyone */}
        <Route
          path="/signup"
          element={token ? <Navigate to="/dashboard/my-profile" /> : <Signup />}
        />
        <Route
          path="/login"
          element={token ? <Navigate to="/dashboard/my-profile" /> : <Login />}
        />
        <Route
          path="/forgot-password"
          element={
            token ? <Navigate to="/dashboard/my-profile" /> : <ForgotPassword />
          }
        />
        <Route
          path="/update-password/:id"
          element={
            token ? <Navigate to="/dashboard/my-profile" /> : <UpdatePassword />
          }
        />
        <Route
          path="/verify-email"
          element={
            token ? <Navigate to="/dashboard/my-profile" /> : <VerifyEmail />
          }
        />

        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          {/* Route for all users */}
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/Settings" element={<Settings />} />

          {/* Route only for Instructors */}
          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/my-courses" element={<MyCourses />} />
              <Route path="dashboard/add-course" element={<AddCourse />} />
            </>
          )}

          {/* Route only for Students */}
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="dashboard/enrolled-courses"
                element={<EnrolledCourses />}
              />
              <Route path="/dashboard/cart" element={<Cart />} />
            </>
          )}
        </Route>

        <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="view-course/:courseId/lecture/:lectureId"
                element={<VideoDetails />}
              />
            </>
          )}
        </Route>

        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
};

export default App;
