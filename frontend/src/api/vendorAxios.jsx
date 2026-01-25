import axios from "axios";

const vendorApi = axios.create({
  baseURL: "http://localhost:5000/api",
});

vendorApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("vendor_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default vendorApi;
