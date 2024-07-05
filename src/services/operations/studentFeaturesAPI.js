import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints;

// Function to dynamically load a script
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => reject(false);
    document.body.appendChild(script);
  });
}

// Function to handle the course purchase process
export async function buyCourse(
  token,
  courses,
  userDetails,
  navigate,
  dispatch
) {
  const toastId = toast.loading("Loading...");

  try {
    // Load the Razorpay script
    const scriptLoaded = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!scriptLoaded) {
      toast.error("RazorPay SDK failed to load");
      return;
    }

    // Initiate the order creation
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      { courses },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    // Check if the response structure is as expected
    if (!orderResponse.data || !orderResponse.data.success) {
      throw new Error(
        orderResponse.data
          ? orderResponse.data.message
          : "Unexpected response from payment API"
      );
    }

    const orderData = orderResponse.data.data;

    if (
      !orderData ||
      !orderData.currency ||
      !orderData.amount ||
      !orderData.id
    ) {
      throw new Error("Incomplete order data received from API");
    }

    // Razorpay payment options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      currency: orderData.currency,
      amount: `${orderData.amount}`,
      order_id: orderData.id,
      name: "StudyNotion",
      description: "Thank you for purchasing the course",
      image: rzpLogo,
      prefill: {
        name: `${userDetails.firstName}`,
        email: userDetails.email,
      },
      handler: function (response) {
        // Send payment success email
        sendPaymentSuccessEmail(response, orderData.amount, token);

        // Verify the payment
        verifyPayment({ ...response, courses }, token, navigate, dispatch);
      },
    };

    // Open Razorpay payment interface
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    paymentObject.on("payment.failed", function (response) {
      toast.error("Oops, payment failed");
      console.log("Payment Failed:", response.error);
    });
  } catch (error) {
    console.log("Payment API Error:", error);
    toast.error("Could not make payment: " + error.message);
  } finally {
    toast.dismiss(toastId);
  }
}

// Function to send payment success email
async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (error) {
    console.log("Payment Success Email Error:", error);
  }
}

// Function to verify the payment
async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying Payment...");
  dispatch(setPaymentLoading(true));

  try {
    const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Payment successful, you are added to the course");
    navigate("/dashboard/enrolled-courses");
    dispatch(resetCart());
  } catch (error) {
    console.log("Payment Verification Error:", error);
    toast.error("Could not verify payment");
  } finally {
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
  }
}
