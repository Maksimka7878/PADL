import { create } from "zustand";

interface Lobby {
  id: string;
  court_name: string;
  metro: string;
  start_time: string;
  min_level: number;
  max_level: number;
  required_players: number;
  participants_count: number;
}

interface LobbyStore {
  lobbies: Lobby[];
  selectedLobbyId: string | null;
  isLoading: boolean;
  filter: {
    minLevel: number;
    maxLevel: number;
    metro: string | null;
  };
  setLobbies: (lobbies: Lobby[]) => void;
  selectLobby: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setFilter: (filter: Partial<LobbyStore["filter"]>) => void;
  getFilteredLobbies: () => Lobby[];
}

export const useLobbyStore = create<LobbyStore>((set, get) => ({
  lobbies: [],
  selectedLobbyId: null,
  isLoading: false,
  filter: {
    minLevel: 1.0,
    maxLevel: 7.0,
    metro: null,
  },
  setLobbies: (lobbies) => set({ lobbies }),
  selectLobby: (id) => set({ selectedLobbyId: id }),
  setLoading: (isLoading) => set({ isLoading }),
  setFilter: (filter) =>
    set((state) => ({ filter: { ...state.filter, ...filter } })),
  getFilteredLobbies: () => {
    const { lobbies, filter } = get();
    return lobbies.filter((lobby) => {
      const levelMatch =
        lobby.min_level >= filter.minLevel && lobby.max_level <= filter.maxLevel;
      const metroMatch = !filter.metro || lobby.metro === filter.metro;
      return levelMatch && metroMatch;
    });
  },
}));
