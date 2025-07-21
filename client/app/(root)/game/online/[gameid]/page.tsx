"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CardType, GameBoard } from "@/components/shared/game-board/game-board";
import { useSocket } from "@/components/providers/socket-context";
import { useCurrentRoom } from "@/hooks/use-current-room";
import { IRoom } from "@/types";
import { useAuth } from "@/hooks/use-user";

export default function OnlineGamePage() {
  const router = useRouter();
  const socket = useSocket();
  const [shuffleCards, setShuffleCards] = useState<CardType[]>([]);

  const { currentRoom, setCurrentRoom } = useCurrentRoom();
  const { user } = useAuth();

  useEffect(() => {
    socket.emit("game:room");
    socket.emit("game:cards");
  }, []);

  useEffect(() => {
    socket.on("game:get-room", (data: IRoom) => {
      setCurrentRoom(data);
      console.log("kelgan room", data);
    });

    // Initialize cards
    socket.on("game:get-cards", (cards: CardType[]) => {
      setShuffleCards(cards);
    });
  }, [socket]);
  const handleBackToLobby = () => {
    router.push("/lobby");
  };

  if (currentRoom.players.length < 2) {
    return <h1>O'yin topilmadi yoki allaqachon tugagan</h1>;
  }

  return (
    <>
      {shuffleCards.length > 0 ? (
        <GameBoard
          shuffleCards={shuffleCards}
          gameMode="online"
          onBackToLobby={handleBackToLobby}
          opponentName={
            currentRoom.players.find((p) => p.socketId !== user.socketId)
              ?.name || "Player"
          }
          opponentPairs={0}
        />
      ) : (
        <h1>Loading...</h1>
      )}
    </>
  );
}
