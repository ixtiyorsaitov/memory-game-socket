import { GameBoard } from "@/components/shared/game-board/game-board";

export default function SinglePlayerPage() {
  // const [playerName, setPlayerName] = useState("");
  // const router = useRouter();

  // useEffect(() => {
  //   const savedName = localStorage.getItem("playerName");
  //   if (!savedName) {
  //     router.push("/");
  //   } else {
  //     setPlayerName(savedName);
  //   }
  // }, [router]);

  // const handleBackToLobby = () => {
  //   router.push("/lobby");
  // };

  // if (!playerName) {
  //   return (
  //     <div className="min-h-screen bg-background flex items-center justify-center">
  //       Loading...
  //     </div>
  //   );
  // }

  return (
    // <GameBoard
    //   gameMode="single"
    //   playerName={playerName}
    //   onBackToLobby={handleBackToLobby}
    // />
    <>Single game page</>
  );
}
