import { apiBaseUrl } from "@clnt/constants/api";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true
});

// Fetch token once, and cache it
let csrfToken: string | null = null;

async function getCsrfToken() {
  const res = await axiosInstance.get("/csrf-token");
  csrfToken = res.data?.csrfToken;
  return csrfToken;
}

axiosInstance.interceptors.request.use(async (config) => {
  // Refresh token only for modifying methods
  if (["post", "put", "delete", "patch"].includes(config.method || "")) {
    const token = await getCsrfToken();
    if (token) {
      config.headers["x-csrf-token"] = token;
    }
  }
  return config;
});


export default axiosInstance;
