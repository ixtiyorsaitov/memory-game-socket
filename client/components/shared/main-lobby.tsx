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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Users, Play, User, Shield, ShieldOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { useAuth } from "@/hooks/use-user";
import { IUser } from "@/types";
import { useOnlineUsers } from "@/hooks/use-online-users";
import ReceivingAlert from "@/app/(root)/_components/receiving-alert";

interface MainLobbyProps {
  playerName: string | null;
  onInvitePreferenceChange: (allow: boolean) => void;
}

// Mock online users data with invite preferences
// const onlineUsers = [
//   { id: 1, name: "Alice", status: "online", allowInvites: true },
//   { id: 2, name: "Bob", status: "playing", allowInvites: true },
//   { id: 3, name: "Charlie", status: "online", allowInvites: false },
//   { id: 4, name: "Diana", status: "online", allowInvites: true },
//   { id: 5, name: "Eve", status: "playing", allowInvites: false },
// ];

export function MainLobby({
  playerName,
  onInvitePreferenceChange,
}: MainLobbyProps) {
  const [sentInvites, setSentInvites] = useState<number[]>([]);
  const [receivedInvites, setReceivedInvites] = useState<
    { id: number; from: string }[]
  >([]);
  const socket = useRef<ReturnType<typeof io> | null>(null);
  const router = useRouter();
  const { user, setUser } = useAuth();
  const { onlineUsers, setOnlineUsers } = useOnlineUsers();
  const [receivingAlertOpen, setReceivingAlertOpen] = useState<boolean>(false);
  const [invitingUser, setInvitingUser] = useState<IUser | null>(null);

  const handleInviteUser = (to: string) => {
    // setSentInvites((prev) => [...prev, userId]);
    // Here you would send socket invitation
    socket.current?.emit("invite:send", {
      to,
    });
  };

  const handleAcceptInvite = (inviteId: string) => {
    // setReceivedInvites((prev) =>
    //   prev.filter((invite) => invite.id !== inviteId)
    // );
    // router.push("/game/online");
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

  // Connect to websocket
  useEffect(() => {
    socket.current = io("ws://localhost:5000");
  }, []);
  useEffect(() => {
    if (user.name) {
      socket.current?.on("user:get-socket-id", (id) => {
        setUser({ ...user, socketId: id });
      });
      socket.current?.emit("user:add-online", user);
      socket.current?.on("user:get-all", (data: IUser[]) => {
        setOnlineUsers(data);
      });
    }
  }, []);
  useEffect(() => {
    // Receive invited game
    socket.current?.on("invite:receive", (data) => {
      setReceivingAlertOpen(true);
      setInvitingUser(data.from);
    });
    socket.current?.on("user:get-allow-invites", (data) => {
      // if (JSON.stringify(data) !== JSON.stringify(user)) {
      // }
      // setOnlineUsers(
      //   onlineUsers.map((ou) => (ou.socketId === data.socketId ? data : ou))
      // );
      // console.log(data);
    });
  }, [socket]);
  useEffect(() => {
    console.log(onlineUsers);
    console.log("userid", user.socketId);
  }, [onlineUsers]);

  useEffect(() => {
    socket.current?.emit("user:edit-alow-invites", user.allowInvites);
  }, [user.allowInvites]);

  return (
    <>
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

          {/* Invite Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {user.allowInvites ? (
                  <Shield className="h-5 w-5 text-green-600" />
                ) : (
                  <ShieldOff className="h-5 w-5 text-red-600" />
                )}
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Control who can invite you to games
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch
                  id="allow-invites"
                  checked={user.allowInvites}
                  onCheckedChange={onInvitePreferenceChange}
                />
                <Label
                  htmlFor="allow-invites"
                  className="flex items-center gap-2"
                >
                  {user.allowInvites ? (
                    <>
                      <Shield className="h-4 w-4 text-green-600" />
                      Allow game invitations
                    </>
                  ) : (
                    <>
                      <ShieldOff className="h-4 w-4 text-red-600" />
                      Block game invitations
                    </>
                  )}
                </Label>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {user.allowInvites
                  ? "Other players can send you game invitations"
                  : "You won't receive any game invitations from other players"}
              </p>
            </CardContent>
          </Card>

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
                {/* Online Users List */}
                <div className="space-y-3">
                  {onlineUsers
                    .filter((u) => u.socketId !== user.socketId)
                    .map((item) => {
                      console.log(item.name);

                      return (
                        <div
                          key={item.socketId}
                          className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="font-medium">{item.name}</span>
                            {!item.allowInvites && (
                              <ShieldOff className="h-3 w-3 text-red-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                user.status === "online"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {item.status}
                            </Badge>
                            {item.status === "online" && item.allowInvites && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleInviteUser(item.socketId)}
                              >
                                Invite
                              </Button>
                            )}
                            {item.status === "online" &&
                              item.allowInvites === false && (
                                <Badge
                                  variant="outline"
                                  className="text-xs text-red-600"
                                >
                                  Private
                                </Badge>
                              )}
                          </div>
                        </div>
                      );
                    })}
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
                      <Button
                        className="w-full"
                        onClick={handleOnlineGameClick}
                      >
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
                  <div className="text-sm text-muted-foreground">
                    Best Score
                  </div>
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
      {receivingAlertOpen && (
        <ReceivingAlert
          open={receivingAlertOpen}
          setOpen={setReceivingAlertOpen}
          user={invitingUser}
        />
      )}
    </>
  );
}
