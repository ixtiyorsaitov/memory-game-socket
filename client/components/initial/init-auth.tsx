"use client";

import { useAuth } from "@/hooks/use-user";
import { useEffect } from "react";

export default function InitAuth() {
  const { setUser } = useAuth();

  useEffect(() => {
    const name = localStorage.getItem("playerName");
    if (name && name.trim() !== "") {
      setUser({
        name,
        allowInvites: true,
      });
    }
  }, [setUser]);

  return null; // bu component faqat init uchun
}
