// lib/socket.ts
import { io, Socket } from "socket.io-client";

const socket: Socket = io(
  process.env.WEB_SOCKET_DOMAIN || "ws://memory-game-socket.onrender.com",
  {
    autoConnect: false,
  }
);

export default socket;
