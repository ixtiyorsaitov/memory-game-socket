// context/socket-context.tsx
"use client";

import { createContext, useContext, useEffect } from "react";
import socket from "@/lib/socket";

const SocketContext = createContext(socket);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
