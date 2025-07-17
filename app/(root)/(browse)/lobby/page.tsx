"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLobby } from "@/components/shared/main-lobby";

export default function LobbyPage() {
  const [playerName, setPlayerName] = useState("");
  const [allowInvites, setAllowInvites] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedName = localStorage.getItem("playerName");
    const savedInvitePreference = localStorage.getItem("allowInvites");
    if (!savedName) {
      router.push("/");
    } else {
      setPlayerName(savedName);
      setAllowInvites(savedInvitePreference !== "false");
    }
  }, [router]);

  const handleGameModeSelect = (mode: "single" | "online") => {
    if (mode === "single") {
      router.push("/game/single");
    } else {
      router.push("/game/online");
    }
  };

  const handleInvitePreferenceChange = (allow: boolean) => {
    setAllowInvites(allow);
    localStorage.setItem("allowInvites", allow.toString());
  };

  if (!playerName) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <MainLobby
      playerName={playerName}
      // onGameModeSelect={handleGameModeSelect}
      allowInvites={allowInvites}
      onInvitePreferenceChange={handleInvitePreferenceChange}
    />
  );
}
