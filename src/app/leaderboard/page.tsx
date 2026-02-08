"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LevelBadge } from "@/components/lobby/LevelBadge";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Trophy,
  Medal,
  TrendingUp,
  TrendingDown,
  Minus,
  Crown,
  Flame,
  Target,
  Users,
  MapPin,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";

type Period = "week" | "month" | "all";
type LeaderboardType = "rating" | "wins" | "games";

interface LeaderboardPlayer {
  id: string;
  rank: number;
  previousRank: number;
  name: string;
  image?: string;
  skill_level: number;
  rating: number;
  wins: number;
  losses: number;
  gamesPlayed: number;
  winStreak: number;
  metro?: string;
}

// Mock leaderboard data
const mockPlayers: LeaderboardPlayer[] = [
  {
    id: "1",
    rank: 1,
    previousRank: 1,
    name: "Александр Смирнов",
    skill_level: 5.0,
    rating: 2450,
    wins: 156,
    losses: 24,
    gamesPlayed: 180,
    winStreak: 12,
    metro: "Спортивная",
  },
  {
    id: "2",
    rank: 2,
    previousRank: 3,
    name: "Михаил Козлов",
    skill_level: 4.5,
    rating: 2380,
    wins: 142,
    losses: 31,
    gamesPlayed: 173,
    winStreak: 8,
    metro: "Динамо",
  },
  {
    id: "3",
    rank: 3,
    previousRank: 2,
    name: "Дмитрий Петров",
    skill_level: 4.5,
    rating: 2350,
    wins: 138,
    losses: 28,
    gamesPlayed: 166,
    winStreak: 5,
    metro: "Фили",
  },
  {
    id: "4",
    rank: 4,
    previousRank: 5,
    name: "Анна Волкова",
    skill_level: 4.5,
    rating: 2290,
    wins: 125,
    losses: 35,
    gamesPlayed: 160,
    winStreak: 3,
    metro: "Павелецкая",
  },
  {
    id: "5",
    rank: 5,
    previousRank: 4,
    name: "Сергей Иванов",
    skill_level: 4.0,
    rating: 2240,
    wins: 118,
    losses: 42,
    gamesPlayed: 160,
    winStreak: 0,
    metro: "Кутузовская",
  },
  {
    id: "6",
    rank: 6,
    previousRank: 8,
    name: "Елена Морозова",
    skill_level: 4.0,
    rating: 2180,
    wins: 110,
    losses: 45,
    gamesPlayed: 155,
    winStreak: 6,
    metro: "Тушинская",
  },
  {
    id: "7",
    rank: 7,
    previousRank: 6,
    name: "Андрей Соколов",
    skill_level: 4.0,
    rating: 2150,
    wins: 105,
    losses: 48,
    gamesPlayed: 153,
    winStreak: 2,
    metro: "Динамо",
  },
  {
    id: "8",
    rank: 8,
    previousRank: 7,
    name: "Мария Кузнецова",
    skill_level: 3.5,
    rating: 2100,
    wins: 98,
    losses: 52,
    gamesPlayed: 150,
    winStreak: 1,
    metro: "Спортивная",
  },
  {
    id: "9",
    rank: 9,
    previousRank: 10,
    name: "Игорь Новиков",
    skill_level: 3.5,
    rating: 2050,
    wins: 92,
    losses: 58,
    gamesPlayed: 150,
    winStreak: 4,
    metro: "Фили",
  },
  {
    id: "10",
    rank: 10,
    previousRank: 9,
    name: "Ольга Федорова",
    skill_level: 3.5,
    rating: 2000,
    wins: 88,
    losses: 62,
    gamesPlayed: 150,
    winStreak: 0,
    metro: "Павелецкая",
  },
  // Current user
  {
    id: "me",
    rank: 47,
    previousRank: 52,
    name: "Вы",
    skill_level: 3.5,
    rating: 1450,
    wins: 8,
    losses: 4,
    gamesPlayed: 12,
    winStreak: 3,
    metro: "Фили",
  },
];

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>("month");
  const [type, setType] = useState<LeaderboardType>("rating");
  const [searchQuery, setSearchQuery] = useState("");

  const currentUser = mockPlayers.find((p) => p.id === "me")!;
  const topPlayers = mockPlayers.filter((p) => p.id !== "me").slice(0, 10);

  const filteredPlayers = searchQuery
    ? topPlayers.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : topPlayers;

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    if (type === "rating") return b.rating - a.rating;
    if (type === "wins") return b.wins - a.wins;
    return b.gamesPlayed - a.gamesPlayed;
  });

  return (
    <div className="min-h-screen bg-zinc-950 pb-20 lg:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="font-black text-lg">Рейтинг игроков</h1>
            <p className="text-xs text-zinc-500">
              Топ игроков Moscow Padel
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Your Position Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-emerald-500/20 to-zinc-900 border-emerald-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-3xl font-black text-emerald-400">
                    #{currentUser.rank}
                  </p>
                  <RankChange
                    current={currentUser.rank}
                    previous={currentUser.previousRank}
                  />
                </div>

                <div className="flex-1">
                  <p className="font-bold text-lg">Ваша позиция</p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      {currentUser.rating} рейтинг
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      {currentUser.wins} побед
                    </span>
                  </div>
                </div>

                {currentUser.winStreak > 0 && (
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-orange-500/20 rounded-full text-orange-400">
                    <Flame className="h-4 w-4" />
                    <span className="text-sm font-bold">{currentUser.winStreak}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Period selector */}
          <div className="flex gap-1 bg-zinc-900 p-1 rounded-lg">
            {(["week", "month", "all"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${period === p
                    ? "bg-emerald-500 text-black"
                    : "text-zinc-400 hover:text-white"
                  }`}
              >
                {p === "week" && "Неделя"}
                {p === "month" && "Месяц"}
                {p === "all" && "Все время"}
              </button>
            ))}
          </div>

          {/* Type selector */}
          <div className="flex gap-1 bg-zinc-900 p-1 rounded-lg">
            {(["rating", "wins", "games"] as LeaderboardType[]).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${type === t
                    ? "bg-emerald-500 text-black"
                    : "text-zinc-400 hover:text-white"
                  }`}
              >
                {t === "rating" && "Рейтинг"}
                {t === "wins" && "Победы"}
                {t === "games" && "Игры"}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Поиск игрока..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-zinc-900 border-zinc-800"
          />
        </div>

        {/* Top 3 Podium */}
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-3"
          >
            {/* 2nd place */}
            <div className="order-1 pt-8">
              <PodiumCard player={sortedPlayers[1]} place={2} />
            </div>

            {/* 1st place */}
            <div className="order-2">
              <PodiumCard player={sortedPlayers[0]} place={1} />
            </div>

            {/* 3rd place */}
            <div className="order-3 pt-12">
              <PodiumCard player={sortedPlayers[2]} place={3} />
            </div>
          </motion.div>
        )}

        {/* Rest of leaderboard */}
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {(searchQuery ? sortedPlayers : sortedPlayers.slice(3)).map(
              (player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.03 }}
                  layout
                >
                  <LeaderboardRow player={player} type={type} />
                </motion.div>
              )
            )}
          </AnimatePresence>

          {filteredPlayers.length === 0 && (
            <div className="text-center py-12 text-zinc-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Игроки не найдены</p>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-lg border-t border-zinc-800 lg:hidden">
        <div className="flex items-center justify-around py-3">
          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-1 text-zinc-500"
          >
            <span className="text-xl">🎮</span>
            <span className="text-[10px] uppercase tracking-wider">Лобби</span>
          </Link>
          <Link
            href="/tournaments"
            className="flex flex-col items-center gap-1 text-zinc-500"
          >
            <Trophy className="h-5 w-5" />
            <span className="text-[10px] uppercase tracking-wider">
              Турниры
            </span>
          </Link>
          <Link
            href="/leaderboard"
            className="flex flex-col items-center gap-1 text-emerald-400"
          >
            <Medal className="h-5 w-5" />
            <span className="text-[10px] uppercase tracking-wider">
              Рейтинг
            </span>
          </Link>
          <Link
            href="/profile"
            className="flex flex-col items-center gap-1 text-zinc-500"
          >
            <span className="text-xl">👤</span>
            <span className="text-[10px] uppercase tracking-wider">
              Профиль
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

function PodiumCard({
  player,
  place,
}: {
  player: LeaderboardPlayer;
  place: number;
}) {
  const colors = {
    1: "from-yellow-500/30 to-yellow-600/10 border-yellow-500/50",
    2: "from-zinc-400/30 to-zinc-500/10 border-zinc-400/50",
    3: "from-orange-600/30 to-orange-700/10 border-orange-600/50",
  };

  const medals = {
    1: "🥇",
    2: "🥈",
    3: "🥉",
  };

  return (
    <Card
      className={`bg-gradient-to-b ${colors[place as keyof typeof colors]
        } border overflow-hidden`}
    >
      <CardContent className="p-3 text-center">
        <div className="text-3xl mb-2">{medals[place as keyof typeof medals]}</div>
        {place === 1 && (
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block"
          >
            <Crown className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
          </motion.div>
        )}
        <div className="w-12 h-12 mx-auto bg-zinc-800 rounded-full flex items-center justify-center text-xl mb-2">
          {player.name.charAt(0)}
        </div>
        <p className="font-bold text-sm truncate">{player.name}</p>
        <LevelBadge level={player.skill_level} size="sm" />
        <p className="text-lg font-black text-emerald-400 mt-2">
          {player.rating}
        </p>
        <p className="text-xs text-zinc-500">рейтинг</p>
      </CardContent>
    </Card>
  );
}

function LeaderboardRow({
  player,
  type,
}: {
  player: LeaderboardPlayer;
  type: LeaderboardType;
}) {
  return (
    <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          {/* Rank */}
          <div className="w-10 text-center">
            <span className="text-lg font-bold text-zinc-400">
              {player.rank}
            </span>
            <RankChange current={player.rank} previous={player.previousRank} />
          </div>

          {/* Avatar */}
          <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-sm font-bold">
            {player.name.charAt(0)}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-bold truncate">{player.name}</p>
              {player.winStreak >= 5 && (
                <span className="flex items-center gap-0.5 text-orange-400">
                  <Flame className="h-3.5 w-3.5" />
                  <span className="text-xs font-bold">{player.winStreak}</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <LevelBadge level={player.skill_level} size="sm" />
              {player.metro && (
                <span className="text-xs text-zinc-500 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {player.metro}
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="text-right">
            <p className="text-lg font-black text-emerald-400">
              {type === "rating" && player.rating}
              {type === "wins" && player.wins}
              {type === "games" && player.gamesPlayed}
            </p>
            <p className="text-xs text-zinc-500">
              {type === "rating" && "рейтинг"}
              {type === "wins" && "побед"}
              {type === "games" && "игр"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RankChange({
  current,
  previous,
}: {
  current: number;
  previous: number;
}) {
  const diff = previous - current;

  if (diff === 0) {
    return (
      <span className="flex items-center justify-center text-xs text-zinc-500">
        <Minus className="h-3 w-3" />
      </span>
    );
  }

  if (diff > 0) {
    return (
      <span className="flex items-center justify-center gap-0.5 text-xs text-emerald-400">
        <TrendingUp className="h-3 w-3" />
        {diff}
      </span>
    );
  }

  return (
    <span className="flex items-center justify-center gap-0.5 text-xs text-red-400">
      <TrendingDown className="h-3 w-3" />
      {Math.abs(diff)}
    </span>
  );
}
