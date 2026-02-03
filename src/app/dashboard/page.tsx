import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getLobbies, getCourts, getProfileByUserId } from "@/lib/db";
import { LobbyCard } from "@/components/lobby/LobbyCard";
import { CreateGameForm } from "@/components/lobby/CreateGameForm";
import { Button } from "@/components/ui/button";
import { joinLobby, createLobby } from "@/lib/actions";
import Link from "next/link";
import { Plus, User, MapPin, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth";

// Display-ready lobby type
interface DisplayLobby {
  id: string;
  court_name: string;
  metro: string;
  address: string;
  start_time: string;
  min_level: number;
  max_level: number;
  required_players: number;
  participants_count: number;
  description?: string;
}

// Mock data for demo mode
const mockLobbies: DisplayLobby[] = [
  {
    id: "1",
    court_name: "Padel Moscow Club",
    metro: "Фили",
    address: "ул. Большая Филёвская, 22",
    start_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    min_level: 3.0,
    max_level: 4.5,
    required_players: 4,
    participants_count: 2,
    description: "Дружеская игра, ждём всех!",
  },
  {
    id: "2",
    court_name: "World Class Paveletskaya",
    metro: "Павелецкая",
    address: "ул. Кожевническая, 14",
    start_time: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    min_level: 4.0,
    max_level: 5.5,
    required_players: 4,
    participants_count: 3,
    description: "Нужен 4-й игрок!",
  },
  {
    id: "3",
    court_name: "Racket Club",
    metro: "Тушинская",
    address: "ул. Лодочная, 19",
    start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    min_level: 2.0,
    max_level: 3.5,
    required_players: 4,
    participants_count: 1,
    description: "Новички приветствуются",
  },
];

interface CourtOption {
  id: string;
  name: string;
  metro_station: string | null;
  price_per_hour: number | null;
}

const mockCourts: CourtOption[] = [
  { id: "c1", name: "Padel Moscow Club", metro_station: "Фили", price_per_hour: 3500 },
  { id: "c2", name: "World Class Paveletskaya", metro_station: "Павелецкая", price_per_hour: 4000 },
  { id: "c3", name: "Racket Club", metro_station: "Тушинская", price_per_hour: 3000 },
  { id: "c4", name: "Padel Point", metro_station: "Кутузовская", price_per_hour: 3800 },
  { id: "c5", name: "Sport Palace Luzhniki", metro_station: "Спортивная", price_per_hour: 4500 },
];

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Try to get data from DB, fallback to mock data
  let lobbies: DisplayLobby[] = mockLobbies;
  let courts: CourtOption[] = mockCourts;
  let userLevel = 3.5;

  try {
    const dbLobbies = await getLobbies();
    if (dbLobbies.length > 0) {
      lobbies = dbLobbies
        .filter(l => l.court_name && l.metro && l.address)
        .map(l => ({
          id: l.id,
          court_name: l.court_name!,
          metro: l.metro!,
          address: l.address!,
          start_time: l.start_time,
          min_level: l.min_level,
          max_level: l.max_level,
          required_players: l.required_players,
          participants_count: l.participants_count || 0,
          description: l.description || undefined,
        }));
    }
    const dbCourts = await getCourts();
    if (dbCourts.length > 0) {
      courts = dbCourts.map(c => ({
        id: c.id,
        name: c.name,
        metro_station: c.metro_station,
        price_per_hour: c.price_per_hour,
      }));
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

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <span className="text-lg">🎾</span>
            </div>
            <div>
              <h1 className="font-black text-lg">PADEL MOSCOW</h1>
              <p className="text-xs text-zinc-500">Привет, {session.user?.name || "Игрок"}!</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button variant="ghost" size="icon" type="submit">
                <LogOut className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lobbies List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">Активные лобби</h2>
                <p className="text-sm text-zinc-500">Найди игру по своему уровню</p>
              </div>
              <Link href="/courts">
                <Button variant="outline" size="sm" className="border-zinc-700">
                  <MapPin className="h-4 w-4 mr-2" />
                  Корты
                </Button>
              </Link>
            </div>

            {/* Your level indicator */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Ваш уровень NTRP</p>
                <p className="text-2xl font-black text-emerald-400">{userLevel.toFixed(1)}</p>
              </div>
              <Link href="/profile">
                <Button variant="outline" size="sm" className="border-zinc-700">
                  Изменить
                </Button>
              </Link>
            </div>

            {/* Lobbies Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {lobbies.map((lobby) => (
                <LobbyCard
                  key={lobby.id}
                  lobby={lobby}
                  userLevel={userLevel}
                  onJoin={async (id) => {
                    "use server";
                    await joinLobby(id);
                  }}
                />
              ))}
            </div>

            {lobbies.length === 0 && (
              <div className="text-center py-12 bg-zinc-900 rounded-xl border border-zinc-800">
                <p className="text-zinc-500">Пока нет активных лобби</p>
                <p className="text-sm text-zinc-600">Создайте первое!</p>
              </div>
            )}
          </div>

          {/* Create Game Sidebar */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-emerald-500" />
              <h2 className="text-xl font-black">Создать лобби</h2>
            </div>
            <CreateGameForm
              courts={courts}
              onSubmit={async (data) => {
                "use server";
                await createLobby(data);
              }}
            />
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-lg border-t border-zinc-800 lg:hidden">
        <div className="flex items-center justify-around py-3">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-emerald-400">
            <span className="text-xl">🎮</span>
            <span className="text-[10px] uppercase tracking-wider">Лобби</span>
          </Link>
          <Link href="/courts" className="flex flex-col items-center gap-1 text-zinc-500">
            <MapPin className="h-5 w-5" />
            <span className="text-[10px] uppercase tracking-wider">Корты</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 text-zinc-500">
            <User className="h-5 w-5" />
            <span className="text-[10px] uppercase tracking-wider">Профиль</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
