"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X } from "lucide-react";
import { useUIStore } from "@/store/ui";
import { sendMessage } from "@/lib/actions";
import { toast } from "sonner";

interface Message {
  id: string;
  user_name: string;
  user_image?: string | null;
  content: string;
  created_at: string;
  is_own?: boolean;
}

interface LobbyChatProps {
  lobbyId: string;
  initialMessages?: Message[];
  currentUserName?: string;
}

export function LobbyChat({ lobbyId, initialMessages = [], currentUserName }: LobbyChatProps) {
  const { isChatOpen, closeChat } = useUIStore();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isChatOpen) return;

    // Poll for new messages every 5 seconds
    const interval = setInterval(async () => {
      // In production, this would fetch from the API
      // For now, we'll just keep the local state
    }, 5000);

    return () => clearInterval(interval);
  }, [isChatOpen, lobbyId]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    const messageContent = newMessage;
    setNewMessage("");

    // Optimistic update
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      user_name: currentUserName || "Вы",
      content: messageContent,
      created_at: new Date().toISOString(),
      is_own: true,
    };
    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      await sendMessage(lobbyId, messageContent);
    } catch {
      toast.error("Не удалось отправить сообщение");
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
      setNewMessage(messageContent);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isChatOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:inset-auto lg:right-4 lg:bottom-4 lg:w-96 lg:h-[500px]">
      {/* Backdrop for mobile */}
      <div
        className="absolute inset-0 bg-black/50 lg:hidden"
        onClick={closeChat}
      />

      {/* Chat container */}
      <div className="absolute inset-x-0 bottom-0 h-[70vh] lg:relative lg:h-full bg-zinc-950 border border-zinc-800 rounded-t-2xl lg:rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900">
          <h3 className="font-bold text-sm">Чат лобби</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={closeChat}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-zinc-500 py-8">
              <p className="text-sm">Пока нет сообщений</p>
              <p className="text-xs mt-1">Начните общение с другими игроками</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.is_own ? "flex-row-reverse" : ""}`}
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  {message.user_image ? (
                    <Image
                      src={message.user_image}
                      alt=""
                      width={32}
                      height={32}
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    <span className="text-xs">
                      {message.user_name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div
                  className={`max-w-[70%] ${message.is_own ? "text-right" : ""}`}
                >
                  <p className="text-xs text-zinc-500 mb-1">
                    {message.user_name}
                  </p>
                  <div
                    className={`rounded-2xl px-4 py-2 text-sm ${message.is_own
                        ? "bg-emerald-500 text-black rounded-tr-none"
                        : "bg-zinc-800 rounded-tl-none"
                      }`}
                  >
                    {message.content}
                  </div>
                  <p className="text-[10px] text-zinc-600 mt-1">
                    {new Date(message.created_at).toLocaleTimeString("ru-RU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900">
          <div className="flex gap-2">
            <Input
              placeholder="Написать сообщение..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSending}
              className="flex-1 bg-zinc-950 border-zinc-800"
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={isSending || !newMessage.trim()}
              className="bg-emerald-500 hover:bg-emerald-600 text-black"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
