// src/services/RoomService.js
import { httpClient } from "../config/AxiosHelper";

// createRoom — send plain text so Spring's @RequestBody String maps cleanly
export const createRoom = async (roomId) => {
  const response = await httpClient.post(`/api/v1/rooms`, roomId, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
  return response.data;
};

// keep a second name if you want backward compatibility
export const createRoomApi = createRoom;

export const joinChatApi = async (roomId) => {
  const response = await httpClient.get(`/api/v1/rooms/${roomId}`);
  return response.data;
};

export const getMessages = async (roomId, size = 50, page = 0) => {
  const response = await httpClient.get(
    `/api/v1/rooms/${roomId}/messages?size=${size}&page=${page}`
  );
  return response.data;
};
// Change from deployed URL to local:
// const BASE_URL = 'http://localhost:8080';
// API Base URL
export const API_BASE_URL ='http://localhost:8080';
// export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
// 
// WebSocket URL  
export const WS_URL ='ws://localhost:8080/ws';

// Axios instance
import axios from 'axios';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export default api;