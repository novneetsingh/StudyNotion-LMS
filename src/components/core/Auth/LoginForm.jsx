import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../../services/operations/authAPI";

function LoginForm() {
  // Initialize useForm hook
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Function to handle form submission
  const onSubmit = (data) => {
    dispatch(login(data.email, data.password, navigate)); // Dispatch login action
  };

  return (
    // Form element with onSubmit handler
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-6 flex w-full flex-col gap-y-4"
    >
      {/* Email input field */}
      <label className="w-full">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
          Email Address <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type="text"
          placeholder="Enter email address"
          className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
          {...register("email", { required: true })} // Register email field with validation
        />
      </label>
      {/* Password input field */}
      <label className="relative">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
          Password <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type={showPassword ? "text" : "password"}
          {...register("password", { required: true })} // Register password field with validation
          placeholder="Enter Password"
          className="w-full rounded-[0.5rem] bg-richblack-800 p-[12px] pr-12 text-richblack-5"
        />
        {/* Toggle password visibility */}
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[38px] z-[10] cursor-pointer"
        >
          {showPassword ? (
            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
          ) : (
            <AiOutlineEye fontSize={24} fill="#AFB2BF" />
          )}
        </span>
        {/* Link to forgot password page */}
        <Link to="/forgot-password">
          <p className="mt-1 ml-auto max-w-max text-xs text-blue-100">
            Forgot Password
          </p>
        </Link>
      </label>
      {/* Submit button */}
      <button
        type="submit"
        className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900"
      >
        Sign In
      </button>
    </form>
  );
}

export default LoginForm;
