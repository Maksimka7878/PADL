"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useUIStore } from "@/store/ui";
import { LobbyChat } from "./LobbyChat";

interface LobbyChatButtonProps {
  lobbyId: string;
  currentUserName?: string;
}

export function LobbyChatButton({ lobbyId, currentUserName }: LobbyChatButtonProps) {
  const { openChat, isChatOpen } = useUIStore();

  return (
    <>
      <Button
        variant="outline"
        className="w-full h-12 border-zinc-700"
        onClick={openChat}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Открыть чат
      </Button>
      {isChatOpen && (
        <LobbyChat
          lobbyId={lobbyId}
          currentUserName={currentUserName}
        />
      )}
    </>
  );
}
