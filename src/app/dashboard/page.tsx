import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getLobbies, getCourts, getProfileByUserId } from "@/lib/db";
import { CreateGameForm } from "@/components/lobby/CreateGameForm";
import { DashboardFeed } from "@/components/feed/DashboardFeed";
import { Button } from "@/components/ui/button";
import { joinLobby, createLobby } from "@/lib/actions";
import Link from "next/link";
import { Plus, User, MapPin, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth";
import type { FeedLobby, UserPreferences } from "@/lib/feed-algorithm";

// Mock data for demo mode (conforms to FeedLobby)
const mockLobbies: FeedLobby[] = [
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
    price_per_hour: 3500,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    creator_rating: 4.5,
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
    price_per_hour: 4000,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    creator_rating: 4.8,
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
    price_per_hour: 3000,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    creator_rating: 4.2,
  },
  {
    id: "4",
    court_name: "Padel Point",
    metro: "Кутузовская",
    address: "Кутузовский проспект, 36",
    start_time: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
    min_level: 3.5,
    max_level: 5.0,
    required_players: 4,
    participants_count: 2,
    description: "Вечерняя игра, нужны ещё двое!",
    price_per_hour: 3800,
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    creator_rating: 4.6,
  },
  {
    id: "5",
    court_name: "Sport Palace Luzhniki",
    metro: "Спортивная",
    address: "Лужнецкая набережная, 24",
    start_time: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    min_level: 5.0,
    max_level: 7.0,
    required_players: 4,
    participants_count: 1,
    description: "Турнирная подготовка, ждём сильных игроков",
    price_per_hour: 4500,
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    creator_rating: 5.0,
  },
  {
    id: "6",
    court_name: "Padel Moscow Club",
    metro: "Фили",
    address: "ул. Большая Филёвская, 22",
    start_time: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    min_level: 1.0,
    max_level: 2.5,
    required_players: 4,
    participants_count: 0,
    description: "Игра для начинающих, приходите все!",
    price_per_hour: 3500,
    created_at: new Date().toISOString(),
    creator_rating: 4.3,
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
  let lobbies: FeedLobby[] = mockLobbies;
  let courts: CourtOption[] = mockCourts;
  let userLevel = 3.5;
  let preferredMetros: string[] = [];

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

  const userPrefs: UserPreferences = {
    skill_level: userLevel,
    preferred_metro: preferredMetros.length > 0 ? preferredMetros : undefined,
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] noise">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime to-cyan flex items-center justify-center shadow-lg">
              <span className="text-lg">🎾</span>
            </div>
            <div>
              <h1 className="font-display font-black text-lg tracking-tight">PADL</h1>
              <p className="text-[11px] text-white/30">Привет, {session.user?.name || "Игрок"}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button variant="ghost" size="icon" type="submit" className="rounded-xl">
                <LogOut className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 pb-24 lg:pb-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Feed with recommendation algorithm */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-black text-gradient-lime">Лента игр</h2>
                <p className="text-sm text-white/30 mt-1">Персональные рекомендации для вас</p>
              </div>
              <Link href="/courts">
                <Button variant="outline" size="sm">
                  <MapPin className="h-4 w-4 mr-2 text-violet" />
                  Корты
                </Button>
              </Link>
            </div>

            {/* Your level indicator */}
            <div className="glass rounded-2xl p-5 flex items-center justify-between gradient-border">
              <div>
                <p className="text-[11px] text-white/30 uppercase tracking-[0.2em]">Ваш уровень NTRP</p>
                <p className="font-display text-3xl font-black text-lime mt-1">{userLevel.toFixed(1)}</p>
              </div>
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  Изменить
                </Button>
              </Link>
            </div>

            {/* Recommendation Feed */}
            <DashboardFeed
              lobbies={lobbies}
              userPrefs={userPrefs}
              onJoin={async (id) => {
                "use server";
                await joinLobby(id);
              }}
            />
          </div>

          {/* Create Game Sidebar */}
          <div className="space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-violet/20 flex items-center justify-center">
                <Plus className="h-4 w-4 text-violet" />
              </div>
              <h2 className="font-display text-xl font-black">Создать лобби</h2>
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
      <nav className="fixed bottom-0 left-0 right-0 glass-strong lg:hidden safe-area-bottom">
        <div className="flex items-center justify-around py-3">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-lime">
            <span className="text-xl">🎮</span>
            <span className="text-[9px] font-display uppercase tracking-[0.15em] font-bold">Лобби</span>
          </Link>
          <Link href="/courts" className="flex flex-col items-center gap-1 text-white/30 hover:text-white/50 transition-colors">
            <MapPin className="h-5 w-5" />
            <span className="text-[9px] font-display uppercase tracking-[0.15em] font-bold">Корты</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 text-white/30 hover:text-white/50 transition-colors">
            <User className="h-5 w-5" />
            <span className="text-[9px] font-display uppercase tracking-[0.15em] font-bold">Профиль</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
