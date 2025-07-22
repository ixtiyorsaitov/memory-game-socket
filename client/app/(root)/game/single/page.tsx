import { GameBoard } from "@/components/shared/game-board/game-board";
import { cardEmojis } from "@/lib/constants";

export default function SinglePlayerPage() {
  return (
    <GameBoard
      shuffleCards={cardEmojis
        .sort(() => Math.random() - 0.5)
        .map((emoji, index) => ({
          id: index,
          emoji,
          isFlipped: false,
          isMatched: false,
        }))}
      gameMode="single"
    />
  );
}
