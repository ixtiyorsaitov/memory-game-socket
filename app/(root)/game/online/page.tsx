"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GameBoard } from "@/components/shared/game-board";

export default function OnlineGamePage() {
  const [playerName, setPlayerName] = useState("");
  const [opponentName, setOpponentName] = useState("Opponent");
  const [opponentPairs, setOpponentPairs] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const savedName = localStorage.getItem("playerName");
    if (!savedName) {
      router.push("/");
    } else {
      setPlayerName(savedName);
    }
  }, [router]);

  const handleBackToLobby = () => {
    router.push("/lobby");
  };

  if (!playerName) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <GameBoard
      gameMode="online"
      playerName={playerName}
      onBackToLobby={handleBackToLobby}
      opponentName={opponentName}
      opponentPairs={opponentPairs}
    />
  );
}
