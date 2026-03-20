import axios from "axios";

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("admin_refresh_token");
      
      if (refreshToken) {
        try {
          const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, { refreshToken });
          const newToken = res.data.token;
          
          localStorage.setItem("admin_token", newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return adminApi(originalRequest);
        } catch (refreshError) {
          // Refresh token expired or invalid
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_refresh_token");
          window.location.href = "/admin/login";
        }
      } else {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export default adminApi;
