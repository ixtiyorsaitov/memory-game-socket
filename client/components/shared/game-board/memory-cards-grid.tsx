"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { CardType } from "./game-board"; // Assuming CardType is defined here or in a similar file

interface MemoryCardsGridProps {
  cards: CardType[];
  onCardClick: (cardId: number) => void;
}

export function MemoryCardsGrid({ cards, onCardClick }: MemoryCardsGridProps) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-w-2xl mx-auto">
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
          onClick={() => onCardClick(card.id)}
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
  );
}
