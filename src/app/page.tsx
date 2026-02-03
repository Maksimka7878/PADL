import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-zinc-900 to-zinc-950">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo */}
        <div className="space-y-4">
          <div className="w-24 h-24 mx-auto bg-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/20">
            <span className="text-4xl">🎾</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">
            <span className="text-emerald-400">PADEL</span>
            <span className="text-white"> MOSCOW</span>
          </h1>
          <p className="text-zinc-400 text-lg">
            Найди партнёров для падел-тенниса в Москве
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 py-8">
          <div className="text-center">
            <div className="text-3xl mb-2">🏟️</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider">Корты</div>
            <div className="text-lg font-bold text-emerald-400">5+</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider">Игроки</div>
            <div className="text-lg font-bold text-emerald-400">100+</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider">Матчи</div>
            <div className="text-lg font-bold text-emerald-400">24/7</div>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <Link href="/login" className="block">
            <Button className="w-full h-14 text-lg font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-600 text-black">
              Начать игру
            </Button>
          </Link>
          <p className="text-xs text-zinc-600">
            Присоединяйся к сообществу падел-теннисистов Москвы
          </p>
        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>
    </main>
  );
}
