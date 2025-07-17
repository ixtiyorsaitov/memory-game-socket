"use client";

import { redirect, useRouter } from "next/navigation";
import { LoginScreen } from "@/components/shared/login-screen";
import { useAuth } from "@/hooks/use-user";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  if (user.name) return redirect("/lobby");

  const handleLogin = (name: string) => {
    localStorage.setItem("playerName", name);
    window.location.href = "/lobby";
  };

  return <LoginScreen onLogin={handleLogin} />;
}
