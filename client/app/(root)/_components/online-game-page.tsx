"use client";
import { useState } from "react";
import { GameBoard } from "@/components/shared/game-board/game-board";
import { useSocket } from "@/components/providers/socket-context";
import { useCurrentRoom } from "@/hooks/use-current-room";

const OnlineGamePageComponent = () => {
  const socket = useSocket();

  const { currentRoom, setCurrentRoom } = useCurrentRoom();

  if (currentRoom.players.length < 2) {
    return <h1>O'yin topilmadi yoki allaqachon tugagan</h1>;
  }

  return (
    <GameBoard
      gameMode="online"
      opponentName={"Jumanazar"}
      opponentPairs={45}
    />
  );
};

export default OnlineGamePageComponent;
