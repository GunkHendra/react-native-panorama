import axios from "axios";

const api = axios.create({
  baseURL: "https://virtuard.com/",
  timeout: 10000,
});

export default api;