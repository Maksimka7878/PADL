import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Friend {
  id: string;
  name: string;
  image?: string | null;
  skill_level: number;
  status: "online" | "offline" | "in_game";
  lastSeen?: string;
  gamesPlayed?: number;
}

export interface FriendRequest {
  id: string;
  from: {
    id: string;
    name: string;
    image?: string | null;
    skill_level: number;
  };
  createdAt: string;
}

interface FriendsState {
  friends: Friend[];
  pendingRequests: FriendRequest[];
  sentRequests: string[];

  // Actions
  addFriend: (friend: Friend) => void;
  removeFriend: (friendId: string) => void;
  acceptRequest: (requestId: string) => void;
  rejectRequest: (requestId: string) => void;
  sendRequest: (userId: string) => void;
  cancelRequest: (userId: string) => void;
  isFriend: (userId: string) => boolean;
  hasPendingRequest: (userId: string) => boolean;
  hasSentRequest: (userId: string) => boolean;
}

// Mock data
const mockFriends: Friend[] = [
  {
    id: "f1",
    name: "Алексей",
    skill_level: 3.5,
    status: "online",
    gamesPlayed: 5,
  },
  {
    id: "f2",
    name: "Мария",
    skill_level: 4.0,
    status: "in_game",
    gamesPlayed: 3,
  },
  {
    id: "f3",
    name: "Дмитрий",
    skill_level: 3.0,
    status: "offline",
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    gamesPlayed: 8,
  },
  {
    id: "f4",
    name: "Елена",
    skill_level: 4.5,
    status: "online",
    gamesPlayed: 2,
  },
];

const mockRequests: FriendRequest[] = [
  {
    id: "r1",
    from: {
      id: "u5",
      name: "Сергей",
      skill_level: 3.5,
    },
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

export const useFriendsStore = create<FriendsState>()(
  persist(
    (set, get) => ({
      friends: mockFriends,
      pendingRequests: mockRequests,
      sentRequests: [],

      addFriend: (friend) => {
        set((state) => ({
          friends: [...state.friends, friend],
        }));
      },

      removeFriend: (friendId) => {
        set((state) => ({
          friends: state.friends.filter((f) => f.id !== friendId),
        }));
      },

      acceptRequest: (requestId) => {
        const request = get().pendingRequests.find((r) => r.id === requestId);
        if (!request) return;

        const newFriend: Friend = {
          id: request.from.id,
          name: request.from.name,
          image: request.from.image,
          skill_level: request.from.skill_level,
          status: "offline",
          gamesPlayed: 0,
        };

        set((state) => ({
          friends: [...state.friends, newFriend],
          pendingRequests: state.pendingRequests.filter(
            (r) => r.id !== requestId
          ),
        }));
      },

      rejectRequest: (requestId) => {
        set((state) => ({
          pendingRequests: state.pendingRequests.filter(
            (r) => r.id !== requestId
          ),
        }));
      },

      sendRequest: (userId) => {
        set((state) => ({
          sentRequests: [...state.sentRequests, userId],
        }));
      },

      cancelRequest: (userId) => {
        set((state) => ({
          sentRequests: state.sentRequests.filter((id) => id !== userId),
        }));
      },

      isFriend: (userId) => {
        return get().friends.some((f) => f.id === userId);
      },

      hasPendingRequest: (userId) => {
        return get().pendingRequests.some((r) => r.from.id === userId);
      },

      hasSentRequest: (userId) => {
        return get().sentRequests.includes(userId);
      },
    }),
    {
      name: "padel-friends",
    }
  )
);

// Helper to format last seen
export function formatLastSeen(dateString?: string): string {
  if (!dateString) return "Давно";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMins < 5) return "только что";
  if (diffMins < 60) return `${diffMins} мин назад`;
  if (diffHours < 24) return `${diffHours} ч назад`;

  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
}

// Get status color
export function getStatusColor(status: Friend["status"]): string {
  switch (status) {
    case "online":
      return "bg-emerald-500";
    case "in_game":
      return "bg-yellow-500";
    case "offline":
    default:
      return "bg-zinc-600";
  }
}

// Get status text
export function getStatusText(status: Friend["status"]): string {
  switch (status) {
    case "online":
      return "Онлайн";
    case "in_game":
      return "В игре";
    case "offline":
    default:
      return "Оффлайн";
  }
}
