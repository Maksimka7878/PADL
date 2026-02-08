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
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-lime/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-violet/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-hot-pink/5 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "3s" }} />
      </div>

      <div className="max-w-lg w-full text-center space-y-10 animate-slide-up">
        {/* Logo & Brand */}
        <div className="space-y-6">
          <div className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-br from-lime via-cyan to-violet flex items-center justify-center animate-float shadow-2xl glow-lime rotate-3">
            <span className="text-5xl -rotate-3">🎾</span>
          </div>
          <div>
            <h1 className="font-display text-6xl sm:text-7xl font-black tracking-tight leading-none">
              <span className="text-gradient-lime">PADL</span>
            </h1>
            <p className="font-display text-xl sm:text-2xl font-bold text-white/40 tracking-widest uppercase mt-2">
              Moscow
            </p>
          </div>
          <p className="text-white/50 text-lg max-w-sm mx-auto leading-relaxed">
            Найди партнёров для падел-тенниса. Играй. Побеждай. Повторяй.
          </p>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-center gap-8 py-6">
          <div className="text-center">
            <div className="font-display text-3xl font-black text-lime">5+</div>
            <div className="text-[11px] text-white/30 uppercase tracking-[0.2em] mt-1">кортов</div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
            <div className="font-display text-3xl font-black text-violet">100+</div>
            <div className="text-[11px] text-white/30 uppercase tracking-[0.2em] mt-1">игроков</div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
            <div className="font-display text-3xl font-black text-hot-pink">24/7</div>
            <div className="text-[11px] text-white/30 uppercase tracking-[0.2em] mt-1">матчи</div>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <Link href="/login" className="block">
            <Button size="lg" className="w-full h-16 text-lg font-display font-black uppercase tracking-[0.15em]">
              Начать игру
            </Button>
          </Link>
          <p className="text-[13px] text-white/25">
            Бесплатно. Без обязательств.
          </p>
        </div>
      </div>
    </main>
  );
}
