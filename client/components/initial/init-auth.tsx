"use client";

import { useAuth } from "@/hooks/use-user";
import { useEffect } from "react";
import { useSocket } from "../providers/socket-context";

export default function InitAuth() {
  const { setUser, user } = useAuth();
  const socket = useSocket();

  useEffect(() => {
    socket.on("user:get-socket-id", (id) => {
      setUser({
        ...user,
        socketId: id,
        name: localStorage.getItem("playerName"),
      });
    });
  }, []);

  return null;
}
