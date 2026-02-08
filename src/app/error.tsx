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
    // Log error to analytics/monitoring service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Error Icon */}
        <div className="w-20 h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black">Что-то пошло не так</h1>
          <p className="text-zinc-400">
            Произошла ошибка при загрузке страницы. Попробуйте обновить страницу или вернуться позже.
          </p>
        </div>

        {/* Error digest for support */}
        {error.digest && (
          <div className="bg-zinc-900 rounded-lg p-3">
            <p className="text-xs text-zinc-500">Код ошибки:</p>
            <code className="text-xs text-zinc-400 font-mono">{error.digest}</code>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Попробовать снова
          </Button>
          <Button
            variant="outline"
            className="border-zinc-700"
            onClick={() => (window.location.href = "/")}
          >
            <Home className="h-4 w-4 mr-2" />
            На главную
          </Button>
        </div>

        {/* Help */}
        <div className="pt-6 border-t border-zinc-800">
          <p className="text-sm text-zinc-500">
            Если проблема повторяется, напишите нам в{" "}
            <a
              href="https://t.me/padelmoscow"
              className="text-emerald-400 hover:underline"
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
