import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AchievementCategory =
  | "games"
  | "social"
  | "skill"
  | "courts"
  | "tournaments"
  | "special";

export type AchievementRarity = "common" | "rare" | "epic" | "legendary";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  requirement: number;
  xpReward: number;
  unlockedAt?: string;
}

export interface UserStats {
  totalGames: number;
  wins: number;
  losses: number;
  winStreak: number;
  bestWinStreak: number;
  totalHours: number;
  uniqueCourts: number;
  tournamentsPlayed: number;
  tournamentsWon: number;
  friendsCount: number;
  reviewsWritten: number;
  lobbiesCreated: number;
  gamesHosted: number;
}

export interface UserLevel {
  level: number;
  currentXP: number;
  requiredXP: number;
  title: string;
}

// All achievements
export const ACHIEVEMENTS: Achievement[] = [
  // Games achievements
  {
    id: "first-game",
    name: "Первый шаг",
    description: "Сыграйте свою первую игру",
    icon: "🎾",
    category: "games",
    rarity: "common",
    requirement: 1,
    xpReward: 50,
  },
  {
    id: "games-10",
    name: "Новичок",
    description: "Сыграйте 10 игр",
    icon: "🏸",
    category: "games",
    rarity: "common",
    requirement: 10,
    xpReward: 100,
  },
  {
    id: "games-50",
    name: "Любитель",
    description: "Сыграйте 50 игр",
    icon: "🎯",
    category: "games",
    rarity: "rare",
    requirement: 50,
    xpReward: 250,
  },
  {
    id: "games-100",
    name: "Энтузиаст",
    description: "Сыграйте 100 игр",
    icon: "⭐",
    category: "games",
    rarity: "epic",
    requirement: 100,
    xpReward: 500,
  },
  {
    id: "games-500",
    name: "Легенда корта",
    description: "Сыграйте 500 игр",
    icon: "👑",
    category: "games",
    rarity: "legendary",
    requirement: 500,
    xpReward: 2000,
  },

  // Win streak achievements
  {
    id: "streak-3",
    name: "В ударе",
    description: "Выиграйте 3 игры подряд",
    icon: "🔥",
    category: "skill",
    rarity: "common",
    requirement: 3,
    xpReward: 75,
  },
  {
    id: "streak-5",
    name: "На волне",
    description: "Выиграйте 5 игр подряд",
    icon: "🌊",
    category: "skill",
    rarity: "rare",
    requirement: 5,
    xpReward: 150,
  },
  {
    id: "streak-10",
    name: "Непобедимый",
    description: "Выиграйте 10 игр подряд",
    icon: "💪",
    category: "skill",
    rarity: "epic",
    requirement: 10,
    xpReward: 500,
  },
  {
    id: "streak-20",
    name: "Машина победы",
    description: "Выиграйте 20 игр подряд",
    icon: "🤖",
    category: "skill",
    rarity: "legendary",
    requirement: 20,
    xpReward: 1500,
  },

  // Social achievements
  {
    id: "friends-5",
    name: "Компания",
    description: "Добавьте 5 друзей",
    icon: "👥",
    category: "social",
    rarity: "common",
    requirement: 5,
    xpReward: 75,
  },
  {
    id: "friends-20",
    name: "Популярный",
    description: "Добавьте 20 друзей",
    icon: "🌟",
    category: "social",
    rarity: "rare",
    requirement: 20,
    xpReward: 200,
  },
  {
    id: "friends-50",
    name: "Душа компании",
    description: "Добавьте 50 друзей",
    icon: "🎉",
    category: "social",
    rarity: "epic",
    requirement: 50,
    xpReward: 400,
  },
  {
    id: "reviews-5",
    name: "Критик",
    description: "Напишите 5 отзывов",
    icon: "✍️",
    category: "social",
    rarity: "common",
    requirement: 5,
    xpReward: 100,
  },
  {
    id: "reviews-20",
    name: "Обозреватель",
    description: "Напишите 20 отзывов",
    icon: "📝",
    category: "social",
    rarity: "rare",
    requirement: 20,
    xpReward: 300,
  },

  // Courts achievements
  {
    id: "courts-3",
    name: "Исследователь",
    description: "Посетите 3 разных корта",
    icon: "🗺️",
    category: "courts",
    rarity: "common",
    requirement: 3,
    xpReward: 100,
  },
  {
    id: "courts-10",
    name: "Путешественник",
    description: "Посетите 10 разных кортов",
    icon: "🧭",
    category: "courts",
    rarity: "rare",
    requirement: 10,
    xpReward: 300,
  },
  {
    id: "courts-all",
    name: "Знаток Москвы",
    description: "Посетите все корты в Москве",
    icon: "🏆",
    category: "courts",
    rarity: "legendary",
    requirement: 20,
    xpReward: 1000,
  },

  // Tournament achievements
  {
    id: "tournament-first",
    name: "Турнирный боец",
    description: "Участвуйте в первом турнире",
    icon: "⚔️",
    category: "tournaments",
    rarity: "common",
    requirement: 1,
    xpReward: 150,
  },
  {
    id: "tournament-win",
    name: "Чемпион",
    description: "Выиграйте турнир",
    icon: "🥇",
    category: "tournaments",
    rarity: "epic",
    requirement: 1,
    xpReward: 750,
  },
  {
    id: "tournament-5-wins",
    name: "Многократный чемпион",
    description: "Выиграйте 5 турниров",
    icon: "🏅",
    category: "tournaments",
    rarity: "legendary",
    requirement: 5,
    xpReward: 2000,
  },

  // Special achievements
  {
    id: "early-bird",
    name: "Ранняя пташка",
    description: "Сыграйте игру до 8 утра",
    icon: "🌅",
    category: "special",
    rarity: "rare",
    requirement: 1,
    xpReward: 150,
  },
  {
    id: "night-owl",
    name: "Полуночник",
    description: "Сыграйте игру после 22:00",
    icon: "🦉",
    category: "special",
    rarity: "rare",
    requirement: 1,
    xpReward: 150,
  },
  {
    id: "host-10",
    name: "Организатор",
    description: "Создайте 10 лобби",
    icon: "📋",
    category: "special",
    rarity: "rare",
    requirement: 10,
    xpReward: 300,
  },
  {
    id: "weekend-warrior",
    name: "Воин выходных",
    description: "Сыграйте 5 игр за один уикенд",
    icon: "🎪",
    category: "special",
    rarity: "epic",
    requirement: 5,
    xpReward: 400,
  },
];

