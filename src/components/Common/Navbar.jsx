import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { BsChevronDown } from "react-icons/bs";
import { AiOutlineShoppingCart } from "react-icons/ai";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";

const Navbar = () => {
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories from API when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        setSubLinks(res.data.data);
      } catch (error) {
        console.log("Could not fetch Categories.", error);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  // Helper function to check if the current route matches the given route
  const matchRoute = (route) => route === location.pathname;

  return (
    <div className="flex h-16 items-center justify-center border-b-[1px] border-b-richblack-700 bg-richblack-800">
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:block">
          <ul className="flex pr-28 gap-x-16 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  // Catalog link with dropdown
                  <div
                    className={`group relative flex items-center gap-1 ${
                      matchRoute("/catalog/:catalogName")
                        ? "text-yellow-25"
                        : "text-richblack-25"
                    }`}
                  >
                    <p>{link.title}</p>
                    <BsChevronDown />
                    {/* Dropdown menu */}
                    <div className="invisible absolute left-[50%] top-full z-[1000] w-[200px] translate-x-[-50%] mt-2 flex flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 lg:w-[300px]">
                      {/* Triangle arrow */}
                      <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-richblack-5"></div>
                      {/* Loading or courses list */}
                      {loading ? (
                        <p className="text-center">Loading...</p>
                      ) : subLinks.length ? (
                        subLinks
                          ?.filter((subLink) => subLink?.courses?.length >= 0)
                          ?.map((subLink, i) => (
                            <Link
                              to={`/catalog/${subLink.name
                                .split(" ")
                                .join("-")
                                .toLowerCase()}`}
                              className="rounded-lg py-2 pl-4 hover:bg-richblack-50"
                              key={i}
                            >
                              {subLink.name}
                            </Link>
                          ))
                      ) : (
                        <p className="text-center">No Courses Found</p>
                      )}
                    </div>
                  </div>
                ) : (
                  // Regular link
                  <Link
                    to={link?.path}
                    className={`${
                      matchRoute(link?.path)
                        ? "text-yellow-25"
                        : "text-richblack-25"
                    }`}
                  >
                    {link.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User actions: Cart, Login/Signup, Profile */}
        <div className="hidden items-center gap-x-4 md:flex">
          {/* Cart icon */}
          {user && user?.accountType !== "Instructor" && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {/* Display total items in cart */}
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-richblack-600 text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {/* Conditional rendering based on login status */}
          {token === null ? (
            // Show login and signup buttons if not logged in
            <>
              <Link to="/login">
                <button className="rounded-lg border border-richblack-700 bg-richblack-800 px-4 py-2 text-richblack-100 transition-all hover:bg-richblack-700">
                  Log in
                </button>
              </Link>
              <Link to="/signup">
                <button className="rounded-lg border border-richblack-700 bg-richblack-800 px-4 py-2 text-richblack-100 transition-all hover:bg-richblack-700">
                  Sign up
                </button>
              </Link>
            </>
          ) : (
            // Show profile image if logged in
            <Link to="/dashboard/my-profile">
              <img
                src={user?.image}
                alt={`profile-${user?.firstName}`}
                className="h-8 w-8 rounded-full object-cover"
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
