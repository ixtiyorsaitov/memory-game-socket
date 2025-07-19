"use client";

import React from "react";
import { LoginScreen } from "./login-screen";
import { useAuth } from "@/hooks/use-user";

const LoginPage = () => {
  const { user } = useAuth();
  if (user.name) return (window.location.href = "/lobby");

  const handleLogin = (name: string) => {
    localStorage.setItem("playerName", name);
    window.location.href = "/lobby";
  };

  return <LoginScreen onLogin={handleLogin} />;
};

export default LoginPage;
