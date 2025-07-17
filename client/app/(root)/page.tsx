"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginScreen } from "@/components/shared/login-screen";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const savedName = localStorage.getItem("playerName");
    if (savedName) {
      router.push("/lobby");
    }
  }, []);

  const handleLogin = (name: string) => {
    localStorage.setItem("playerName", name);
    window.location.href = "/lobby";
  };

  return <LoginScreen onLogin={handleLogin} />;
}
