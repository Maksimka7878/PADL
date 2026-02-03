import { sql } from "@vercel/postgres";
import type { Court, Lobby, LobbyParticipant, Profile } from "./types";

export { sql };

// Database query helpers
export async function getLobbies(): Promise<Lobby[]> {
  const { rows } = await sql`
    SELECT
      l.*,
      c.name as court_name,
      c.metro_station as metro,
      c.address,
      (SELECT COUNT(*) FROM lobby_participants WHERE lobby_id = l.id) as participants_count
    FROM lobbies l
    JOIN courts c ON l.court_id = c.id
    WHERE l.is_closed = false AND l.start_time > NOW()
    ORDER BY l.start_time ASC
  `;
  return rows as Lobby[];
}

export async function getLobbyById(id: string): Promise<Lobby | undefined> {
  const { rows } = await sql`
    SELECT
      l.*,
      c.name as court_name,
      c.metro_station as metro,
      c.address,
      c.price_per_hour,
      (SELECT COUNT(*) FROM lobby_participants WHERE lobby_id = l.id) as participants_count
    FROM lobbies l
    JOIN courts c ON l.court_id = c.id
    WHERE l.id = ${id}
  `;
  return rows[0] as Lobby | undefined;
}

export async function getCourts(): Promise<Court[]> {
  const { rows } = await sql`
    SELECT * FROM courts ORDER BY name ASC
  `;
  return rows as Court[];
}

export async function getProfileByUserId(userId: number): Promise<Profile | undefined> {
  const { rows } = await sql`
    SELECT * FROM profiles WHERE user_id = ${userId}
  `;
  return rows[0] as Profile | undefined;
}

export async function getLobbyParticipants(lobbyId: string): Promise<LobbyParticipant[]> {
  const { rows } = await sql`
    SELECT
      lp.*,
      p.skill_level,
      u.name,
      u.image
    FROM lobby_participants lp
    JOIN profiles p ON lp.user_id = p.id
    JOIN users u ON p.user_id = u.id
    WHERE lp.lobby_id = ${lobbyId}
  `;
  return rows as LobbyParticipant[];
}
