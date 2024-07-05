import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

// Initial state setting from localStorage or default values if none exists
const initialState = {
  cart: JSON.parse(localStorage.getItem("cart")) || [],
  total: JSON.parse(localStorage.getItem("total")) || 0,
  totalItems: JSON.parse(localStorage.getItem("totalItems")) || 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Adds a course to the cart, or shows an error toast if already added
    addToCart: (state, action) => {
      const course = action.payload;
      const index = state.cart.findIndex((item) => item._id === course._id);

      if (index === -1) {
        // If the course is not in the cart
        state.cart.push({ ...course, quantity: 1 }); // Add course with initial quantity
        state.totalItems++;
        state.total += course.price;
        toast.success("Course added to cart");
      } else {
        toast.error("Course already in cart");
      }
      // Updating local storage to reflect changes
      localStorage.setItem("cart", JSON.stringify(state.cart));
      localStorage.setItem("total", JSON.stringify(state.total));
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
    },

    // Removes a specific course from the cart
    removeFromCart: (state, action) => {
      const courseId = action.payload;
      const index = state.cart.findIndex((item) => item._id === courseId);

      if (index !== -1) {
        // If the course is found in the cart
        state.totalItems--;
        state.total -= state.cart[index].price;
        state.cart.splice(index, 1); // Remove the course
        toast.success("Course removed from cart");
        // Updating local storage to reflect changes
        localStorage.setItem("cart", JSON.stringify(state.cart));
        localStorage.setItem("total", JSON.stringify(state.total));
        localStorage.setItem("totalItems", JSON.stringify(state.totalItems));
      }
    },

    // Resets the cart to an empty state
    resetCart: (state) => {
      state.cart = [];
      state.total = 0;
      state.totalItems = 0;
      // Clear cart-related items from local storage
      localStorage.removeItem("cart");
      localStorage.removeItem("total");
      localStorage.removeItem("totalItems");
    },
  },
});

export const { addToCart, removeFromCart, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
