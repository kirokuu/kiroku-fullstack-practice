import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키를 주고받기 위한 설정
});

export default axiosInstance;