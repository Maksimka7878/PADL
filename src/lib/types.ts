export interface User {
  id: number;
  name: string | null;
  email: string | null;
  email_verified: Date | null;
  image: string | null;
}

export interface Profile {
  id: string;
  user_id: number;
  full_name: string | null;
  avatar_url: string | null;
  skill_level: number;
  preferred_hand: "Left" | "Right" | "Ambidextrous" | null;
  games_played: number;
  created_at: Date;
}

export interface Court {
  id: string;
  name: string;
  address: string | null;
  metro_station: string | null;
  surface_type: string | null;
  price_per_hour: number | null;
  image_url: string | null;
  created_at: Date;
}

export interface Lobby {
  id: string;
  creator_id: string;
  court_id: string;
  start_time: string;
  min_level: number;
  max_level: number;
  required_players: number;
  description: string | null;
  is_closed: boolean;
  created_at: Date;
  // Joined fields
  court_name?: string;
  metro?: string;
  address?: string;
  price_per_hour?: number;
  participants_count?: number;
}

export interface LobbyParticipant {
  id: string;
  lobby_id: string;
  user_id: string;
  joined_at: Date;
  // Joined fields
  skill_level?: number;
  name?: string;
  image?: string | null;
}

export interface LobbyMessage {
  id: string;
  lobby_id: string;
  user_id: string;
  content: string;
  created_at: Date;
}