// Level titles and XP requirements
export const LEVELS = [
  { level: 1, xp: 0, title: "Новичок" },
  { level: 2, xp: 100, title: "Ученик" },
  { level: 3, xp: 250, title: "Любитель" },
  { level: 4, xp: 500, title: "Игрок" },
  { level: 5, xp: 1000, title: "Опытный игрок" },
  { level: 6, xp: 1750, title: "Знаток" },
  { level: 7, xp: 2750, title: "Эксперт" },
  { level: 8, xp: 4000, title: "Мастер" },
  { level: 9, xp: 5500, title: "Грандмастер" },
  { level: 10, xp: 7500, title: "Легенда" },
  { level: 11, xp: 10000, title: "Чемпион" },
  { level: 12, xp: 13000, title: "Элита" },
  { level: 13, xp: 17000, title: "Про" },
  { level: 14, xp: 22000, title: "Топ-игрок" },
  { level: 15, xp: 28000, title: "Суперзвезда" },
];

interface AchievementsState {
  stats: UserStats;
  totalXP: number;
  unlockedAchievements: string[];
  recentUnlock: Achievement | null;

  // Actions
  addXP: (amount: number) => void;
  incrementStat: (stat: keyof UserStats, amount?: number) => void;
  checkAchievements: () => Achievement[];
  unlockAchievement: (achievementId: string) => void;
  getUserLevel: () => UserLevel;
  getProgress: (achievementId: string) => number;
  clearRecentUnlock: () => void;
}

