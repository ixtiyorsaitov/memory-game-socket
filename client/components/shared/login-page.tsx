"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { LoginScreen } from "./login-screen";

const LoginPage = () => {
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
};

export default LoginPage;
