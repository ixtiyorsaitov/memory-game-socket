"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Users, Play, User } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface MainLobbyProps {
  playerName: string;
}

// Mock online users data
const onlineUsers = [
  { id: 1, name: "Alice", status: "online" },
  { id: 2, name: "Bob", status: "playing" },
  { id: 3, name: "Charlie", status: "online" },
  { id: 4, name: "Diana", status: "online" },
  { id: 5, name: "Eve", status: "playing" },
];

export function MainLobby({ playerName }: MainLobbyProps) {
  const [sentInvites, setSentInvites] = useState<number[]>([]);
  const [receivedInvites, setReceivedInvites] = useState<
    { id: number; from: string }[]
  >([]);
  const router = useRouter();

  const handleInviteUser = (userId: number) => {
    setSentInvites((prev) => [...prev, userId]);
    // Here you would send socket invitation
    console.log(`Inviting user ${userId}`);
  };

  const handleAcceptInvite = (inviteId: number) => {
    setReceivedInvites((prev) =>
      prev.filter((invite) => invite.id !== inviteId)
    );
    router.push("/game/online");
  };

  const handleDeclineInvite = (inviteId: number) => {
    setReceivedInvites((prev) =>
      prev.filter((invite) => invite.id !== inviteId)
    );
  };

  const handleSinglePlayerClick = () => {
    router.push("/game/single");
  };

  const handleOnlineGameClick = () => {
    router.push("/game/online");
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Memory Card Game</h1>
            <Badge variant="secondary">Welcome, {playerName}!</Badge>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Online Users */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Online Players ({onlineUsers.length})
              </CardTitle>
              <CardDescription>Players currently online</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Received Invitations */}
              {receivedInvites.length > 0 && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Game Invitations
                  </h4>
                  {receivedInvites.map((invite) => (
                    <div
                      key={invite.id}
                      className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded mb-2"
                    >
                      <span className="text-sm">
                        {invite.from} invited you to play
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAcceptInvite(invite.id)}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeclineInvite(invite.id)}
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Online Users List */}
              <div className="space-y-3">
                {onlineUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          user.status === "online" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {user.status}
                      </Badge>
                      {user.status === "online" && user.name !== playerName && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleInviteUser(user.id)}
                          disabled={sentInvites.includes(user.id)}
                        >
                          {sentInvites.includes(user.id) ? "Invited" : "Invite"}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Game Modes */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Choose Game Mode</CardTitle>
              <CardDescription>Select how you want to play</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Single Player */}
                <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50">
                  <CardHeader className="text-center">
                    <User className="h-12 w-12 mx-auto text-primary mb-2" />
                    <CardTitle className="text-xl">Single Player</CardTitle>
                    <CardDescription>
                      Play alone and improve your memory skills
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      onClick={handleSinglePlayerClick}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Single Game
                    </Button>
                  </CardContent>
                </Card>

                {/* Online Multiplayer */}
                <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50">
                  <CardHeader className="text-center">
                    <Users className="h-12 w-12 mx-auto text-primary mb-2" />
                    <CardTitle className="text-xl">
                      Online Multiplayer
                    </CardTitle>
                    <CardDescription>
                      Play with other players online
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" onClick={handleOnlineGameClick}>
                      <Users className="h-4 w-4 mr-2" />
                      Play Online
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Stats */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Game Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">
                  Games Played
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-muted-foreground">Games Won</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-muted-foreground">Best Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">0s</div>
                <div className="text-sm text-muted-foreground">Best Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
