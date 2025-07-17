"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginScreen } from "@/components/login-screen";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const savedName = localStorage.getItem("playerName");
    if (savedName) {
      router.push("/lobby");
    }
  }, [router]);

  const handleLogin = (name: string) => {
    localStorage.setItem("playerName", name);
    router.push("/lobby");
  };

  return <LoginScreen onLogin={handleLogin} />;
}
