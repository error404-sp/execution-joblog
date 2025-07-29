import { io } from "socket.io-client";
const apiUrl = "https://joblog-backend-production.up.railway.app";

export const socket = io(apiUrl, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

socket.on("connect", () => {
  console.log("✅ Connected to backend socket:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected from backend socket");
});
