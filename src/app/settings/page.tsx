"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { useGeolocation, findNearestMetro, formatDistance } from "@/hooks/use-geolocation";
import { useFeedStore } from "@/store/feed";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bell,
  BellOff,
  MapPin,
  Loader2,
  Check,
  Moon,
  Globe,
  Shield,
  Trash2,
  LogOut,
  ChevronRight,
  Smartphone,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
} from "lucide-react";

export default function SettingsPage() {
  const {
    isSupported: pushSupported,
    isSubscribed,
    isLoading: pushLoading,
    requestPermission,
    subscribe,
    unsubscribe,
  } = usePushNotifications();

  const {
    isSupported: geoSupported,
    latitude,
    longitude,
    isLoading: geoLoading,
    getCurrentPosition,
  } = useGeolocation();

  const { preferredMetros } = useFeedStore();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);

  const handleEnablePush = async () => {
    const granted = await requestPermission();
    if (granted) {
      const success = await subscribe();
      if (success) {
        toast.success("Уведомления включены!");
      } else {
        toast.error("Не удалось подключить уведомления");
      }
    } else {
      toast.error("Доступ к уведомлениям запрещён");
    }
  };

  const handleDisablePush = async () => {
    const success = await unsubscribe();
    if (success) {
      toast.success("Уведомления отключены");
    }
  };

  const handleGetLocation = () => {
    getCurrentPosition();
  };

  const nearestMetro = latitude && longitude
    ? findNearestMetro(latitude, longitude)
    : null;

  return (
    <div className="min-h-screen bg-zinc-950 pb-20 lg:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="font-black text-lg">Настройки</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="h-5 w-5 text-emerald-500" />
                Уведомления
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Push notifications */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Push-уведомления</Label>
                  <p className="text-sm text-zinc-500">
                    Получайте уведомления о новых играх и сообщениях
                  </p>
                </div>
                {!pushSupported ? (
                  <span className="text-sm text-zinc-500">Не поддерживается</span>
                ) : pushLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
                ) : isSubscribed ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDisablePush}
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    <BellOff className="h-4 w-4 mr-2" />
                    Отключить
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={handleEnablePush}
                    className="bg-emerald-500 hover:bg-emerald-600 text-black"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Включить
                  </Button>
                )}
              </div>

              {/* Sound */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <div className="space-y-1">
                  <Label className="text-base">Звуки</Label>
                  <p className="text-sm text-zinc-500">
                    Звуковые уведомления в приложении
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSoundEnabled(!soundEnabled);
                    toast(soundEnabled ? "Звуки отключены" : "Звуки включены");
                  }}
                  className={soundEnabled ? "border-emerald-500/50 text-emerald-400" : "border-zinc-700"}
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 className="h-4 w-4 mr-2" />
                      Включены
                    </>
                  ) : (
                    <>
                      <VolumeX className="h-4 w-4 mr-2" />
                      Отключены
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-emerald-500" />
                Местоположение
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Определить геолокацию</Label>
                  <p className="text-sm text-zinc-500">
                    Для поиска ближайших кортов и игр
                  </p>
                </div>
                {!geoSupported ? (
                  <span className="text-sm text-zinc-500">Не поддерживается</span>
                ) : geoLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
                ) : latitude && longitude ? (
                  <div className="text-right">
                    <span className="text-sm text-emerald-400 flex items-center gap-1">
                      <Check className="h-4 w-4" />
                      Определено
                    </span>
                    {nearestMetro && (
                      <p className="text-xs text-zinc-500">
                        м. {nearestMetro.station} ({formatDistance(nearestMetro.distance)})
                      </p>
                    )}
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={handleGetLocation}
                    className="bg-emerald-500 hover:bg-emerald-600 text-black"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Определить
                  </Button>
                )}
              </div>

              {/* Preferred metro */}
              <div className="pt-4 border-t border-zinc-800">
                <Label className="text-base">Предпочитаемое метро</Label>
                <p className="text-sm text-zinc-500 mt-1">
                  Текущее: {preferredMetros.length > 0 ? preferredMetros.join(", ") : "Не указано"}
                </p>
                <Link href="/profile">
                  <Button variant="outline" size="sm" className="mt-2 border-zinc-700">
                    Изменить
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-emerald-500" />
                Конфиденциальность
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Приватный профиль</Label>
                  <p className="text-sm text-zinc-500">
                    Скрыть статистику от других игроков
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPrivateProfile(!privateProfile);
                    toast(privateProfile ? "Профиль открыт" : "Профиль скрыт");
                  }}
                  className={privateProfile ? "border-emerald-500/50 text-emerald-400" : "border-zinc-700"}
                >
                  {privateProfile ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Приватный
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Публичный
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <div className="space-y-1">
                  <Label className="text-base">Онлайн-статус</Label>
                  <p className="text-sm text-zinc-500">
                    Показывать, когда вы онлайн
                  </p>
                </div>
                <Button variant="outline" size="sm" className="border-emerald-500/50 text-emerald-400">
                  <Check className="h-4 w-4 mr-2" />
                  Виден
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* App */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Smartphone className="h-5 w-5 text-emerald-500" />
                Приложение
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Тёмная тема</Label>
                  <p className="text-sm text-zinc-500">
                    Всегда использовать тёмную тему
                  </p>
                </div>
                <Button variant="outline" size="sm" className="border-emerald-500/50 text-emerald-400">
                  <Moon className="h-4 w-4 mr-2" />
                  Тёмная
                </Button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <div className="space-y-1">
                  <Label className="text-base">Язык</Label>
                  <p className="text-sm text-zinc-500">
                    Язык интерфейса приложения
                  </p>
                </div>
                <Button variant="outline" size="sm" className="border-zinc-700">
                  <Globe className="h-4 w-4 mr-2" />
                  Русский
                </Button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <div className="space-y-1">
                  <Label className="text-base">Версия</Label>
                  <p className="text-sm text-zinc-500">
                    Padel Moscow v1.0.0
                  </p>
                </div>
                <span className="text-xs text-emerald-400">Актуальная</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-zinc-900 border-red-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-red-400">
                <Trash2 className="h-5 w-5" />
                Опасная зона
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Очистить кэш</Label>
                  <p className="text-sm text-zinc-500">
                    Удалить локальные данные приложения
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  onClick={() => {
                    localStorage.clear();
                    toast.success("Кэш очищен");
                  }}
                >
                  Очистить
                </Button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <div className="space-y-1">
                  <Label className="text-base">Выйти из аккаунта</Label>
                  <p className="text-sm text-zinc-500">
                    Завершить текущую сессию
                  </p>
                </div>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Выйти
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
