import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { SendHorizonal } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/use-user";
import { useSocket } from "@/components/providers/socket-context";

interface Message {
  text: string;
  senderId: string;
}

const GameChat = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.on("game:get-chat", (data: Message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.text, senderId: data.senderId },
      ]);

      console.log(data);
    });
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      console.log(input);

      socket.emit("game:chat", input);
      setInput("");
    }
  };
  useEffect(() => console.log(messages), [messages]);

  return (
    <Card className="w-full max-w-md mx-auto flex flex-col h-[450px]">
      <CardHeader>
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-start gap-3",
                  message.senderId === user.socketId
                    ? "justify-end"
                    : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-lg p-3 max-w-[70%]",
                    message.senderId === user.socketId
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <form
          onSubmit={handleSendMessage}
          className="flex w-full items-center space-x-2"
        >
          <Input
            id="message"
            placeholder="Xabar yozing..."
            className="flex-1"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" size="icon">
            <SendHorizonal className="h-4 w-4" />
            <span className="sr-only">Xabar yuborish</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default GameChat;
