// P1
// src/config/AxiosHelper.js
import axios from "axios";

// API Configuration
export const baseURL = import.meta.env.VITE_API_URL || 'https://chaton-geje.onrender.com';

// WebSocket Configuration - FIXED: Use /ws endpoint
export const wsURL = import.meta.env.VITE_WS_URL || `${baseURL}/ws`;

export const httpClient = axios.create({
  baseURL,
  timeout: 15000, // Increased timeout for Render
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for better error handling
httpClient.interceptors.request.use(
  (config) => {
    console.log(`Making request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const api = axios.create({
  baseURL: baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
// P2
// // src/config/AxiosHelper.js
// import axios from "axios";

// // export const baseURL = "http://localhost:8080"; 
// export const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
// export const wsURL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/chat';

// // Your Spring Boot port

// export const httpClient = axios.create({
//   baseURL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// const api = axios.create({
//   baseURL: baseURL,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export default api;
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