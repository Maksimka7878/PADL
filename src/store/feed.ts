import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FeedFilters, ScoredLobby } from "@/lib/feed-algorithm";

interface FeedState {
  // View mode
  viewMode: "feed" | "list" | "map";
  setViewMode: (mode: "feed" | "list" | "map") => void;

  // Filters
  filters: FeedFilters;
  setFilters: (filters: Partial<FeedFilters>) => void;
  resetFilters: () => void;

  // User preferences (persisted)
  preferredMetros: string[];
  setPreferredMetros: (metros: string[]) => void;
  preferredTimes: string[];
  setPreferredTimes: (times: string[]) => void;
  maxPrice: number | null;
  setMaxPrice: (price: number | null) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Selected lobby for detail view
  selectedLobby: ScoredLobby | null;
  setSelectedLobby: (lobby: ScoredLobby | null) => void;

  // Favorites (persisted)
  favorites: string[];
  addFavorite: (lobbyId: string) => void;
  removeFavorite: (lobbyId: string) => void;
  isFavorite: (lobbyId: string) => boolean;
}

const defaultFilters: FeedFilters = {
  hasSpots: true,
};

export const useFeedStore = create<FeedState>()(
  persist(
    (set, get) => ({
      // View mode
      viewMode: "feed",
      setViewMode: (mode) => set({ viewMode: mode }),

      // Filters
      filters: defaultFilters,
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      resetFilters: () => set({ filters: defaultFilters }),

      // User preferences
      preferredMetros: [],
      setPreferredMetros: (metros) => set({ preferredMetros: metros }),
      preferredTimes: [],
      setPreferredTimes: (times) => set({ preferredTimes: times }),
      maxPrice: null,
      setMaxPrice: (price) => set({ maxPrice: price }),

      // Search
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Selected lobby
      selectedLobby: null,
      setSelectedLobby: (lobby) => set({ selectedLobby: lobby }),

      // Favorites
      favorites: [],
      addFavorite: (lobbyId) =>
        set((state) => ({
          favorites: [...state.favorites, lobbyId],
        })),
      removeFavorite: (lobbyId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== lobbyId),
        })),
      isFavorite: (lobbyId) => get().favorites.includes(lobbyId),
    }),
    {
      name: "padel-feed-storage",
      partialize: (state) => ({
        preferredMetros: state.preferredMetros,
        preferredTimes: state.preferredTimes,
        maxPrice: state.maxPrice,
        favorites: state.favorites,
      }),
    }
  )
);
