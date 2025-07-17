"use client";

import { useAuth } from "@/hooks/use-user";
import { useEffect } from "react";

export default function InitAuth() {
  const { setUser, user } = useAuth();

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
