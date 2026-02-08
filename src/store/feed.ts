import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FeedFilters, ScoredLobby, EngagementSignals } from "@/lib/feed-algorithm";

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

  // ─── Engagement tracking (persisted) ───
  engagement: EngagementSignals;
  trackView: (courtName: string) => void;
  trackJoin: (courtName: string, metro: string, level: number, timeOfDay: string) => void;
  trackFavorite: (courtName: string) => void;
  trackUnfavorite: (courtName: string) => void;
  trackDismiss: (courtName: string) => void;
  getEngagement: () => EngagementSignals;

  // Active section for navigation
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const defaultFilters: FeedFilters = {
  hasSpots: true,
};

const defaultEngagement: EngagementSignals = {
  joinedCourts: [],
  viewedCourts: [],
  favoritedCourts: [],
  playedLevels: [],
  playedMetros: [],
  joinTimePatterns: [],
  dismissedCourts: [],
  totalJoins: 0,
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

      // ─── Engagement tracking ───
      engagement: defaultEngagement,

      trackView: (courtName) =>
        set((state) => {
          const viewed = state.engagement.viewedCourts;
          // Avoid duplicates, keep last 50
          if (viewed.includes(courtName)) return state;
          return {
            engagement: {
              ...state.engagement,
              viewedCourts: [...viewed, courtName].slice(-50),
            },
          };
        }),

      trackJoin: (courtName, metro, level, timeOfDay) =>
        set((state) => ({
          engagement: {
            ...state.engagement,
            joinedCourts: [...new Set([...state.engagement.joinedCourts, courtName])],
            playedMetros: [...new Set([...state.engagement.playedMetros, metro])],
            playedLevels: [...state.engagement.playedLevels, level].slice(-20),
            joinTimePatterns: [...state.engagement.joinTimePatterns, timeOfDay].slice(-30),
            totalJoins: state.engagement.totalJoins + 1,
          },
        })),

      trackFavorite: (courtName) =>
        set((state) => ({
          engagement: {
            ...state.engagement,
            favoritedCourts: [...new Set([...state.engagement.favoritedCourts, courtName])],
            // Remove from dismissed if was there
            dismissedCourts: state.engagement.dismissedCourts.filter(c => c !== courtName),
          },
        })),

      trackUnfavorite: (courtName) =>
        set((state) => ({
          engagement: {
            ...state.engagement,
            favoritedCourts: state.engagement.favoritedCourts.filter(c => c !== courtName),
          },
        })),

      trackDismiss: (courtName) =>
        set((state) => ({
          engagement: {
            ...state.engagement,
            dismissedCourts: [...new Set([...state.engagement.dismissedCourts, courtName])].slice(-30),
          },
        })),

      getEngagement: () => get().engagement,

      // Active section
      activeSection: "recommended",
      setActiveSection: (section) => set({ activeSection: section }),
    }),
    {
      name: "padel-feed-storage",
      partialize: (state) => ({
        preferredMetros: state.preferredMetros,
        preferredTimes: state.preferredTimes,
        maxPrice: state.maxPrice,
        favorites: state.favorites,
        engagement: state.engagement,
      }),
    }
  )
);
