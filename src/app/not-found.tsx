import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        {/* 404 Visual */}
        <div className="relative">
          <span className="text-[150px] font-black text-zinc-800 leading-none">404</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">🎾</span>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black">Мяч улетел за корт!</h1>
          <p className="text-zinc-400">
            Страница, которую вы ищете, не существует или была перемещена.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold w-full sm:w-auto">
              🎮 Найти игру
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="border-zinc-700 w-full sm:w-auto">
              🏠 На главную
            </Button>
          </Link>
        </div>

        {/* Fun stats */}
        <div className="pt-8 border-t border-zinc-800">
          <p className="text-xs text-zinc-600">
            Пока вы здесь, знали ли вы?
          </p>
          <p className="text-sm text-zinc-400 mt-2">
            В падел играют более 25 миллионов человек по всему миру! 🌍
          </p>
        </div>
      </div>
    </div>
  );
}
