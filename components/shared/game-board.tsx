"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ArrowLeft, RotateCcw, Timer, Trophy, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface GameBoardProps {
  gameMode: "single" | "online";
  playerName: string;
  onBackToLobby?: () => void;
  opponentName?: string;
  opponentPairs?: number;
}

// Card emojis for the memory game
const cardEmojis = [
  "🎮",
  "🎯",
  "🎲",
  "🎪",
  "🎨",
  "🎭",
  "🎪",
  "🎯",
  "🚀",
  "⭐",
  "🌟",
  "💎",
  "🔥",
  "⚡",
  "🌈",
  "🎊",
  "🎮",
  "🎯",
  "🎲",
  "🎪",
  "🎨",
  "🎭",
  "🎪",
  "🎯",
  "🚀",
  "⭐",
  "🌟",
  "💎",
  "🔥",
  "⚡",
  "🌈",
  "🎊",
];

interface CardType {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
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

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && matchedPairs < 16) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, matchedPairs]);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isGameComplete = matchedPairs === 16;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
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
          <ThemeToggle />
        </div>

        {/* Game Stats */}
        {gameMode === "single" ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Timer className="h-5 w-5 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{formatTime(time)}</div>
                <div className="text-sm text-muted-foreground">Time</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="h-5 w-5 mx-auto mb-2 text-yellow-600" />
                <div className="text-2xl font-bold">{moves}</div>
                <div className="text-sm text-muted-foreground">Moves</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {matchedPairs}
                </div>
                <div className="text-sm text-muted-foreground">Pairs Found</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {16 - matchedPairs}
                </div>
                <div className="text-sm text-muted-foreground">Remaining</div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Player Stats */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold">{playerName} (You)</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {matchedPairs}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Pairs Found
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {moves}
                    </div>
                    <div className="text-sm text-muted-foreground">Moves</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Opponent Stats */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <User className="h-5 w-5 text-red-600" />
                  <span className="font-semibold">{opponentName}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {opponentPairs}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Pairs Found
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {16 - matchedPairs - opponentPairs}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Remaining
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Game Complete Message */}
        {isGameComplete && (
          <Card className="mb-6 border-green-500 bg-green-50 dark:bg-green-950">
            <CardContent className="p-6 text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
                {gameMode === "single"
                  ? "Congratulations!"
                  : matchedPairs > opponentPairs
                  ? "You Won!"
                  : matchedPairs < opponentPairs
                  ? "You Lost!"
                  : "It's a Tie!"}
              </h2>
              <p className="text-green-700 dark:text-green-300 mb-4">
                {gameMode === "single"
                  ? `You completed the game in ${moves} moves and ${formatTime(
                      time
                    )}!`
                  : `Final Score: You ${matchedPairs} - ${opponentPairs} ${opponentName}`}
              </p>
              {gameMode === "single" && (
                <Button
                  onClick={resetGame}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Play Again
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Reset Button - Only for Single Player */}
        {gameMode === "single" && (
          <div className="flex justify-center mb-6">
            <Button variant="outline" onClick={resetGame}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Game
            </Button>
          </div>
        )}

        {/* Game Board */}
        <div className="grid grid-cols-8 gap-2 max-w-2xl mx-auto">
          {cards.map((card) => (
            <Card
              key={card.id}
              className={`aspect-square cursor-pointer transition-all duration-300 hover:scale-105 ${
                card.isMatched
                  ? "bg-green-100 dark:bg-green-900 border-green-500"
                  : card.isFlipped
                  ? "bg-blue-100 dark:bg-blue-900 border-blue-500"
                  : "bg-muted hover:bg-muted/80"
              }`}
              onClick={() => handleCardClick(card.id)}
            >
              <CardContent className="p-0 h-full flex items-center justify-center">
                {card.isFlipped || card.isMatched ? (
                  <span className="text-2xl">{card.emoji}</span>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg flex items-center justify-center">
                    <span className="text-primary/60 text-xl">?</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Online Game Info */}
        {gameMode === "online" && (
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Connected to game server</span>
                </div>
                <Badge variant="outline">Waiting for opponent...</Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
