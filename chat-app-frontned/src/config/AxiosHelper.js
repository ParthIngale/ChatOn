// src/config/AxiosHelper.js
import axios from "axios";

export const baseURL = "http://localhost:8080"; // Your Spring Boot port

export const httpClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

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