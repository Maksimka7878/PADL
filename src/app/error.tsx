"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-hot-pink/8 rounded-full blur-[120px]" />
      </div>

      <div className="text-center space-y-8 max-w-md animate-slide-up">
        {/* Error Icon */}
        <div className="w-20 h-20 mx-auto bg-hot-pink/10 rounded-2xl flex items-center justify-center border border-hot-pink/20">
          <AlertTriangle className="h-10 w-10 text-hot-pink" />
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="font-display text-2xl font-black">Что-то пошло не так</h1>
          <p className="text-white/35">
            Произошла ошибка при загрузке страницы. Попробуйте обновить страницу или вернуться позже.
          </p>
        </div>

        {/* Error digest */}
        {error.digest && (
          <div className="glass rounded-xl p-3">
            <p className="text-[11px] text-white/25 uppercase tracking-wider">Код ошибки:</p>
            <code className="text-xs text-white/40 font-mono">{error.digest}</code>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="font-display font-bold"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Попробовать снова
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
          >
            <Home className="h-4 w-4 mr-2" />
            На главную
          </Button>
        </div>

        {/* Help */}
        <div className="pt-6 border-t border-white/[0.06]">
          <p className="text-sm text-white/25">
            Если проблема повторяется, напишите нам в{" "}
            <a
              href="https://t.me/padelmoscow"
              className="text-lime hover:text-lime-dark transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Telegram
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
