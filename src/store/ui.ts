import { create } from "zustand";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface UIState {
  // Modals
  isCreateLobbyOpen: boolean;
  openCreateLobby: () => void;
  closeCreateLobby: () => void;

  // Loading states
  isJoiningLobby: string | null;
  setJoiningLobby: (lobbyId: string | null) => void;

  // Toasts
  toasts: Toast[];
  addToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: string) => void;

  // Chat
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;

  // Filters
  levelFilter: [number, number];
  setLevelFilter: (range: [number, number]) => void;
  dateFilter: string | null;
  setDateFilter: (date: string | null) => void;
  resetFilters: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Modals
  isCreateLobbyOpen: false,
  openCreateLobby: () => set({ isCreateLobbyOpen: true }),
  closeCreateLobby: () => set({ isCreateLobbyOpen: false }),

  // Loading states
  isJoiningLobby: null,
  setJoiningLobby: (lobbyId) => set({ isJoiningLobby: lobbyId }),

  // Toasts
  toasts: [],
  addToast: (message, type = "info") =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { id: crypto.randomUUID(), message, type },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  // Chat
  isChatOpen: false,
  openChat: () => set({ isChatOpen: true }),
  closeChat: () => set({ isChatOpen: false }),
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),

  // Filters
  levelFilter: [1.0, 7.0],
  setLevelFilter: (range) => set({ levelFilter: range }),
  dateFilter: null,
  setDateFilter: (date) => set({ dateFilter: date }),
  resetFilters: () => set({ levelFilter: [1.0, 7.0], dateFilter: null }),
}));
