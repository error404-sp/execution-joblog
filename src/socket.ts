import { io } from "socket.io-client";

const BACKEND_URL = "https://joblog-backend-production.up.railway.app";

export const socket = io(BACKEND_URL, {
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
