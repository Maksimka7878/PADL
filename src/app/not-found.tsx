import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-hot-pink/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] bg-violet/5 rounded-full blur-[100px]" />
      </div>

      <div className="text-center space-y-8 max-w-md animate-slide-up">
        {/* 404 Visual */}
        <div className="relative">
          <span className="font-display text-[150px] font-black text-white/[0.03] leading-none">404</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl animate-float">🎾</span>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="font-display text-2xl font-black text-gradient-vibe">Мяч улетел за корт!</h1>
          <p className="text-white/35">
            Страница, которую вы ищете, не существует или была перемещена.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard">
            <Button className="font-display font-bold w-full sm:w-auto">
              Найти игру
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              На главную
            </Button>
          </Link>
        </div>

        {/* Fun stats */}
        <div className="pt-8 border-t border-white/[0.06]">
          <p className="text-[11px] text-white/15 uppercase tracking-[0.2em]">
            Пока вы здесь, знали ли вы?
          </p>
          <p className="text-sm text-white/30 mt-2">
            В падел играют более 25 миллионов человек по всему миру!
          </p>
        </div>
      </div>
    </div>
  );
}
