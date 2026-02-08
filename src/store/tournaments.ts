import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TournamentFormat = "single_elimination" | "double_elimination" | "round_robin";
export type TournamentStatus = "upcoming" | "registration" | "in_progress" | "completed";
export type TournamentLevel = "beginner" | "intermediate" | "advanced" | "pro" | "open";

export interface TournamentPrize {
  place: number;
  prize: string;
  amount?: number;
}

export interface TournamentMatch {
  id: string;
  round: number;
  team1?: { id: string; name: string; players: string[] };
  team2?: { id: string; name: string; players: string[] };
  score1?: number;
  score2?: number;
  winner?: string;
  scheduledAt?: string;
  court?: string;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  format: TournamentFormat;
  status: TournamentStatus;
  level: TournamentLevel;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  location: string;
  court: string;
  maxTeams: number;
  currentTeams: number;
  entryFee: number;
  prizePool: number;
  prizes: TournamentPrize[];
  image?: string;
  organizer: string;
  rules?: string[];
  registeredTeams: Array<{
    id: string;
    name: string;
    players: string[];
    registeredAt: string;
  }>;
  bracket?: TournamentMatch[];
}

export interface TournamentRegistration {
  tournamentId: string;
  teamName: string;
  partnerId?: string;
}

// Mock tournaments data
const mockTournaments: Tournament[] = [
  {
    id: "t1",
    name: "Moscow Padel Open 2024",
    description: "Главный турнир сезона для игроков среднего уровня. Отличная возможность проверить свои силы!",
    format: "single_elimination",
    status: "registration",
    level: "intermediate",
    startDate: "2024-12-20T10:00:00",
    endDate: "2024-12-22T20:00:00",
    registrationDeadline: "2024-12-18T23:59:00",
    location: "Padel Moscow Club",
    court: "ул. Большая Филёвская, 22",
    maxTeams: 16,
    currentTeams: 12,
    entryFee: 3000,
    prizePool: 50000,
    prizes: [
      { place: 1, prize: "Золотые медали + кубок", amount: 30000 },
      { place: 2, prize: "Серебряные медали", amount: 15000 },
      { place: 3, prize: "Бронзовые медали", amount: 5000 },
    ],
    organizer: "Padel Moscow",
    rules: [
      "Игры проводятся по официальным правилам WPT",
      "Каждый матч до 2 выигранных сетов",
      "Тай-брейк при счёте 6:6",
      "Форма свободная, кроссовки для корта обязательны",
    ],
    registeredTeams: [
      { id: "team1", name: "Smash Bros", players: ["Алексей М.", "Дмитрий К."], registeredAt: "2024-12-01" },
      { id: "team2", name: "Net Masters", players: ["Мария С.", "Елена П."], registeredAt: "2024-12-02" },
    ],
  },
  {
    id: "t2",
    name: "Winter Cup - Начинающие",
    description: "Турнир для новичков. Дружеская атмосфера, призы для всех участников!",
    format: "round_robin",
    status: "registration",
    level: "beginner",
    startDate: "2024-12-15T12:00:00",
    endDate: "2024-12-15T20:00:00",
    registrationDeadline: "2024-12-13T23:59:00",
    location: "Racket Club",
    court: "ул. Лодочная, 19",
    maxTeams: 8,
    currentTeams: 5,
    entryFee: 1500,
    prizePool: 15000,
    prizes: [
      { place: 1, prize: "Кубок + сертификат на 10000₽", amount: 10000 },
      { place: 2, prize: "Сертификат на 5000₽", amount: 5000 },
    ],
    organizer: "Racket Club",
    rules: [
      "Круговой турнир - каждый играет с каждым",
      "Матч - 1 сет до 6 геймов",
      "Участникам выдаются мячи",
    ],
    registeredTeams: [],
  },
  {
    id: "t3",
    name: "Pro League - Финал сезона",
    description: "Элитный турнир для профессиональных игроков. Только приглашённые участники.",
    format: "double_elimination",
    status: "upcoming",
    level: "pro",
    startDate: "2024-12-28T10:00:00",
    endDate: "2024-12-30T22:00:00",
    registrationDeadline: "2024-12-25T23:59:00",
    location: "Sport Palace Luzhniki",
    court: "ул. Лужники, 24",
    maxTeams: 8,
    currentTeams: 8,
    entryFee: 10000,
    prizePool: 200000,
    prizes: [
      { place: 1, prize: "Главный кубок сезона", amount: 100000 },
      { place: 2, prize: "Серебро", amount: 50000 },
      { place: 3, prize: "Бронза", amount: 30000 },
      { place: 4, prize: "", amount: 20000 },
    ],
    organizer: "Moscow Padel Federation",
    registeredTeams: [],
  },
  {
    id: "t4",
    name: "New Year Mixte 2025",
    description: "Смешанный турнир! Пары мужчина + женщина. Праздничная атмосфера и подарки!",
    format: "single_elimination",
    status: "registration",
    level: "open",
    startDate: "2025-01-05T14:00:00",
    endDate: "2025-01-05T21:00:00",
    registrationDeadline: "2025-01-03T23:59:00",
    location: "World Class Paveletskaya",
    court: "ул. Кожевническая, 14",
    maxTeams: 12,
    currentTeams: 4,
    entryFee: 2500,
    prizePool: 30000,
    prizes: [
      { place: 1, prize: "Новогодний кубок + подарки", amount: 20000 },
      { place: 2, prize: "Подарочные наборы", amount: 10000 },
    ],
    organizer: "World Class",
    rules: [
      "Только смешанные пары (М+Ж)",
      "Новогодняя форма приветствуется!",
      "Фуршет для всех участников",
    ],
    registeredTeams: [],
  },
];

