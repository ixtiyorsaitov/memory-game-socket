import Head from "next/head";
import LobbyPageComponent from "../_components/lobby-page";

export default function LobbyPage() {
  return (
    <>
      <Head>
        <title>Multiplayer Memory Card Game</title>
        <meta
          name="description"
          content="A fun memory card game with single player and online multiplayer modes"
        />
      </Head>
      <main>
        <LobbyPageComponent />
      </main>
    </>
  );
}
