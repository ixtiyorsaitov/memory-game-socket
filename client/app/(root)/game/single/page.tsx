import { GameBoard } from "@/components/shared/game-board/game-board";
import { cardEmojis } from "@/lib/constants";
import Head from "next/head";

export default function SinglePlayerPage() {
  return (
    <>
      <Head>
        <title>Single Memory Card Game</title>
        <meta name="description" content="Single mode memory card game" />
        <main>
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
        </main>
      </Head>
    </>
  );
}