interface TournamentsState {
  tournaments: Tournament[];
  myRegistrations: string[];

  // Actions
  registerForTournament: (registration: TournamentRegistration) => void;
  withdrawFromTournament: (tournamentId: string) => void;
  isRegistered: (tournamentId: string) => boolean;
  getTournament: (id: string) => Tournament | undefined;
  getUpcoming: () => Tournament[];
  getRegistrationOpen: () => Tournament[];
  getMyTournaments: () => Tournament[];
}

export const useTournamentsStore = create<TournamentsState>()(
  persist(
    (set, get) => ({
      tournaments: mockTournaments,
      myRegistrations: ["t1"],

      registerForTournament: (registration) => {
        set((state) => {
          const tournament = state.tournaments.find(
            (t) => t.id === registration.tournamentId
          );
          if (!tournament || tournament.currentTeams >= tournament.maxTeams) {
            return state;
          }

          return {
            tournaments: state.tournaments.map((t) =>
              t.id === registration.tournamentId
                ? {
                    ...t,
                    currentTeams: t.currentTeams + 1,
                    registeredTeams: [
                      ...t.registeredTeams,
                      {
                        id: `team-${Date.now()}`,
                        name: registration.teamName,
                        players: ["Вы", registration.partnerId || "Ищем партнёра"],
                        registeredAt: new Date().toISOString(),
                      },
                    ],
                  }
                : t
            ),
            myRegistrations: [...state.myRegistrations, registration.tournamentId],
          };
        });
      },

      withdrawFromTournament: (tournamentId) => {
        set((state) => ({
          tournaments: state.tournaments.map((t) =>
            t.id === tournamentId
              ? { ...t, currentTeams: Math.max(0, t.currentTeams - 1) }
              : t
          ),
          myRegistrations: state.myRegistrations.filter((id) => id !== tournamentId),
        }));
      },

      isRegistered: (tournamentId) => {
        return get().myRegistrations.includes(tournamentId);
      },

      getTournament: (id) => {
        return get().tournaments.find((t) => t.id === id);
      },

      getUpcoming: () => {
        return get().tournaments.filter(
          (t) => t.status === "upcoming" || t.status === "registration"
        );
      },

      getRegistrationOpen: () => {
        return get().tournaments.filter((t) => t.status === "registration");
      },

      getMyTournaments: () => {
        const { tournaments, myRegistrations } = get();
        return tournaments.filter((t) => myRegistrations.includes(t.id));
      },
    }),
    {
      name: "padel-tournaments",
    }
  )
);

// Helper functions
export function getFormatName(format: TournamentFormat): string {
  switch (format) {
    case "single_elimination":
      return "Олимпийская система";
    case "double_elimination":
      return "Двойное выбывание";
    case "round_robin":
      return "Круговой турнир";
    default:
      return format;
  }
}

export function getLevelName(level: TournamentLevel): string {
  switch (level) {
    case "beginner":
      return "Начинающие";
    case "intermediate":
      return "Средний";
    case "advanced":
      return "Продвинутый";
    case "pro":
      return "Профессионалы";
    case "open":
      return "Открытый";
    default:
      return level;
  }
}

export function getLevelColor(level: TournamentLevel): string {
  switch (level) {
    case "beginner":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "intermediate":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "advanced":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "pro":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "open":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    default:
      return "bg-zinc-500/20 text-zinc-400";
  }
}

export function getStatusName(status: TournamentStatus): string {
  switch (status) {
    case "upcoming":
      return "Скоро";
    case "registration":
      return "Регистрация открыта";
    case "in_progress":
      return "Идёт";
    case "completed":
      return "Завершён";
    default:
      return status;
  }
}

export function getStatusColor(status: TournamentStatus): string {
  switch (status) {
    case "upcoming":
      return "bg-blue-500/20 text-blue-400";
    case "registration":
      return "bg-emerald-500/20 text-emerald-400";
    case "in_progress":
      return "bg-yellow-500/20 text-yellow-400";
    case "completed":
      return "bg-zinc-500/20 text-zinc-400";
    default:
      return "bg-zinc-500/20 text-zinc-400";
  }
}
