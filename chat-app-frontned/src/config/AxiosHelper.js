// src/config/AxiosHelper.js
import axios from "axios";

export const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
// "http://localhost:8080"; // Your Spring Boot port

export const httpClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 
// In your axios configuration or API service
// const API_BASE_URL = ;
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';

export { API_BASE_URL, WS_URL };
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