import Axios, { AxiosError } from "axios";

const BASEUTL_LOCAL_API_1 = "http://127.0.0.1:8999/api";

const api_client = Axios.create({
  baseURL: BASEUTL_LOCAL_API_1,
});

interface ResponseData {
  require_redirect?: string;
  require_subscription?: boolean;  // Add this line
  error?: string;                   // Add this line
  message?: string;                 // Add this line
}

api_client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ResponseData>) => {
    // Handle authentication redirect
    if (
      error.response?.data &&
      error.response.data?.require_redirect == "true"
    ) {
      window.location.href = "/auth/signing";
      return Promise.reject(error);
    }

    // Handle subscription requirement (402 Payment Required)
    if (
      error.response?.status === 402 ||
      error.response?.data?.require_subscription === true
    ) {
      window.location.href = "/subscription-required";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default api_client;