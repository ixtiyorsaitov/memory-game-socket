"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ArrowLeft, MessageCircle, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { GameStats } from "./game-stats";
import { MemoryCardsGrid } from "./memory-cards-grid";
import { GameChat } from "./game-chat";
import { GameCompletionMessage } from "./game-completion-message";
import { Card, CardContent } from "@/components/ui/card";
import { cardEmojis } from "@/lib/constants";

interface GameBoardProps {
  gameMode: "single" | "online";
  playerName: string;
  onBackToLobby?: () => void;
  opponentName?: string;
  opponentPairs?: number;
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
  playerName,
  onBackToLobby,
  opponentName = "Opponent",
  opponentPairs = 0,
}: GameBoardProps) {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const router = useRouter();

  // Initialize cards
  useEffect(() => {
    const shuffledCards = cardEmojis
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledCards);
  }, []);

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

  // Mock incoming messages for demo
  useEffect(() => {
    if (gameMode === "online") {
      const mockMessages = [
        { sender: opponentName, message: "Good luck!", delay: 2000 },
        { sender: opponentName, message: "Nice move!", delay: 15000 },
        { sender: opponentName, message: "This is challenging!", delay: 30000 },
      ];

      mockMessages.forEach(({ sender, message, delay }) => {
        setTimeout(() => {
          setChatMessages((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              sender,
              message,
              timestamp: new Date(),
              isOwn: false,
            },
          ]);
        }, delay);
      });
    }
  }, [gameMode, opponentName]);

  const handleCardClick = (cardId: number) => {
    if (!gameStarted) setGameStarted(true);

    const card = cards[cardId];
    if (card.isFlipped || card.isMatched || flippedCards.length === 2) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
    );

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
          setMatchedPairs((prev) => prev + 1);
          setFlippedCards([]);
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
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    const shuffledCards = cardEmojis
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setTime(0);
    setGameStarted(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now(),
        sender: playerName,
        message: newMessage.trim(),
        timestamp: new Date(),
        isOwn: true,
      };
      setChatMessages((prev) => [...prev, message]);
      setNewMessage("");
      // Here you would send the message via socket
      console.log("Sending message:", message);
    }
  };

  const isGameComplete = matchedPairs === 16;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onBackToLobby || (() => router.push("/"))}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Lobby
            </Button>
            <Badge variant="secondary">
              {gameMode === "single" ? "Single Player" : "Online Game"}
            </Badge>
            <Badge variant="outline">{playerName}</Badge>
          </div>
          <div className="flex items-center gap-2">
            {gameMode === "online" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="relative"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat
                {chatMessages.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs"
                  >
                    {chatMessages.filter((msg) => !msg.isOwn).length}
                  </Badge>
                )}
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Game Area */}
          <div className="xl:col-span-3">
            <GameStats
              gameMode={gameMode}
              playerName={playerName}
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
              onResetGame={resetGame}
            />

            {/* Reset Button - Only for Single Player */}
            {gameMode === "single" && (
              <div className="flex justify-center mb-6">
                <Button variant="outline" onClick={resetGame}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Game
                </Button>
              </div>
            )}

            <MemoryCardsGrid cards={cards} onCardClick={handleCardClick} />

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
          {gameMode === "online" && (
            <div
              className={`xl:col-span-1 ${
                isChatOpen ? "block" : "hidden xl:block"
              }`}
            >
              <GameChat
                playerName={playerName}
                opponentName={opponentName}
                messages={chatMessages}
                newMessage={newMessage}
                onNewMessageChange={setNewMessage}
                onSendMessage={handleSendMessage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
