import axios from "axios";

// Create an axios instance that can be customized or used with default settings
export const axiosInstance = axios.create({});

export const apiConnector = (
  method,
  url,
  bodyData = null,
  headers = null,
  params = null
) => {
  return axiosInstance({
    method, // HTTP method for the request
    url, // URL to which the request is sent
    data: bodyData, // Data to be sent as the request body
    headers, // HTTP headers to accompany the request
    params, // URL parameters to be included with the request
  });
};
