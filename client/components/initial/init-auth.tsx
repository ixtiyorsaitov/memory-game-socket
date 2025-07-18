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
  useEffect(() => {
    console.log("User o'zgardi", user);
  }, [user]);
  useEffect(() => {
    const name = localStorage.getItem("playerName");
    const allowInvites = localStorage.getItem("allowInvites") || true;
    if (name && name.trim() !== "") {
      setUser({
        ...user,
        name,
        allowInvites: allowInvites === "false" ? false : true,
      });
    }
  }, [setUser]);

  return null;
}
