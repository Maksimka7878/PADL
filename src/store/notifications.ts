import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NotificationType =
  | "lobby_joined"      // Someone joined your lobby
  | "lobby_full"        // Your lobby is now full
  | "lobby_reminder"    // Game starting soon
  | "lobby_cancelled"   // Lobby was cancelled
  | "friend_request"    // New friend request
  | "friend_accepted"   // Friend request accepted
  | "level_up"          // Skill level increased
  | "achievement"       // New achievement unlocked
  | "message"           // New chat message
  | "system";           // System notification

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: {
    lobbyId?: string;
    userId?: string;
    courtName?: string;
  };
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;

  // Actions
  addNotification: (notification: Omit<Notification, "id" | "read" | "createdAt">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

// Mock notifications for demo
const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "lobby_joined",
    title: "Новый игрок",
    message: "Алексей присоединился к вашему лобби",
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    data: { lobbyId: "1", courtName: "Padel Moscow Club" },
  },
  {
    id: "n2",
    type: "lobby_reminder",
    title: "Игра скоро",
    message: "Ваша игра начнётся через 2 часа",
    read: false,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    data: { lobbyId: "1", courtName: "Padel Moscow Club" },
  },
  {
    id: "n3",
    type: "friend_request",
    title: "Запрос в друзья",
    message: "Мария хочет добавить вас в друзья",
    read: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    data: { userId: "u2" },
  },
  {
    id: "n4",
    type: "level_up",
    title: "Уровень повышен!",
    message: "Ваш уровень NTRP теперь 3.5",
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: mockNotifications,
      unreadCount: mockNotifications.filter((n) => !n.read).length,

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: crypto.randomUUID(),
          read: false,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },

      markAsRead: (id) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          if (!notification || notification.read) return state;

          return {
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, read: true } : n
            ),
            unreadCount: state.unreadCount - 1,
          };
        });
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        }));
      },

      removeNotification: (id) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          return {
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadCount:
              notification && !notification.read
                ? state.unreadCount - 1
                : state.unreadCount,
          };
        });
      },

      clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
      },
    }),
    {
      name: "padel-notifications",
    }
  )
);

// Helper to get notification icon
export function getNotificationIcon(type: NotificationType): string {
  switch (type) {
    case "lobby_joined":
      return "👤";
    case "lobby_full":
      return "✅";
    case "lobby_reminder":
      return "⏰";
    case "lobby_cancelled":
      return "❌";
    case "friend_request":
      return "🤝";
    case "friend_accepted":
      return "👋";
    case "level_up":
      return "⬆️";
    case "achievement":
      return "🏆";
    case "message":
      return "💬";
    case "system":
    default:
      return "📢";
  }
}

// Helper to format time
export function formatNotificationTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "только что";
  if (diffMins < 60) return `${diffMins} мин назад`;
  if (diffHours < 24) return `${diffHours} ч назад`;
  if (diffDays < 7) return `${diffDays} дн назад`;

  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
}
