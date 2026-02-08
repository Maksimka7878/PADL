"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LevelBadge } from "@/components/lobby/LevelBadge";
import { useFeedStore } from "@/store/feed";
import type { ScoredLobby } from "@/lib/feed-algorithm";
import { MapPin, Calendar, Users, Heart, Sparkles, Clock, Wallet } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface FeedCardProps {
  lobby: ScoredLobby;
  showMatchReasons?: boolean;
}

export function FeedCard({ lobby, showMatchReasons = true }: FeedCardProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFeedStore();
  const favorite = isFavorite(lobby.id);

  const fillPercent = (lobby.participants_count / lobby.required_players) * 100;
  const spotsLeft = lobby.required_players - lobby.participants_count;
  const pricePerPerson = lobby.price_per_hour
    ? Math.round(lobby.price_per_hour / lobby.required_players)
    : null;

  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line
    setNow(Date.now());
  }, []);

  const startTime = new Date(lobby.start_time);
  const isToday = now && startTime.toDateString() === new Date(now).toDateString();
  const isTomorrow = now &&
    startTime.toDateString() ===
    new Date(now + 86400000).toDateString();

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorite) {
      removeFavorite(lobby.id);
      toast("Удалено из избранного");
    } else {
      addFavorite(lobby.id);
      toast.success("Добавлено в избранное");
    }
  };

  const formatDate = () => {
    if (isToday) return "Сегодня";
    if (isTomorrow) return "Завтра";
    return startTime.toLocaleDateString("ru-RU", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <Link href={`/dashboard/lobbies/${lobby.id}`}>
      <Card className="overflow-hidden border-2 bg-zinc-950 shadow-xl shadow-emerald-900/10 hover:border-emerald-500/50 transition-all duration-300 group">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base truncate group-hover:text-emerald-400 transition-colors">
                  {lobby.court_name}
                </h3>
                {lobby.score >= 85 && (
                  <span className="shrink-0 px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded uppercase">
                    TOP
                  </span>
                )}
              </div>
              <div className="flex items-center text-xs text-zinc-500 mt-1">
                <MapPin className="h-3 w-3 mr-1 shrink-0" />
                <span className="truncate">{lobby.metro}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Favorite button */}
              <button
                onClick={toggleFavorite}
                className={`p-1.5 rounded-lg transition-colors ${favorite
                  ? "bg-red-500/20 text-red-400"
                  : "bg-zinc-800 text-zinc-500 hover:text-red-400"
                  }`}
              >
                <Heart className={`h-4 w-4 ${favorite ? "fill-current" : ""}`} />
              </button>

              {/* Level badges */}
              <div className="flex gap-1 items-center bg-zinc-900 p-1.5 rounded-lg border border-zinc-800">
                <LevelBadge level={lobby.min_level} size="sm" />
                <span className="text-zinc-600 px-0.5 text-xs">/</span>
                <LevelBadge level={lobby.max_level} size="sm" />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="py-2 space-y-3">
          {/* Date & Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-emerald-500" />
              <span className="font-medium">{formatDate()}</span>
              <span className="text-zinc-500">
                {startTime.toLocaleTimeString("ru-RU", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            {pricePerPerson && (
              <div className="flex items-center gap-1 text-sm text-zinc-400">
                <Wallet className="h-3.5 w-3.5" />
                <span>~{pricePerPerson.toLocaleString()} ₽</span>
              </div>
            )}
          </div>

          {/* Match reasons */}
          {showMatchReasons && lobby.matchReasons.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {lobby.matchReasons.slice(0, 3).map((reason, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-medium rounded-full"
                >
                  <Sparkles className="h-2.5 w-2.5" />
                  {reason}
                </span>
              ))}
            </div>
          )}

          {/* Fill progress */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500 flex items-center gap-1">
                <Users className="h-3 w-3" />
                Игроков
              </span>
              <span className="text-emerald-400 font-bold">
                {lobby.participants_count}/{lobby.required_players}
              </span>
            </div>
            <Progress
              value={fillPercent}
              className="h-1.5 bg-zinc-800"
            />
          </div>
        </CardContent>

        <CardFooter className="pt-2">
          <Button
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold group-hover:shadow-lg group-hover:shadow-emerald-500/25 transition-all"
            disabled={spotsLeft === 0}
          >
            {spotsLeft === 0 ? (
              "Мест нет"
            ) : (
              <>
                Присоединиться
                <span className="ml-2 px-1.5 py-0.5 bg-black/20 rounded text-xs">
                  {spotsLeft} {spotsLeft === 1 ? "место" : spotsLeft < 5 ? "места" : "мест"}
                </span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}

// Horizontal card for "Starting Soon" section
export function FeedCardCompact({ lobby }: { lobby: ScoredLobby }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line
    setNow(Date.now());
  }, []);

  const startTime = new Date(lobby.start_time);
  const hoursUntil = now ? Math.round(
    (startTime.getTime() - now) / (1000 * 60 * 60)
  ) : null;

  return (
    <Link href={`/dashboard/lobbies/${lobby.id}`}>
      <div className="flex items-center gap-3 p-3 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-emerald-500/50 transition-colors">
        <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center shrink-0">
          <Clock className="h-6 w-6 text-emerald-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate">{lobby.court_name}</p>
          <p className="text-xs text-zinc-500">{lobby.metro}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-emerald-400">
            {hoursUntil !== null && (hoursUntil <= 0 ? "Скоро" : `${hoursUntil}ч`)}
          </p>
          <p className="text-xs text-zinc-500">
            {lobby.participants_count}/{lobby.required_players}
          </p>
        </div>
      </div>
    </Link>
  );
}
