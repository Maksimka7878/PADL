"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { LevelBadge, LevelLabel } from "@/components/lobby/LevelBadge";
import Link from "next/link";
import { ArrowLeft, Save, MapPin, User as UserIcon } from "lucide-react";
import { updateProfile } from "@/lib/actions";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [fullName, setFullName] = useState(session?.user?.name || "");
  const [skillLevel, setSkillLevel] = useState(3.5);
  const [preferredHand, setPreferredHand] = useState("Right");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        full_name: fullName,
        skill_level: skillLevel,
        preferred_hand: preferredHand,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] pb-20 lg:pb-8 noise">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display font-black text-lg">Профиль</h1>
            <p className="text-[11px] text-white/30">Настройте свой профиль</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Profile Card */}
        <Card className="glass gradient-border">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-lime/20 to-violet/20 rounded-full flex items-center justify-center ring-2 ring-white/[0.06]">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="Avatar"
                    width={80}
                    height={80}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-10 w-10 text-lime" />
                )}
              </div>
              <div>
                <CardTitle className="font-display text-xl">{session?.user?.name || "Игрок"}</CardTitle>
                <p className="text-sm text-white/30">{session?.user?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <LevelBadge level={skillLevel} />
                  <LevelLabel level={skillLevel} />
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Edit Form */}
        <Card className="glass gradient-border">
          <CardHeader>
            <CardTitle className="font-display text-lg">Настройки профиля</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-white/40 text-xs tracking-wider">
                Полное имя
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Иван Иванов"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-white/40 text-xs tracking-wider">Уровень игры (NTRP)</Label>
              <div className="flex gap-4 items-center">
                <div className="w-16 text-center">
                  <LevelBadge level={skillLevel} size="lg" />
                </div>
                <Slider
                  min={1.0}
                  max={7.0}
                  step={0.5}
                  value={[skillLevel]}
                  onValueChange={(v) => setSkillLevel(v[0])}
                  className="flex-1"
                />
              </div>
              <div className="flex justify-between text-[10px] text-white/20 uppercase tracking-[0.15em]">
                <span>1.0 - Новичок</span>
                <span>4.0 - Средний</span>
                <span>7.0 - Про</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/40 text-xs tracking-wider">Ведущая рука</Label>
              <Select value={preferredHand} onValueChange={setPreferredHand}>
                <SelectTrigger className="bg-white/[0.04] border-white/10 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-surface-2 border-white/10 rounded-xl">
                  <SelectItem value="Right">Правая</SelectItem>
                  <SelectItem value="Left">Левая</SelectItem>
                  <SelectItem value="Ambidextrous">Обе</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full font-display font-bold h-12"
            >
              {isSaving ? (
                "Сохранение..."
              ) : saved ? (
                "Сохранено!"
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Сохранить изменения
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="glass gradient-border">
          <CardHeader>
            <CardTitle className="font-display text-lg">Статистика</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/[0.04]">
                <p className="font-display text-2xl font-black text-lime">0</p>
                <p className="text-[10px] text-white/25 uppercase tracking-[0.15em] mt-1">Игр</p>
              </div>
              <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/[0.04]">
                <p className="font-display text-2xl font-black text-violet">0</p>
                <p className="text-[10px] text-white/25 uppercase tracking-[0.15em] mt-1">Побед</p>
              </div>
              <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/[0.04]">
                <p className="font-display text-2xl font-black text-hot-pink">-</p>
                <p className="text-[10px] text-white/25 uppercase tracking-[0.15em] mt-1">Рейтинг</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 glass-strong lg:hidden">
        <div className="flex items-center justify-around py-3">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-white/30">
            <span className="text-xl">🎮</span>
            <span className="text-[9px] font-display uppercase tracking-[0.15em] font-bold">Лобби</span>
          </Link>
          <Link href="/courts" className="flex flex-col items-center gap-1 text-white/30">
            <MapPin className="h-5 w-5" />
            <span className="text-[9px] font-display uppercase tracking-[0.15em] font-bold">Корты</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 text-lime">
            <UserIcon className="h-5 w-5" />
            <span className="text-[9px] font-display uppercase tracking-[0.15em] font-bold">Профиль</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
