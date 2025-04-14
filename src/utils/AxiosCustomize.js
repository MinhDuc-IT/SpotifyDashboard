import axios from "axios";
import { auth } from "../firebase";

const API_URL = "http://localhost:5000";

// Tạo một instance của axios
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || API_URL,
});

// Thêm interceptor để xử lý request trước khi gửi
axiosInstance.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý response trả về
axiosInstance.interceptors.response.use(
  (response) => {
    // Xử lý dữ liệu trả về từ server
    return response.data;
  },
  (error) => {
    // Xử lý lỗi từ server
    if (error.response) {
      console.error("API Error:", error.response.data);
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error.message);
  }
);

export default axiosInstance;
