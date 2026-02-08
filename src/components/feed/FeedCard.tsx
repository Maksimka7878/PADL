"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LevelBadge } from "@/components/lobby/LevelBadge";
import { useFeedStore } from "@/store/feed";
import type { ScoredLobby } from "@/lib/feed-algorithm";
import { MapPin, Calendar, Users, Heart, Sparkles, Clock, Wallet, Zap, Star, Compass } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface FeedCardProps {
  lobby: ScoredLobby;
  showMatchReasons?: boolean;
  onJoin?: (id: string) => Promise<void>;
}

const RECOMMENDATION_BADGES: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  personalized: {
    label: "Для вас",
    icon: <Sparkles className="h-2.5 w-2.5" />,
    className: "bg-lime/20 text-lime border-lime/20",
  },
  popular: {
    label: "Популярное",
    icon: <Zap className="h-2.5 w-2.5" />,
    className: "bg-hot-pink/20 text-hot-pink border-hot-pink/20",
  },
  serendipity: {
    label: "Открытие",
    icon: <Compass className="h-2.5 w-2.5" />,
    className: "bg-cyan/20 text-cyan border-cyan/20",
  },
  friends: {
    label: "Друзья",
    icon: <Users className="h-2.5 w-2.5" />,
    className: "bg-violet/20 text-violet border-violet/20",
  },
  new: {
    label: "Новое",
    icon: <Star className="h-2.5 w-2.5" />,
    className: "bg-cyan/20 text-cyan border-cyan/20",
  },
};

