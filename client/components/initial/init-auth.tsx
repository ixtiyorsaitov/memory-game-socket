"use client";

import { useAuth } from "@/hooks/use-user";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function InitAuth() {
  const { setUser, user } = useAuth();
  const socket = useRef<ReturnType<typeof io> | null>(null);

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
