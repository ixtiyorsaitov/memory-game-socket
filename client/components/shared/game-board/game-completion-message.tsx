"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, RotateCcw } from "lucide-react";

interface GameCompletionMessageProps {
  isGameComplete: boolean;
  gameMode: "single" | "online";
  matchedPairs: number;
  opponentPairs: number;
  opponentName: string;
  moves: number;
  time: number;
  // onResetGame: () => void;
}

export function GameCompletionMessage({
  isGameComplete,
  gameMode,
  matchedPairs,
  opponentPairs,
  opponentName,
  moves,
  time,
}: // onResetGame,
GameCompletionMessageProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isGameComplete) {
    return null;
  }

  return (
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
        {/* {gameMode === "single" && (
          <Button
            onClick={onResetGame}
            className="bg-green-600 hover:bg-green-700"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Play Again
          </Button>
        )} */}
      </CardContent>
    </Card>
  );
}
