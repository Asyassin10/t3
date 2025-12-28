import Axios from "axios";

// Use port 8234 for t3_system (matches docker-compose)
const T3_SYSTEM_API_URL = "http://127.0.0.1:8234/api";

const t3_system_client = Axios.create({
  baseURL: T3_SYSTEM_API_URL,
});

// Add auth token from localStorage if available
t3_system_client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("json_t3_token");
    if (token) {
      const parsedToken = JSON.parse(token);
      config.headers.Authorization = `Bearer ${parsedToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default t3_system_client;
