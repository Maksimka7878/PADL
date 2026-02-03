"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { LevelBadge } from "./LevelBadge";
import { MapPin, Calendar, Users } from "lucide-react";

interface Lobby {
  id: string;
  court_name: string;
  metro: string;
  address: string;
  start_time: string;
  min_level: number;
  max_level: number;
  required_players: number;
  participants_count: number;
  description?: string;
}

interface LobbyCardProps {
  lobby: Lobby;
  userLevel?: number;
  onJoin?: (id: string) => Promise<void>;
  disabled?: boolean;
}

export function LobbyCard({ lobby, userLevel = 0, onJoin, disabled }: LobbyCardProps) {
  const isLevelCompatible = userLevel >= lobby.min_level && userLevel <= lobby.max_level;
  const isFull = lobby.participants_count >= lobby.required_players;
  const fillPercentage = (lobby.participants_count / lobby.required_players) * 100;

  const handleJoin = async () => {
    if (onJoin) {
      await onJoin(lobby.id);
    }
  };

  return (
    <Card className="overflow-hidden border-2 bg-zinc-950 text-white shadow-xl shadow-emerald-900/10 hover:border-zinc-700 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-emerald-400">{lobby.court_name}</h3>
            <div className="flex items-center text-xs text-zinc-400">
              <MapPin className="mr-1 h-3 w-3" /> {lobby.metro}
            </div>
          </div>
          <div className="flex gap-1 items-center bg-zinc-900 p-1.5 rounded-lg border border-zinc-800">
            <LevelBadge level={lobby.min_level} size="sm" />
            <span className="text-zinc-600 px-0.5 text-xs">/</span>
            <LevelBadge level={lobby.max_level} size="sm" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-2 space-y-4">
        <div className="flex items-center text-sm font-medium">
          <Calendar className="mr-2 h-4 w-4 text-emerald-500" />
          {new Date(lobby.start_time).toLocaleString("ru-RU", {
            weekday: "short",
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        {lobby.description && (
          <p className="text-xs text-zinc-500 line-clamp-2">{lobby.description}</p>
        )}

        <div className="space-y-2">
          <div className="flex justify-between text-[10px] items-center">
            <span className="flex items-center gap-1 uppercase tracking-wider text-zinc-500">
              <Users className="h-3 w-3" /> Слот: {lobby.participants_count}/{lobby.required_players}
            </span>
            <span className="text-emerald-500 font-mono">{Math.round(fillPercentage)}%</span>
          </div>
          <Progress value={fillPercentage} className="h-1.5 bg-zinc-800" />
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          className="w-full font-black uppercase tracking-widest text-xs h-10 transition-all duration-300"
          variant={isFull ? "secondary" : isLevelCompatible ? "default" : "outline"}
          disabled={disabled || !isLevelCompatible || isFull}
          onClick={handleJoin}
        >
          {isFull
            ? "Матч укомплектован"
            : isLevelCompatible
            ? "ВСТУПИТЬ В ИГРУ"
            : "УРОВЕНЬ НЕ ПОДХОДИТ"}
        </Button>
      </CardFooter>
    </Card>
  );
}
