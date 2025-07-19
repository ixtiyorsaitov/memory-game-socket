// lib/socket.ts
import { io, Socket } from "socket.io-client";

const socket: Socket = io(process.env.WEB_SOCKET_DOMAIN, {
  autoConnect: false,
});

export default socket;
