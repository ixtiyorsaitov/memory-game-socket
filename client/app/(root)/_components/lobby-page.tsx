"use client";

import { MainLobby } from "@/components/shared/main-lobby";
import { useAuth } from "@/hooks/use-user";
import React from "react";

const LobbyPageComponent = () => {
  const { user, setUser } = useAuth();

  if (!user.name) return null; // redirect ni kutadi
  return (
    <MainLobby
      playerName={user.name}
      onInvitePreferenceChange={(allow) => {
        setUser({ ...user, allowInvites: allow });
        localStorage.setItem("allowInvites", allow.toString());
      }}
    />
  );
};

export default LobbyPageComponent;
