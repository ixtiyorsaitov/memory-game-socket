// lib/socket.ts
import { io, Socket } from "socket.io-client";

const socket: Socket = io("ws://localhost:5000", {
  autoConnect: false,
});

export default socket;
