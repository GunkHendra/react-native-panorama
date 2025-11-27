import axios from "axios";

const api = axios.create({
  baseURL: "https://virtuard.com/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

api.interceptors.request.use(async (config) => {
  const token = "LzYCXH4H3IwHKnsEgnsS9GmxPXsRmw0JyV5WPNPc00bb18e4";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access, e.g., redirect to login
      console.log("Unauthorized! Redirecting to login...");
    }
    return Promise.reject(error);
  }
);