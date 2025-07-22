import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-user";
import { Timer, Trophy, User } from "lucide-react";

interface GameStatsProps {
  gameMode: "single" | "online";
  matchedPairs: number;
  moves: number;
  opponentName: string;
  opponentPairs: number;
}

export function GameStats({
  gameMode,
  matchedPairs,
  moves,
  opponentName,
  opponentPairs,
}: GameStatsProps) {
  const { user } = useAuth();

  return (
    <>
      {gameMode === "single" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
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
                <span className="font-semibold">{user.name} (You)</span>
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
                  <div className="text-sm text-muted-foreground">Remaining</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
