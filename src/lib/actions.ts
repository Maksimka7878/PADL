"use server";

import { sql } from "@vercel/postgres";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createLobby(formData: {
  court_id: string;
  start_time: string;
  min_level: number;
  max_level: number;
  description?: string;
}) {
  const session = await auth();
  if (!session?.user?.profileId) {
    throw new Error("Необходима авторизация");
  }

  const { rows } = await sql`
    INSERT INTO lobbies (creator_id, court_id, start_time, min_level, max_level, description)
    VALUES (${session.user.profileId}, ${formData.court_id}, ${formData.start_time}, ${formData.min_level}, ${formData.max_level}, ${formData.description || null})
    RETURNING id
  `;

  // Creator automatically joins
  await sql`
    INSERT INTO lobby_participants (lobby_id, user_id)
    VALUES (${rows[0].id}, ${session.user.profileId})
  `;

  revalidatePath("/dashboard");
  return { success: true, lobbyId: rows[0].id };
}

export async function joinLobby(lobbyId: string) {
  const session = await auth();
  if (!session?.user?.profileId) {
    throw new Error("Необходима авторизация");
  }

  // Check if user level is compatible
  const { rows: profileRows } = await sql`
    SELECT skill_level FROM profiles WHERE id = ${session.user.profileId}
  `;

  const { rows: lobbyRows } = await sql`
    SELECT min_level, max_level, required_players,
           (SELECT COUNT(*) FROM lobby_participants WHERE lobby_id = lobbies.id) as current_count
    FROM lobbies WHERE id = ${lobbyId}
  `;

  if (!lobbyRows[0]) {
    throw new Error("Лобби не найдено");
  }

  const userLevel = profileRows[0]?.skill_level || 3.5;
  const lobby = lobbyRows[0];

  if (userLevel < lobby.min_level || userLevel > lobby.max_level) {
    throw new Error("Ваш уровень не соответствует требованиям лобби");
  }

  if (lobby.current_count >= lobby.required_players) {
    throw new Error("Лобби уже заполнено");
  }

  await sql`
    INSERT INTO lobby_participants (lobby_id, user_id)
    VALUES (${lobbyId}, ${session.user.profileId})
    ON CONFLICT (lobby_id, user_id) DO NOTHING
  `;

  // Close lobby if full
  const newCount = lobby.current_count + 1;
  if (newCount >= lobby.required_players) {
    await sql`UPDATE lobbies SET is_closed = true WHERE id = ${lobbyId}`;
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/lobbies/${lobbyId}`);
  return { success: true };
}

export async function leaveLobby(lobbyId: string) {
  const session = await auth();
  if (!session?.user?.profileId) {
    throw new Error("Необходима авторизация");
  }

  await sql`
    DELETE FROM lobby_participants
    WHERE lobby_id = ${lobbyId} AND user_id = ${session.user.profileId}
  `;

  // Reopen lobby if it was closed
  await sql`UPDATE lobbies SET is_closed = false WHERE id = ${lobbyId}`;

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/lobbies/${lobbyId}`);
  return { success: true };
}

export async function sendMessage(lobbyId: string, content: string) {
  const session = await auth();
  if (!session?.user?.profileId) {
    throw new Error("Необходима авторизация");
  }

  await sql`
    INSERT INTO lobby_messages (lobby_id, user_id, content)
    VALUES (${lobbyId}, ${session.user.profileId}, ${content})
  `;

  revalidatePath(`/dashboard/lobbies/${lobbyId}`);
  return { success: true };
}

export async function updateProfile(data: {
  full_name?: string;
  skill_level?: number;
  preferred_hand?: string;
}) {
  const session = await auth();
  if (!session?.user?.profileId) {
    throw new Error("Необходима авторизация");
  }

  await sql`
    UPDATE profiles
    SET
      full_name = COALESCE(${data.full_name}, full_name),
      skill_level = COALESCE(${data.skill_level}, skill_level),
      preferred_hand = COALESCE(${data.preferred_hand}, preferred_hand)
    WHERE id = ${session.user.profileId}
  `;

  revalidatePath("/profile");
  return { success: true };
}
