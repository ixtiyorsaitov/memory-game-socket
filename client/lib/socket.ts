// lib/socket.ts
import { io, Socket } from "socket.io-client";

const socket: Socket = io(
  process.env.NEXT_PUBLIC_WEB_SOCKET_DOMAIN ||
    "ws://memory-game-socket.onrender.com",
  {
    autoConnect: false,
    transports: ["websocket"], // Polling o‘rniga WebSocket to‘g‘ridan-to‘g‘ri
  }
);

export default socket;
