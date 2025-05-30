import { apiBaseUrl } from "@clnt/constants/api";
import axios from "axios";
import { useUserStore } from "./store/user-store";

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

/* axiosInstance.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      const { session } = err.response.data;
      if (session === 'invalid') {
        // 👇 Clear persisted state
        useUserStore.getState().logoutUser()
      }
    }
    return Promise.reject(err);
  }
);
 */
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
