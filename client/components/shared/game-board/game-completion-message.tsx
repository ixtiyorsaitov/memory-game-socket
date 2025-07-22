"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Trophy, RotateCcw, Frown, Scale } from "lucide-react";

interface GameCompletionMessageProps {
  isGameComplete: boolean;
  gameMode: "single" | "online";
  matchedPairs: number;
  opponentPairs: number;
  opponentName: string;
  moves: number;
  // onResetGame: () => void;
}

export function GameCompletionMessage({
  isGameComplete,
  gameMode,
  matchedPairs,
  opponentPairs,
  opponentName,
  moves,
}: // onResetGame,
GameCompletionMessageProps) {
  if (!isGameComplete) {
    return null;
  }

  return (
    <Card
      className={cn(
        "mb-6",
        matchedPairs > opponentPairs
          ? "border-green-500 bg-green-50 dark:bg-green-950"
          : matchedPairs < opponentPairs
          ? "border-red-500 bg-red-50 dark:bg-red-950"
          : "border-yellow-500 bg-yellow-50 dark:bg-yellow-950"
      )}
    >
      <CardContent className="p-6 text-center">
        {matchedPairs > opponentPairs ? (
          <Trophy className="h-12 w-12 mx-auto mb-4 text-green-600" />
        ) : matchedPairs < opponentPairs ? (
          <Frown className="h-12 w-12 mx-auto mb-4 text-red-600" />
        ) : (
          <Scale className="h-12 w-12 mx-auto mb-4 text-yellow-600" />
        )}
        <h2
          className={cn(
            "text-2xl font-bold mb-2",
            matchedPairs > opponentPairs
              ? "text-green-800 dark:text-green-200"
              : matchedPairs < opponentPairs
              ? "text-red-800 dark:text-red-200"
              : "text-yellow-800 dark:text-yellow-200"
          )}
        >
          {gameMode === "single"
            ? "Congratulations!"
            : matchedPairs > opponentPairs
            ? "You Won!"
            : matchedPairs < opponentPairs
            ? "You Lost!"
            : "Draw!"}
        </h2>
        <p
          className={cn(
            "mb-4",
            matchedPairs > opponentPairs
              ? "text-green-700 dark:text-green-300"
              : matchedPairs < opponentPairs
              ? "text-red-700 dark:text-red-300"
              : "text-yellow-700 dark:text-yellow-300"
          )}
        >
          {gameMode === "single"
            ? `You completed the game in ${moves} moves!`
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
