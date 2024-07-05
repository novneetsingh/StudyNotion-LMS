import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../../../services/operations/SettingsAPI";
import IconBtn from "../../../Common/IconBtn";

export default function UpdatePassword() {
  const { token } = useSelector((state) => state.auth); // Accessing token from Redux store
  const navigate = useNavigate();

  // State to toggle visibility of passwords
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Setup useForm hook from react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Function to handle form submission
  const submitPasswordForm = async (data) => {
    try {
      await changePassword(token, data); // Calling API to change password
      navigate("/dashboard/my-profile"); // Redirecting to profile page after password change
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message); // Logging errors if any
    }
  };

  return (
    <form onSubmit={handleSubmit(submitPasswordForm)}>
      <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
        <h2 className="text-lg font-semibold text-richblack-50">Password</h2>
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="relative flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="oldPassword" className="lable-style">
              Current Password
            </label>
            <input
              type={showOldPassword ? "text" : "password"}
              name="oldPassword"
              id="oldPassword"
              placeholder="Enter Current Password"
              className="form-style"
              {...register("oldPassword", {
                required: "Current password is required",
              })}
            />
            <span
              onClick={() => setShowOldPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showOldPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
            {errors.oldPassword && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                {errors.oldPassword.message}
              </span>
            )}
          </div>
          <div className="relative flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="newPassword" className="lable-style">
              New Password
            </label>
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              id="newPassword"
              placeholder="Enter New Password"
              className="form-style"
              {...register("newPassword", {
                required: "New password is required",
              })}
            />
            <span
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showNewPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
            {errors.newPassword && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                {errors.newPassword.message}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button" // Corrected type to "button" to prevent form submission
          onClick={() => navigate("/dashboard/my-profile")}
          className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
        >
          Cancel
        </button>
        <IconBtn type="submit" text="Update" />
      </div>
    </form>
  );
}
