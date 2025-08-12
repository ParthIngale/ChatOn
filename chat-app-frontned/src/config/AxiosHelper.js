// src/config/AxiosHelper.js
import axios from "axios";

// export const baseURL = "http://localhost:8080"; 
export const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export const wsURL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/chat';

// Your Spring Boot port

export const httpClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
// 

// In your axios configuration or API service
// const API_BASE_URL = ;
// src/config/AxiosHelper.js
// import axios from "axios";

// export const baseURL = "http://localhost:8080"; // Change this to your Spring Boot port
// export const httpClient = axios.create({
//   baseURL: baseURL,
// });
// import axios from "axios";
// export const baseURL = "http://localhost:5173";
// export const httpClient = axios.create({
//   baseURL: baseURL,
// });