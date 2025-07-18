"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GameBoard } from "@/components/shared/game-board/game-board";
import { useSocket } from "@/components/providers/socket-context";
import { useCurrentRoom } from "@/hooks/use-current-room";
import { IRoom } from "@/types";

export default function OnlineGamePage() {
  const [playerName, setPlayerName] = useState("");

  const router = useRouter();
  const socket = useSocket();

  const pathName = usePathname();
  const searchParams = useSearchParams();

  const { currentRoom, setCurrentRoom } = useCurrentRoom();

  useEffect(() => {
    const savedName = localStorage.getItem("playerName");
    if (!savedName) {
      router.push("/");
    } else {
      setPlayerName(savedName);
    }
    console.log(currentRoom);
  }, [router]);

  // Brauzer back/forward tugmalarini kuzatish
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      console.log("Brauzer back/forward bosildi:", window.location.pathname);
      console.log("PopState event:", event);
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      console.log("Sahifa yopilmoqda yoki reload bo'lmoqda");
    };

    // Brauzer history o'zgarishini kuzatish
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Pathname o'zgarishini kuzatish (programmatic navigation uchun)
  useEffect(() => {
    console.log("Pathname o'zgardi:", pathName);
  }, [pathName]);

  useEffect(() => {
    socket.emit("game:room");
  }, []);

  useEffect(() => {
    socket.on("game:get-room", (data: IRoom) => {
      setCurrentRoom(data);
      console.log("kelgan room", data);
    });

    // Cleanup function
    return () => {
      socket.off("game:get-room");
    };
  }, [socket, setCurrentRoom]);

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

  if (currentRoom.players.length < 2) {
    return <h1>O'yin topilmadi yoki allaqachon tugagan</h1>;
  }

  return (
    <GameBoard
      gameMode="online"
      playerName={playerName}
      onBackToLobby={handleBackToLobby}
      opponentName={"Jumanazar"}
      opponentPairs={45}
    />
  );
}
