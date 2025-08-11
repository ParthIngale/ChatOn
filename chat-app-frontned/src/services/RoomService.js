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

// import { httpClient } from "../config/AxiosHelper";

// export const createRoom = async (roomId) => {
//   const response = await httpClient.post(`/api/v1/rooms`, roomId, {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   return response.data;
// };

// export const joinChatApi = async (roomId) => {
//   const response = await httpClient.get(`/api/v1/rooms/${roomId}`);
//   return response.data;
// };

// export const getMessages = async (roomId, size = 50, page = 0) => {
//   const response = await httpClient.get(
//     `/api/v1/rooms/${roomId}/messages?size=${size}&page=${page}`
//   );
//   return response.data;
// };