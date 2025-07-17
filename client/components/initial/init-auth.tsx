"use client";

import { useAuth } from "@/hooks/use-user";
import { useEffect } from "react";

export default function InitAuth() {
  const { setUser, user } = useAuth();

  useEffect(() => {
    const name = localStorage.getItem("playerName");
    if (name && name.trim() !== "") {
      setUser({
        ...user,
        name,
        allowInvites: true,
      });
    }
  }, [setUser]);

  return null; // bu component faqat init uchun
}
