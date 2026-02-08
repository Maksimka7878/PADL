"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  useAchievementsStore,
  ACHIEVEMENTS,
  getRarityColor,
  getRarityBg,
  getCategoryName,
  type AchievementCategory,
  type Achievement,
} from "@/store/achievements";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Trophy,
  Star,
  Zap,
  Lock,
  CheckCircle,
  Filter,
  Sparkles,
} from "lucide-react";

type FilterType = "all" | AchievementCategory | "unlocked" | "locked";

const CATEGORY_ICONS: Record<AchievementCategory, string> = {
  games: "🎾",
  social: "👥",
  skill: "💪",
  courts: "🏟️",
  tournaments: "🏆",
  special: "✨",
};

export default function AchievementsPage() {
  const { stats, totalXP, unlockedAchievements, getUserLevel, getProgress } =
    useAchievementsStore();
  const [filter, setFilter] = useState<FilterType>("all");
  const [showFilters, setShowFilters] = useState(false);

  const level = getUserLevel();

  const filteredAchievements = ACHIEVEMENTS.filter((achievement) => {
    if (filter === "all") return true;
    if (filter === "unlocked")
      return unlockedAchievements.includes(achievement.id);
    if (filter === "locked")
      return !unlockedAchievements.includes(achievement.id);
    return achievement.category === filter;
  });

  const unlockedCount = unlockedAchievements.length;
  const totalCount = ACHIEVEMENTS.length;
  const completionPercent = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-zinc-950 pb-20 lg:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="font-black text-lg">Достижения</h1>
            <p className="text-xs text-zinc-500">
              {unlockedCount} из {totalCount} открыто
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Level Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-emerald-500/20 to-zinc-900 border-emerald-500/30 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                {/* Level Badge */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-4 border-emerald-500 flex items-center justify-center">
                    <span className="text-3xl font-black text-emerald-400">
                      {level.level}
                    </span>
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Star className="h-3 w-3 text-black" />
                  </motion.div>
                </div>

                {/* Level Info */}
                <div className="flex-1 space-y-2">
                  <div>
                    <p className="text-sm text-emerald-400 font-medium">
                      {level.title}
                    </p>
                    <p className="text-2xl font-black">{totalXP} XP</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-400">До следующего уровня</span>
                      <span className="text-emerald-400">
                        {level.currentXP} / {level.requiredXP}
                      </span>
                    </div>
                    <Progress
                      value={(level.currentXP / level.requiredXP) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-black">{stats.totalGames}</p>
              <p className="text-xs text-zinc-500">Игр сыграно</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-black text-emerald-400">
                {Math.round((stats.wins / (stats.totalGames || 1)) * 100)}%
              </p>
              <p className="text-xs text-zinc-500">Побед</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-black text-yellow-400">
                {stats.bestWinStreak}
              </p>
              <p className="text-xs text-zinc-500">Лучшая серия</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-black text-purple-400">
                {completionPercent}%
              </p>
              <p className="text-xs text-zinc-500">Достижений</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-zinc-700"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Фильтры
          </Button>
          {filter !== "all" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilter("all")}
              className="text-emerald-400"
            >
              Сбросить
            </Button>
          )}
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 pb-2">
                <FilterButton
                  active={filter === "all"}
                  onClick={() => setFilter("all")}
                >
                  Все
                </FilterButton>
                <FilterButton
                  active={filter === "unlocked"}
                  onClick={() => setFilter("unlocked")}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Открытые
                </FilterButton>
                <FilterButton
                  active={filter === "locked"}
                  onClick={() => setFilter("locked")}
                >
                  <Lock className="h-3 w-3 mr-1" />
                  Закрытые
                </FilterButton>
                {(
                  [
                    "games",
                    "skill",
                    "social",
                    "courts",
                    "tournaments",
                    "special",
                  ] as AchievementCategory[]
                ).map((cat) => (
                  <FilterButton
                    key={cat}
                    active={filter === cat}
                    onClick={() => setFilter(cat)}
                  >
                    {CATEGORY_ICONS[cat]} {getCategoryName(cat)}
                  </FilterButton>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Achievements Grid */}
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {filteredAchievements.map((achievement, index) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                isUnlocked={unlockedAchievements.includes(achievement.id)}
                progress={getProgress(achievement.id)}
                delay={index * 0.05}
              />
            ))}
          </AnimatePresence>

          {filteredAchievements.length === 0 && (
            <div className="text-center py-12 text-zinc-500">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Нет достижений в этой категории</p>
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
            href="/leaderboard"
            className="flex flex-col items-center gap-1 text-zinc-500"
          >
            <Trophy className="h-5 w-5" />
            <span className="text-[10px] uppercase tracking-wider">
              Рейтинг
            </span>
          </Link>
          <Link
            href="/achievements"
            className="flex flex-col items-center gap-1 text-emerald-400"
          >
            <Sparkles className="h-5 w-5" />
            <span className="text-[10px] uppercase tracking-wider">
              Достижения
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

function FilterButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center ${active
          ? "bg-emerald-500 text-black"
          : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
        }`}
    >
      {children}
    </button>
  );
}

function AchievementCard({
  achievement,
  isUnlocked,
  progress,
  delay,
}: {
  achievement: Achievement;
  isUnlocked: boolean;
  progress: number;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay }}
      layout
    >
      <Card
        className={`border transition-all ${isUnlocked
            ? `${getRarityBg(achievement.rarity)} ${getRarityColor(
              achievement.rarity
            )}`
            : "bg-zinc-900/50 border-zinc-800 opacity-60"
          }`}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl relative ${isUnlocked ? getRarityBg(achievement.rarity) : "bg-zinc-800"
                }`}
            >
              {isUnlocked ? (
                achievement.icon
              ) : (
                <Lock className="h-6 w-6 text-zinc-600" />
              )}
              {isUnlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="h-3 w-3 text-black" />
                </motion.div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold truncate">{achievement.name}</h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold ${getRarityColor(
                    achievement.rarity
                  )}`}
                >
                  {achievement.rarity}
                </span>
              </div>
              <p className="text-sm text-zinc-400 line-clamp-1">
                {achievement.description}
              </p>
              {!isUnlocked && (
                <div className="mt-2">
                  <Progress value={progress * 100} className="h-1.5" />
                  <p className="text-xs text-zinc-500 mt-1">
                    {Math.round(progress * achievement.requirement)} /{" "}
                    {achievement.requirement}
                  </p>
                </div>
              )}
            </div>

            {/* XP Reward */}
            <div className="text-right">
              <div className="flex items-center gap-1 text-yellow-400">
                <Zap className="h-4 w-4" />
                <span className="font-bold">+{achievement.xpReward}</span>
              </div>
              <p className="text-[10px] text-zinc-500 uppercase">XP</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
