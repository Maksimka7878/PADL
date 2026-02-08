import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getLobbyById, getLobbyParticipants, getProfileByUserId } from "@/lib/db";
import { LevelBadge } from "@/components/lobby/LevelBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Calendar, Users } from "lucide-react";
import { joinLobby, leaveLobby } from "@/lib/actions";
import { LobbyChatButton } from "@/components/lobby/LobbyChatButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface LobbyDetail {
  id: string;
  court_name: string;
  metro: string;
  address: string;
  start_time: string;
  min_level: number;
  max_level: number;
  required_players: number;
  participants_count: number;
  price_per_hour?: number;
  description?: string | null;
}

interface Participant {
  id: string;
  name?: string;
  skill_level?: number;
  image?: string | null;
  user_id?: string;
}

// Mock data for demo
const mockLobby: LobbyDetail = {
  id: "1",
  court_name: "Padel Moscow Club",
  metro: "Фили",
  address: "ул. Большая Филёвская, 22",
  start_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  min_level: 3.0,
  max_level: 4.5,
  required_players: 4,
  participants_count: 2,
  price_per_hour: 3500,
  description: "Дружеская игра, ждём всех!",
};

const mockParticipants: Participant[] = [
  { id: "p1", name: "Алексей", skill_level: 3.5, image: null },
  { id: "p2", name: "Мария", skill_level: 4.0, image: null },
];

export default async function LobbyDetailPage({ params }: PageProps) {
  const session = await auth();
  const { id } = await params;

  if (!session) {
    redirect("/login");
  }

  let lobby: LobbyDetail = mockLobby;
  let participants: Participant[] = mockParticipants;
  let userLevel = 3.5;
  let isParticipant = false;

  try {
    const dbLobby = await getLobbyById(id);
    if (dbLobby && dbLobby.court_name && dbLobby.metro && dbLobby.address) {
      lobby = {
        id: dbLobby.id,
        court_name: dbLobby.court_name,
        metro: dbLobby.metro,
        address: dbLobby.address,
        start_time: dbLobby.start_time,
        min_level: dbLobby.min_level,
        max_level: dbLobby.max_level,
        required_players: dbLobby.required_players,
        participants_count: dbLobby.participants_count || 0,
        price_per_hour: dbLobby.price_per_hour,
        description: dbLobby.description,
      };
    }
    const dbParticipants = await getLobbyParticipants(id);
    if (dbParticipants.length > 0) {
      participants = dbParticipants.map(p => ({
        id: p.id,
        name: p.name,
        skill_level: p.skill_level,
        image: p.image,
        user_id: p.user_id,
      }));
      isParticipant = dbParticipants.some(
        (p) => p.user_id === session.user?.profileId
      );
    }
    if (session.user?.profileId) {
      const profile = await getProfileByUserId(parseInt(session.user.id));
      if (profile?.skill_level) {
        userLevel = Number(profile.skill_level);
      }
    }
  } catch {
    // Use mock data
  }

  const isLevelCompatible = userLevel >= lobby.min_level && userLevel <= lobby.max_level;
  const isFull = participants.length >= lobby.required_players;
  const spotsLeft = lobby.required_players - participants.length;

  return (
    <div className="min-h-screen bg-zinc-950 pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="font-black text-lg truncate">{lobby.court_name}</h1>
            <div className="flex items-center text-xs text-zinc-500">
              <MapPin className="h-3 w-3 mr-1" />
              {lobby.metro}
            </div>
          </div>
          <div className="flex gap-1 items-center bg-zinc-900 p-1.5 rounded-lg border border-zinc-800">
            <LevelBadge level={lobby.min_level} size="sm" />
            <span className="text-zinc-600 px-0.5 text-xs">/</span>
            <LevelBadge level={lobby.max_level} size="sm" />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Info Card */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-sm text-zinc-500">Дата и время</p>
                <p className="font-bold">
                  {new Date(lobby.start_time).toLocaleString("ru-RU", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-sm text-zinc-500">Адрес</p>
                <p className="font-bold">{lobby.address}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-sm text-zinc-500">Игроки</p>
                <p className="font-bold">
                  {participants.length} / {lobby.required_players}
                  {!isFull && (
                    <span className="text-emerald-400 ml-2">({spotsLeft} мест свободно)</span>
                  )}
                </p>
              </div>
            </div>

            {lobby.price_per_hour && (
              <div className="pt-2 border-t border-zinc-800">
                <p className="text-sm text-zinc-500">Стоимость на человека</p>
                <p className="text-xl font-black text-emerald-400">
                  ~{Math.round(lobby.price_per_hour / lobby.required_players).toLocaleString("ru-RU")} ₽
                </p>
              </div>
            )}

            {lobby.description && (
              <div className="pt-2 border-t border-zinc-800">
                <p className="text-sm text-zinc-500">Описание</p>
                <p className="text-white">{lobby.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Participants */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-500" />
              Участники ({participants.length}/{lobby.required_players})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {participants.map((p, i) => (
                <div
                  key={p.id || i}
                  className="flex items-center gap-3 p-3 bg-zinc-950 rounded-lg"
                >
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    {p.image ? (
                      <Image src={p.image} alt="" width={40} height={40} className="w-full h-full rounded-full" />
                    ) : (
                      <span className="text-lg">👤</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{p.name}</p>
                  </div>
                  <LevelBadge level={p.skill_level || 3.5} size="sm" />
                </div>
              ))}

              {/* Empty slots */}
              {Array.from({ length: spotsLeft }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex items-center gap-3 p-3 bg-zinc-950/50 rounded-lg border border-dashed border-zinc-800"
                >
                  <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                    <span className="text-zinc-600">?</span>
                  </div>
                  <p className="text-zinc-600">Ожидаем игрока...</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          {isParticipant ? (
            <form
              action={async () => {
                "use server";
                await leaveLobby(id);
              }}
            >
              <Button
                type="submit"
                variant="outline"
                className="w-full h-12 border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                Покинуть лобби
              </Button>
            </form>
          ) : (
            <form
              action={async () => {
                "use server";
                await joinLobby(id);
              }}
            >
              <Button
                type="submit"
                disabled={!isLevelCompatible || isFull}
                className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-black font-bold"
              >
                {isFull
                  ? "Лобби заполнено"
                  : isLevelCompatible
                    ? "Присоединиться"
                    : "Ваш уровень не подходит"}
              </Button>
            </form>
          )}

          <LobbyChatButton
            lobbyId={id}
            currentUserName={session.user?.name || undefined}
          />
        </div>
      </main>
    </div>
  );
}
