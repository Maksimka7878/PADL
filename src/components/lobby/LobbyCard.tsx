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
    <Card className="group overflow-hidden border-white/[0.06] bg-surface hover:border-lime/20 transition-all duration-500 hover:shadow-[0_0_40px_#BFFF0008]">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1.5">
            <h3 className="font-display font-bold text-lg text-white group-hover:text-lime transition-colors duration-300">{lobby.court_name}</h3>
            <div className="flex items-center text-xs text-white/35">
              <MapPin className="mr-1.5 h-3 w-3 text-violet" /> {lobby.metro}
            </div>
          </div>
          <div className="flex gap-1.5 items-center bg-white/[0.04] p-1.5 rounded-xl border border-white/[0.06]">
            <LevelBadge level={lobby.min_level} size="sm" />
            <span className="text-white/15 px-0.5 text-[10px]">/</span>
            <LevelBadge level={lobby.max_level} size="sm" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-2 space-y-4">
        <div className="flex items-center text-sm font-medium text-white/70">
          <Calendar className="mr-2 h-4 w-4 text-hot-pink" />
          {new Date(lobby.start_time).toLocaleString("ru-RU", {
            weekday: "short",
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        {lobby.description && (
          <p className="text-xs text-white/30 line-clamp-2">{lobby.description}</p>
        )}

        <div className="space-y-2.5">
          <div className="flex justify-between text-[10px] items-center">
            <span className="flex items-center gap-1.5 uppercase tracking-[0.15em] text-white/30">
              <Users className="h-3 w-3" /> Слоты: {lobby.participants_count}/{lobby.required_players}
            </span>
            <span className="text-lime font-display font-bold text-xs">{Math.round(fillPercentage)}%</span>
          </div>
          <Progress value={fillPercentage} className="h-1.5" />
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <Button
          className="w-full font-display font-black uppercase tracking-[0.15em] text-xs h-11 transition-all duration-300"
          variant={isFull ? "secondary" : isLevelCompatible ? "default" : "outline"}
          disabled={disabled || !isLevelCompatible || isFull}
          onClick={handleJoin}
        >
          {isFull
            ? "Матч укомплектован"
            : isLevelCompatible
            ? "Вступить в игру"
            : "Уровень не подходит"}
        </Button>
      </CardFooter>
    </Card>
  );
}
