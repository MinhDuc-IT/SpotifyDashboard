import axios from "axios";

// Lấy URL API từ file .env
const API_URL =  "http://localhost:5063";

// Tạo một instance của axios
const axiosInstance = axios.create({
  baseURL: API_URL, // URL gốc cho tất cả các request
//   timeout: 10000, // Thời gian chờ tối đa (10 giây)
//   headers: {
//     "Content-Type": "application/json", // Định dạng dữ liệu gửi đi
//   },
});

// Thêm interceptor để xử lý request trước khi gửi
axiosInstance.interceptors.request.use(
  (config) => {
    // Thêm token vào header nếu cần
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Xử lý lỗi trước khi request được gửi đi
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