export function FeedCard({ lobby, showMatchReasons = true, onJoin }: FeedCardProps) {
  const { addFavorite, removeFavorite, isFavorite, trackView, trackFavorite, trackUnfavorite } = useFeedStore();
  const favorite = isFavorite(lobby.id);

  const fillPercent = (lobby.participants_count / lobby.required_players) * 100;
  const spotsLeft = lobby.required_players - lobby.participants_count;
  const pricePerPerson = lobby.price_per_hour
    ? Math.round(lobby.price_per_hour / lobby.required_players)
    : null;

  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    // Track view when card is rendered
    trackView(lobby.court_name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      trackUnfavorite(lobby.court_name);
      toast("Удалено из избранного");
    } else {
      addFavorite(lobby.id);
      trackFavorite(lobby.court_name);
      toast.success("Добавлено в избранное ❤️");
    }
  };

  const handleJoin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onJoin) {
      await onJoin(lobby.id);
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

  const recBadge = RECOMMENDATION_BADGES[lobby.recommendationType];

  return (
    <Link href={`/dashboard/lobbies/${lobby.id}`}>
      <Card className="group overflow-hidden border-white/[0.06] bg-surface hover:border-lime/20 transition-all duration-500 hover:shadow-[0_0_40px_#BFFF0008]">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base truncate group-hover:text-lime transition-colors duration-300">
                  {lobby.court_name}
                </h3>
                {lobby.score >= 85 && (
                  <span className="shrink-0 px-1.5 py-0.5 bg-lime/20 text-lime text-[10px] font-display font-bold rounded-full uppercase tracking-wider border border-lime/20">
                    TOP
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex items-center text-xs text-white/35">
                  <MapPin className="h-3 w-3 mr-1 shrink-0 text-violet" />
                  <span className="truncate">{lobby.metro}</span>
                </div>
                {recBadge && (
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-display font-bold rounded-full uppercase tracking-wider border ${recBadge.className}`}>
                    {recBadge.icon}
                    {recBadge.label}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Favorite button */}
              <button
                onClick={toggleFavorite}
                className={`p-1.5 rounded-xl transition-all duration-300 ${favorite
                  ? "bg-hot-pink/20 text-hot-pink shadow-[0_0_12px_#FF2D7B30]"
                  : "bg-white/[0.04] text-white/25 hover:text-hot-pink hover:bg-hot-pink/10"
                  }`}
              >
                <Heart className={`h-4 w-4 ${favorite ? "fill-current" : ""}`} />
              </button>

              {/* Level badges */}
              <div className="flex gap-1.5 items-center bg-white/[0.04] p-1.5 rounded-xl border border-white/[0.06]">
                <LevelBadge level={lobby.min_level} size="sm" />
                <span className="text-white/15 px-0.5 text-[10px]">/</span>
                <LevelBadge level={lobby.max_level} size="sm" />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="py-2 space-y-3">
          {/* Date & Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-hot-pink" />
              <span className="font-display font-medium">{formatDate()}</span>
              <span className="text-white/35">
                {startTime.toLocaleTimeString("ru-RU", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            {pricePerPerson && (
              <div className="flex items-center gap-1 text-sm text-white/40">
                <Wallet className="h-3.5 w-3.5 text-cyan" />
                <span className="font-display">~{pricePerPerson.toLocaleString()} ₽</span>
              </div>
            )}
          </div>

          {/* Match reasons */}
          {showMatchReasons && lobby.matchReasons.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {lobby.matchReasons.slice(0, 3).map((reason, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-lime/10 text-lime text-[10px] font-medium rounded-full border border-lime/10"
                >
                  <Sparkles className="h-2.5 w-2.5" />
                  {reason}
                </span>
              ))}
            </div>
          )}

          {/* Fill progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="flex items-center gap-1.5 uppercase tracking-[0.15em] text-white/30">
                <Users className="h-3 w-3" /> Слоты
              </span>
              <span className="text-lime font-display font-bold text-xs">
                {lobby.participants_count}/{lobby.required_players}
              </span>
            </div>
            <Progress value={fillPercent} className="h-1.5" />
          </div>
        </CardContent>

        <CardFooter className="pt-2">
          <Button
            className="w-full font-display font-black uppercase tracking-[0.15em] text-xs h-11 transition-all duration-300"
            disabled={spotsLeft === 0}
            onClick={handleJoin}
          >
            {spotsLeft === 0 ? (
              "Матч укомплектован"
            ) : (
              <>
                Присоединиться
                <span className="ml-2 px-1.5 py-0.5 bg-black/20 rounded-full text-[10px] font-display">
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

// ─── Compact horizontal card for "Starting Soon" section ───
export function FeedCardCompact({ lobby }: { lobby: ScoredLobby }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
  }, []);

  const startTime = new Date(lobby.start_time);
  const minutesUntil = now ? Math.round(
    (startTime.getTime() - now) / (1000 * 60)
  ) : null;

  const formatTimeUntil = () => {
    if (minutesUntil === null) return "";
    if (minutesUntil <= 0) return "Сейчас!";
    if (minutesUntil < 60) return `${minutesUntil} мин`;
    return `${Math.round(minutesUntil / 60)}ч`;
  };

  const isUrgent = minutesUntil !== null && minutesUntil <= 60;

  return (
    <Link href={`/dashboard/lobbies/${lobby.id}`}>
      <div className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
        isUrgent
          ? "bg-hot-pink/5 border-hot-pink/20 hover:border-hot-pink/40 hover:shadow-[0_0_20px_#FF2D7B10]"
          : "bg-white/[0.03] border-white/[0.06] hover:border-lime/20 hover:shadow-[0_0_20px_#BFFF0008]"
      }`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
          isUrgent
            ? "bg-hot-pink/20 shadow-[0_0_15px_#FF2D7B20]"
            : "bg-lime/10"
        }`}>
          <Clock className={`h-6 w-6 ${isUrgent ? "text-hot-pink animate-pulse" : "text-lime"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-sm truncate">{lobby.court_name}</p>
          <p className="text-xs text-white/30 flex items-center gap-1">
            <MapPin className="h-3 w-3 text-violet" />
            {lobby.metro}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className={`text-sm font-display font-bold ${
            isUrgent ? "text-hot-pink" : "text-lime"
          }`}>
            {formatTimeUntil()}
          </p>
          <p className="text-[10px] text-white/25 font-display uppercase tracking-wider">
            {lobby.participants_count}/{lobby.required_players} игрок.
          </p>
        </div>
      </div>
    </Link>
  );
}
