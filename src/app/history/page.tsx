"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LevelBadge } from "@/components/lobby/LevelBadge";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Trophy,
  TrendingUp,
  Clock,
  User,
  Filter,
} from "lucide-react";

// Mock data for match history
const mockHistory = [
  {
    id: "h1",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    court_name: "Padel Moscow Club",
    metro: "Фили",
    result: "win" as const,
    score: "6-4, 7-5",
    partner: { name: "Алексей", level: 3.5 },
    opponents: [
      { name: "Мария", level: 4.0 },
      { name: "Дмитрий", level: 3.5 },
    ],
    duration: 75,
  },
  {
    id: "h2",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    court_name: "World Class Павлово",
    metro: "Крылатское",
    result: "loss" as const,
    score: "4-6, 3-6",
    partner: { name: "Елена", level: 4.0 },
    opponents: [
      { name: "Сергей", level: 4.5 },
      { name: "Анна", level: 4.0 },
    ],
    duration: 60,
  },
  {
    id: "h3",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    court_name: "Padel Hall",
    metro: "Динамо",
    result: "win" as const,
    score: "6-3, 6-4",
    partner: { name: "Иван", level: 3.0 },
    opponents: [
      { name: "Ольга", level: 3.5 },
      { name: "Павел", level: 3.0 },
    ],
    duration: 55,
  },
  {
    id: "h4",
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    court_name: "Padel Moscow Club",
    metro: "Фили",
    result: "win" as const,
    score: "6-2, 6-3",
    partner: { name: "Алексей", level: 3.5 },
    opponents: [
      { name: "Виктор", level: 3.0 },
      { name: "Наталья", level: 3.0 },
    ],
    duration: 50,
  },
];

type MatchResult = "all" | "win" | "loss";
type TimeFilter = "all" | "week" | "month" | "year";

export default function HistoryPage() {
  const [resultFilter, setResultFilter] = useState<MatchResult>("all");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");

  const filteredHistory = mockHistory.filter((match) => {
    // Result filter
    if (resultFilter !== "all" && match.result !== resultFilter) return false;

    // Time filter
    const matchDate = new Date(match.date);
    const now = new Date();
    if (timeFilter === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      if (matchDate < weekAgo) return false;
    } else if (timeFilter === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      if (matchDate < monthAgo) return false;
    } else if (timeFilter === "year") {
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      if (matchDate < yearAgo) return false;
    }

    return true;
  });

  // Calculate stats
  const totalGames = mockHistory.length;
  const wins = mockHistory.filter((m) => m.result === "win").length;
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
  const totalTime = mockHistory.reduce((acc, m) => acc + m.duration, 0);

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
          <div>
            <h1 className="font-black text-lg">История матчей</h1>
            <p className="text-xs text-zinc-500">Ваши прошедшие игры</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-4 text-center">
              <Trophy className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
              <p className="text-2xl font-black">{wins}</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">
                Побед
              </p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-4 text-center">
              <TrendingUp className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
              <p className="text-2xl font-black">{winRate}%</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">
                Винрейт
              </p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-4 text-center">
              <Users className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
              <p className="text-2xl font-black">{totalGames}</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">
                Всего игр
              </p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="pt-4 text-center">
              <Clock className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
              <p className="text-2xl font-black">
                {Math.round(totalTime / 60)}ч
              </p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">
                На корте
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-zinc-500" />
          <Select
            value={resultFilter}
            onValueChange={(v) => setResultFilter(v as MatchResult)}
          >
            <SelectTrigger className="w-32 bg-zinc-900 border-zinc-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-zinc-800">
              <SelectItem value="all">Все</SelectItem>
              <SelectItem value="win">Победы</SelectItem>
              <SelectItem value="loss">Поражения</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={timeFilter}
            onValueChange={(v) => setTimeFilter(v as TimeFilter)}
          >
            <SelectTrigger className="w-32 bg-zinc-900 border-zinc-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-zinc-800">
              <SelectItem value="all">Всё время</SelectItem>
              <SelectItem value="week">Неделя</SelectItem>
              <SelectItem value="month">Месяц</SelectItem>
              <SelectItem value="year">Год</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Match List */}
        <div className="space-y-4">
          {filteredHistory.length === 0 ? (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="py-12 text-center">
                <Trophy className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500">Нет матчей по выбранным фильтрам</p>
              </CardContent>
            </Card>
          ) : (
            filteredHistory.map((match) => (
              <Card
                key={match.id}
                className={`bg-zinc-900 border-zinc-800 overflow-hidden ${match.result === "win"
                    ? "border-l-4 border-l-emerald-500"
                    : "border-l-4 border-l-red-500"
                  }`}
              >
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      {/* Court & Date */}
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold">{match.court_name}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-bold ${match.result === "win"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-red-500/20 text-red-400"
                            }`}
                        >
                          {match.result === "win" ? "ПОБЕДА" : "ПОРАЖЕНИЕ"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {match.metro}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(match.date).toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "long",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {match.duration} мин
                        </span>
                      </div>

                      {/* Players */}
                      <div className="flex items-center gap-6 mt-3">
                        {/* Your team */}
                        <div className="space-y-1">
                          <p className="text-[10px] text-zinc-600 uppercase tracking-wider">
                            Ваша команда
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-800 rounded-lg">
                              <User className="h-3 w-3 text-emerald-500" />
                              <span className="text-xs font-medium">Вы</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-800 rounded-lg">
                              <span className="text-xs">
                                {match.partner.name}
                              </span>
                              <LevelBadge level={match.partner.level} size="sm" />
                            </div>
                          </div>
                        </div>

                        <span className="text-zinc-600">vs</span>

                        {/* Opponents */}
                        <div className="space-y-1">
                          <p className="text-[10px] text-zinc-600 uppercase tracking-wider">
                            Соперники
                          </p>
                          <div className="flex items-center gap-2">
                            {match.opponents.map((opp, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-1.5 px-2 py-1 bg-zinc-800 rounded-lg"
                              >
                                <span className="text-xs">{opp.name}</span>
                                <LevelBadge level={opp.level} size="sm" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                      <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">
                        Счёт
                      </p>
                      <p className="text-xl font-black font-mono">
                        {match.score}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Mobile Nav */}
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
            href="/history"
            className="flex flex-col items-center gap-1 text-emerald-400"
          >
            <Trophy className="h-5 w-5" />
            <span className="text-[10px] uppercase tracking-wider">История</span>
          </Link>
          <Link
            href="/profile"
            className="flex flex-col items-center gap-1 text-zinc-500"
          >
            <User className="h-5 w-5" />
            <span className="text-[10px] uppercase tracking-wider">Профиль</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
