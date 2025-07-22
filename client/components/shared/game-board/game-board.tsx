"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ArrowLeft, MessageCircle, RotateCcw } from "lucide-react";
import { GameStats } from "./game-stats";
import { MemoryCardsGrid } from "./memory-cards-grid";
import { GameCompletionMessage } from "./game-completion-message";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-user";
import GameChat from "./game-chat";
import { useCurrentRoom } from "@/hooks/use-current-room";
import { useSocket } from "@/components/providers/socket-context";

interface GameBoardProps {
  gameMode: "single" | "online";
  onBackToLobby?: () => void;
  opponentName?: string;
  opponentPairs?: number;
  shuffleCards: CardType[];
}

// Card emojis for the memory game

export interface CardType {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface ChatMessage {
  id: number;
  sender: string;
  message: string;
  timestamp: Date;
  isOwn: boolean;
}

export function GameBoard({
  gameMode,
  opponentName = "Opponent",
  shuffleCards,
}: GameBoardProps) {
  const [cards, setCards] = useState<CardType[]>(shuffleCards);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const { user } = useAuth();
  const { currentRoom } = useCurrentRoom();
  const [opponentPairs, setOppentPairs] = useState<number>(0);
  const [queue, setQueue] = useState<boolean>(
    currentRoom.admin === user.socketId
  );
  const socket = useSocket();

  useEffect(() => {
    setCards(shuffleCards);
  }, [shuffleCards]);

  // Timer for single player
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameMode === "single" && gameStarted && matchedPairs < 16) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameMode, gameStarted, matchedPairs]);
  useEffect(() => {
    socket.on("game:get-flip-card", (cardId: number) => {
      handleOpenCardByOpponent(cardId);
    });

    socket.on(
      "game:get-clear-flipped-cards",
      (clearFlipperCardsId: Array<number>) => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === clearFlipperCardsId[0] || c.id === clearFlipperCardsId[1]
              ? { ...c, isFlipped: false }
              : c
          )
        );
        setQueue(true);
      }
    );
    socket.on("game:get-match-cards", (clearFlipperCardsId: Array<number>) => {
      setCards((prev) =>
        prev.map((c) =>
          c.id === clearFlipperCardsId[0] || c.id === clearFlipperCardsId[1]
            ? { ...c, isMatched: true }
            : c
        )
      );
      setOppentPairs((prev) => prev + 1);
      setQueue(true);
    });
  }, [socket]);

  useEffect(() => {
    console.log("flippedList", flippedCards);
  }, [flippedCards]);

  const handleOpenCardByOpponent = (cardId: number) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
    );
  };

  const handleCardClick = (cardId: number) => {
    if (!gameStarted) setGameStarted(true);

    const card = cards[cardId];
    if (card.isFlipped || card.isMatched || flippedCards.length === 2) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards((prev) => [...prev, cardId]);

    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
    );
    socket.emit("game:flip-card", cardId);

    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1);
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards[firstId];
      const secondCard = cards[secondId];
      if (firstCard.emoji === secondCard.emoji) {
        // Match found
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true }
                : c
            )
          );
          socket.emit("game:match-cards", newFlippedCards);
          setMatchedPairs((prev) => prev + 1);
          setFlippedCards([]);
          setQueue(false);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          socket.emit("game:clear-flipped-cards", newFlippedCards);
          setFlippedCards([]);
          setQueue(false);
        }, 1000);
      }
    }
  };

  // const resetGame = () => {
  //   const shuffledCards = cardEmojis
  //     .sort(() => Math.random() - 0.5)
  //     .map((emoji, index) => ({
  //       id: index,
  //       emoji,
  //       isFlipped: false,
  //       isMatched: false,
  //     }));
  //   setCards(shuffledCards);
  //   setFlippedCards([]);
  //   setMatchedPairs(0);
  //   setMoves(0);
  //   setTime(0);
  //   setGameStarted(false);
  // };

  const isGameComplete = matchedPairs === 16;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          {/* <div className="flex items-center gap-4">
            <Button
              variant="outline"
              // onClick={onBackToLobby || (() => router.push("/"))}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Lobby
            </Button>

            <Badge variant="outline">{user.name}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div> */}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Game Area */}
          <div className="xl:col-span-3">
            <GameStats
              gameMode={gameMode}
              matchedPairs={matchedPairs}
              moves={moves}
              time={time}
              opponentName={opponentName}
              opponentPairs={opponentPairs}
            />

            <GameCompletionMessage
              isGameComplete={isGameComplete}
              gameMode={gameMode}
              matchedPairs={matchedPairs}
              opponentPairs={opponentPairs}
              opponentName={opponentName}
              moves={moves}
              time={time}
              // onResetGame={resetGame}
            />

            {/* Reset Button - Only for Single Player */}
            {/* {gameMode === "single" && (
              <div className="flex justify-center mb-6">
                <Button variant="outline" onClick={resetGame}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Game
                </Button>
              </div>
            )} */}

            <MemoryCardsGrid
              disabled={!queue}
              cards={cards}
              onCardClick={handleCardClick}
            />

            {/* Online Game Info */}
            {gameMode === "online" && (
              <Card className="mt-6">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm">Connected to game server</span>
                    </div>
                    <Badge variant="outline">Playing with {opponentName}</Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chat Panel - Only for Online Games */}
          {gameMode === "online" && <GameChat />}
        </div>
      </div>
    </div>
  );
}
