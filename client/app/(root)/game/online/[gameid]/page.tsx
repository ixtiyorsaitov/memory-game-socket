"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GameBoard } from "@/components/shared/game-board/game-board";
import { useSocket } from "@/components/providers/socket-context";
import { useCurrentRoom } from "@/hooks/use-current-room";
import { IRoom } from "@/types";
import { useAuth } from "@/hooks/use-user";

export default function OnlineGamePage() {
  const router = useRouter();
  const socket = useSocket();

  const { currentRoom, setCurrentRoom } = useCurrentRoom();
  const { user } = useAuth();

  useEffect(() => {
    socket.emit("game:room");
  }, []);

  useEffect(() => {
    socket.on("game:get-room", (data: IRoom) => {
      setCurrentRoom(data);
      console.log("kelgan room", data);
    });
  }, [socket]);
  const handleBackToLobby = () => {
    router.push("/lobby");
  };

  if (currentRoom.players.length < 2) {
    return <h1>O'yin topilmadi yoki allaqachon tugagan</h1>;
  }

  return (
    <GameBoard
      gameMode="online"
      onBackToLobby={handleBackToLobby}
      opponentName={
        currentRoom.players.find((p) => p.socketId !== user.socketId)?.name ||
        "Player"
      }
      opponentPairs={0}
    />
  );
}
