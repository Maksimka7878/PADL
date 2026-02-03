import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCourts } from "@/lib/db";
import type { Court } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin, Train, Banknote, ArrowLeft } from "lucide-react";

const mockCourts: Court[] = [
  {
    id: "c1",
    name: "Padel Moscow Club",
    address: "ул. Большая Филёвская, 22",
    metro_station: "Фили",
    surface_type: "Artificial Grass",
    price_per_hour: 3500,
    image_url: "/courts/padel-moscow.jpg",
    created_at: new Date(),
  },
  {
    id: "c2",
    name: "World Class Paveletskaya",
    address: "ул. Кожевническая, 14",
    metro_station: "Павелецкая",
    surface_type: "Artificial Grass",
    price_per_hour: 4000,
    image_url: "/courts/world-class.jpg",
    created_at: new Date(),
  },
  {
    id: "c3",
    name: "Racket Club",
    address: "ул. Лодочная, 19",
    metro_station: "Тушинская",
    surface_type: "Artificial Grass",
    price_per_hour: 3000,
    image_url: "/courts/racket-club.jpg",
    created_at: new Date(),
  },
  {
    id: "c4",
    name: "Padel Point",
    address: "Кутузовский проспект, 36",
    metro_station: "Кутузовская",
    surface_type: "Artificial Grass",
    price_per_hour: 3800,
    image_url: "/courts/padel-point.jpg",
    created_at: new Date(),
  },
  {
    id: "c5",
    name: "Sport Palace Luzhniki",
    address: "ул. Лужники, 24",
    metro_station: "Спортивная",
    surface_type: "Artificial Grass",
    price_per_hour: 4500,
    image_url: "/courts/luzhniki.jpg",
    created_at: new Date(),
  },
];

export default async function CourtsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  let courts: Court[] = mockCourts;

  try {
    const dbCourts = await getCourts();
    if (dbCourts.length > 0) {
      courts = dbCourts;
    }
  } catch {
    // Use mock data
  }

  return (
    <div className="min-h-screen bg-zinc-950 pb-20 lg:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-black text-lg">Корты Москвы</h1>
            <p className="text-xs text-zinc-500">{courts.length} площадок</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courts.map((court) => (
            <Card key={court.id} className="bg-zinc-900 border-zinc-800 overflow-hidden group hover:border-zinc-700 transition-colors">
              {/* Court Image Placeholder */}
              <div className="h-40 bg-gradient-to-br from-emerald-500/20 to-zinc-900 flex items-center justify-center">
                <span className="text-6xl opacity-50">🎾</span>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-emerald-400">{court.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 text-sm text-zinc-400">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{court.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Train className="h-4 w-4 shrink-0" />
                  <span>м. {court.metro_station}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Banknote className="h-4 w-4" />
                    <span>{court.price_per_hour?.toLocaleString("ru-RU")} ₽/час</span>
                  </div>
                  <span className="text-xs text-zinc-600 uppercase">{court.surface_type}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-lg border-t border-zinc-800 lg:hidden">
        <div className="flex items-center justify-around py-3">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-zinc-500">
            <span className="text-xl">🎮</span>
            <span className="text-[10px] uppercase tracking-wider">Лобби</span>
          </Link>
          <Link href="/courts" className="flex flex-col items-center gap-1 text-emerald-400">
            <MapPin className="h-5 w-5" />
            <span className="text-[10px] uppercase tracking-wider">Корты</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 text-zinc-500">
            <span className="text-xl">👤</span>
            <span className="text-[10px] uppercase tracking-wider">Профиль</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