export const useAchievementsStore = create<AchievementsState>()(
  persist(
    (set, get) => ({
      stats: {
        totalGames: 12,
        wins: 8,
        losses: 4,
        winStreak: 3,
        bestWinStreak: 5,
        totalHours: 18,
        uniqueCourts: 4,
        tournamentsPlayed: 1,
        tournamentsWon: 0,
        friendsCount: 4,
        reviewsWritten: 2,
        lobbiesCreated: 3,
        gamesHosted: 2,
      },
      totalXP: 450,
      unlockedAchievements: ["first-game", "games-10", "streak-3"],
      recentUnlock: null,

      addXP: (amount) => {
        set((state) => ({ totalXP: state.totalXP + amount }));
      },

      incrementStat: (stat, amount = 1) => {
        set((state) => ({
          stats: {
            ...state.stats,
            [stat]: state.stats[stat] + amount,
          },
        }));
        // Check for new achievements
        get().checkAchievements();
      },

      checkAchievements: () => {
        const { stats, unlockedAchievements, unlockAchievement } = get();
        const newlyUnlocked: Achievement[] = [];

        ACHIEVEMENTS.forEach((achievement) => {
          if (unlockedAchievements.includes(achievement.id)) return;

          let progress = 0;
          switch (achievement.id) {
            case "first-game":
            case "games-10":
            case "games-50":
            case "games-100":
            case "games-500":
              progress = stats.totalGames;
              break;
            case "streak-3":
            case "streak-5":
            case "streak-10":
            case "streak-20":
              progress = stats.bestWinStreak;
              break;
            case "friends-5":
            case "friends-20":
            case "friends-50":
              progress = stats.friendsCount;
              break;
            case "reviews-5":
            case "reviews-20":
              progress = stats.reviewsWritten;
              break;
            case "courts-3":
            case "courts-10":
            case "courts-all":
              progress = stats.uniqueCourts;
              break;
            case "tournament-first":
              progress = stats.tournamentsPlayed;
              break;
            case "tournament-win":
            case "tournament-5-wins":
              progress = stats.tournamentsWon;
              break;
            case "host-10":
              progress = stats.lobbiesCreated;
              break;
            default:
              progress = 0;
          }

          if (progress >= achievement.requirement) {
            unlockAchievement(achievement.id);
            newlyUnlocked.push(achievement);
          }
        });

        return newlyUnlocked;
      },

      unlockAchievement: (achievementId) => {
        const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
        if (!achievement) return;

        set((state) => ({
          unlockedAchievements: [...state.unlockedAchievements, achievementId],
          totalXP: state.totalXP + achievement.xpReward,
          recentUnlock: { ...achievement, unlockedAt: new Date().toISOString() },
        }));
      },

      getUserLevel: () => {
        const { totalXP } = get();
        let currentLevel = LEVELS[0];
        let nextLevel = LEVELS[1];

        for (let i = 0; i < LEVELS.length; i++) {
          if (totalXP >= LEVELS[i].xp) {
            currentLevel = LEVELS[i];
            nextLevel = LEVELS[i + 1] || LEVELS[i];
          }
        }

        const currentLevelXP = currentLevel.xp;
        const nextLevelXP = nextLevel.xp;
        const xpInCurrentLevel = totalXP - currentLevelXP;
        const xpRequiredForNext = nextLevelXP - currentLevelXP;

        return {
          level: currentLevel.level,
          currentXP: xpInCurrentLevel,
          requiredXP: xpRequiredForNext,
          title: currentLevel.title,
        };
      },

      getProgress: (achievementId) => {
        const { stats } = get();
        const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
        if (!achievement) return 0;

        let progress = 0;
        switch (achievement.id) {
          case "first-game":
          case "games-10":
          case "games-50":
          case "games-100":
          case "games-500":
            progress = stats.totalGames;
            break;
          case "streak-3":
          case "streak-5":
          case "streak-10":
          case "streak-20":
            progress = stats.bestWinStreak;
            break;
          case "friends-5":
          case "friends-20":
          case "friends-50":
            progress = stats.friendsCount;
            break;
          case "reviews-5":
          case "reviews-20":
            progress = stats.reviewsWritten;
            break;
          case "courts-3":
          case "courts-10":
          case "courts-all":
            progress = stats.uniqueCourts;
            break;
          case "tournament-first":
            progress = stats.tournamentsPlayed;
            break;
          case "tournament-win":
          case "tournament-5-wins":
            progress = stats.tournamentsWon;
            break;
          case "host-10":
            progress = stats.lobbiesCreated;
            break;
          default:
            progress = 0;
        }

        return Math.min(progress / achievement.requirement, 1);
      },

      clearRecentUnlock: () => {
        set({ recentUnlock: null });
      },
    }),
    {
      name: "padel-achievements",
    }
  )
);

// Helper functions
export function getRarityColor(rarity: AchievementRarity): string {
  switch (rarity) {
    case "common":
      return "text-zinc-400 border-zinc-600";
    case "rare":
      return "text-blue-400 border-blue-500";
    case "epic":
      return "text-purple-400 border-purple-500";
    case "legendary":
      return "text-yellow-400 border-yellow-500";
    default:
      return "text-zinc-400 border-zinc-600";
  }
}

export function getRarityBg(rarity: AchievementRarity): string {
  switch (rarity) {
    case "common":
      return "bg-zinc-800";
    case "rare":
      return "bg-blue-500/10";
    case "epic":
      return "bg-purple-500/10";
    case "legendary":
      return "bg-yellow-500/10";
    default:
      return "bg-zinc-800";
  }
}

export function getCategoryName(category: AchievementCategory): string {
  switch (category) {
    case "games":
      return "Игры";
    case "social":
      return "Социальные";
    case "skill":
      return "Мастерство";
    case "courts":
      return "Корты";
    case "tournaments":
      return "Турниры";
    case "special":
      return "Особые";
    default:
      return category;
  }
}
