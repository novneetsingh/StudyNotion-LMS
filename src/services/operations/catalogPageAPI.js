import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { catalogData } from "../apis";

export const getCatalogPageData = async (categoryId) => {
  // Display a loading toast
  const toastId = toast.loading("Loading...");

  let result = [];

  try {
    // Make a POST request to fetch catalog page data
    const response = await apiConnector(
      "POST",
      catalogData.CATALOGPAGEDATA_API,
      {
        categoryId: categoryId,
      }
    );

    // Check if the response indicates success
    if (!response?.data?.success) {
      // If not successful, throw an error
      throw new Error("Could not fetch Category page data.");
    }

    // If successful, assign the data to the result
    result = response?.data;
  } catch (error) {
    // Log the error and display an error toast
    console.log("CATALOGPAGEDATA_API API ERROR:", error);
    toast.error(error.message);

    // Assign the error response data to result
    result = error.response?.data;
  }

  // Dismiss the loading toast
  toast.dismiss(toastId);

  // Return the result
  return result;
};
