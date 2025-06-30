import { apiBaseUrl } from "@clnt/constants/api";
import axios, { AxiosResponse } from "axios";

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

// Cached token
let csrfToken: string | null = null;

async function getCsrfToken() {
  if (csrfToken) return csrfToken;

  const res = await axiosInstance.get("/csrf");
  csrfToken = res.data?.csrfToken;
  return csrfToken;
}

// 🛡️ Request interceptor to inject CSRF
axiosInstance.interceptors.request.use(async (config) => {
  if (["post", "put", "delete", "patch"].includes(config.method || "")) {
    const token = await getCsrfToken();
    if (token) {
      config.headers["x-csrf-token"] = token;
    }
  }
  return config;
});

// 🛠️ Response interceptor to detect invalid HTML (wrong content)
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (
      typeof response.data === "string" &&
      response.data.trim().startsWith("<!doctype html>")
    ) {
      throw new Error(
        "Invalid response: received HTML document instead of JSON data.",
      );
    }
    csrfToken = null;
    return response;
  },
  (error) => {
    if (
      error?.response?.status ===
      401 /* && error?.response?.message === "Unauthorized: You must be logged in to access this resource." */
    ) {
      console.log("🚀 ~ error?.response?.message:", error?.response?.message);
      /* 
      useUserStore.getState().invalidateUser(); // 🔐 clear session
      window.location.href = "/signin"; // optional auto-redirect */
      throw new Error(error?.response?.message);
    }
    csrfToken = null;
    return Promise.reject(error);
  },
);

export default axiosInstance;
