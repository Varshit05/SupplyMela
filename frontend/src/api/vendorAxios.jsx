import axios from "axios";

const vendorApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
});

vendorApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("vendor_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

vendorApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("vendor_refresh_token");
      
      if (refreshToken) {
        try {
          const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, { refreshToken });
          const newToken = res.data.token;
          
          localStorage.setItem("vendor_token", newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return vendorApi(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("vendor_token");
          localStorage.removeItem("vendor_refresh_token");
          window.location.href = "/login";
        }
      } else {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default vendorApi;
