import React from "react";
import { Link } from "react-router-dom";

const Button = ({ children, active, linkto }) => {
  return (
    <Link to={linkto}>
      <div
        className={`text-center text-[13px] sm:text-[16px] px-6 py-3 rounded-md font-bold ${
          active ? "bg-yellow-50 text-black " : "bg-richblack-800"
        } hover:scale-110 transition-all duration-300 `}
      >
        {children}
      </div>
    </Link>
  );
};

export default Button;
