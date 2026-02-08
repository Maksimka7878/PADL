"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useTournamentsStore,
  getFormatName,
  getLevelName,
  getLevelColor,
  getStatusName,
  getStatusColor,
  type Tournament,
} from "@/store/tournaments";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  ArrowLeft,
  Trophy,
  Calendar,
  MapPin,
  Users,
  Banknote,
  Clock,
  ChevronRight,
  CheckCircle,
  Award,
  Swords,
  Info,
  User,
} from "lucide-react";

type Tab = "all" | "my" | "upcoming";

export default function TournamentsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [teamName, setTeamName] = useState("");

  const {
    tournaments,
    getMyTournaments,
    getUpcoming,
    isRegistered,
    registerForTournament,
    withdrawFromTournament,
  } = useTournamentsStore();

  const displayTournaments =
    activeTab === "all"
      ? tournaments
      : activeTab === "my"
        ? getMyTournaments()
        : getUpcoming();

  const handleRegister = () => {
    if (!selectedTournament || !teamName.trim()) {
      toast.error("Введите название команды");
      return;
    }

    registerForTournament({
      tournamentId: selectedTournament.id,
      teamName: teamName.trim(),
    });

    toast.success("Вы зарегистрированы на турнир!");
    setShowRegistration(false);
    setTeamName("");
  };

  const handleWithdraw = (tournamentId: string) => {
    if (confirm("Вы уверены, что хотите отменить регистрацию?")) {
      withdrawFromTournament(tournamentId);
      toast("Регистрация отменена");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-20 lg:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="font-black text-lg">Турниры</h1>
            <p className="text-xs text-zinc-500">
              {tournaments.filter((t) => t.status === "registration").length}{" "}
              с открытой регистрацией
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-2">
          {(["all", "upcoming", "my"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === tab
                  ? "bg-emerald-500 text-black"
                  : "bg-zinc-900 text-zinc-400 hover:text-white"
                }`}
            >
              {tab === "all" && "Все турниры"}
              {tab === "upcoming" && "Ближайшие"}
              {tab === "my" && "Мои турниры"}
            </button>
          ))}
        </div>

        {/* Tournament List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {displayTournaments.map((tournament, index) => (
              <motion.div
                key={tournament.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <TournamentCard
                  tournament={tournament}
                  isRegistered={isRegistered(tournament.id)}
                  onClick={() => setSelectedTournament(tournament)}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {displayTournaments.length === 0 && (
            <div className="text-center py-12 text-zinc-500">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>
                {activeTab === "my"
                  ? "Вы ещё не зарегистрированы ни на один турнир"
                  : "Турниры не найдены"}
              </p>
              {activeTab === "my" && (
                <Button
                  className="mt-4"
                  onClick={() => setActiveTab("all")}
                >
                  Смотреть все турниры
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Tournament Detail Modal */}
      <Dialog
        open={!!selectedTournament && !showRegistration}
        onOpenChange={(open) => !open && setSelectedTournament(null)}
      >
        {selectedTournament && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-950 border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {selectedTournament.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Status & Level */}
              <div className="flex flex-wrap gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                    selectedTournament.status
                  )}`}
                >
                  {getStatusName(selectedTournament.status)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${getLevelColor(
                    selectedTournament.level
                  )}`}
                >
                  {getLevelName(selectedTournament.level)}
                </span>
                <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs">
                  {getFormatName(selectedTournament.format)}
                </span>
              </div>

              {/* Description */}
              <p className="text-zinc-400">{selectedTournament.description}</p>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-900 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-emerald-400 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">Даты</span>
                  </div>
                  <p className="text-sm">
                    {format(
                      new Date(selectedTournament.startDate),
                      "d MMM",
                      { locale: ru }
                    )}
                    {selectedTournament.startDate !== selectedTournament.endDate && (
                      <>
                        {" - "}
                        {format(
                          new Date(selectedTournament.endDate),
                          "d MMM",
                          { locale: ru }
                        )}
                      </>
                    )}
                  </p>
                </div>
                <div className="bg-zinc-900 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-emerald-400 mb-1">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">Участники</span>
                  </div>
                  <p className="text-sm">
                    {selectedTournament.currentTeams} /{" "}
                    {selectedTournament.maxTeams} команд
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{selectedTournament.location}</p>
                  <p className="text-sm text-zinc-400">
                    {selectedTournament.court}
                  </p>
                </div>
              </div>

              {/* Prizes */}
              <div className="space-y-3">
                <h3 className="font-bold flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-400" />
                  Призовой фонд: {selectedTournament.prizePool.toLocaleString("ru-RU")} ₽
                </h3>
                <div className="space-y-2">
                  {selectedTournament.prizes.map((prize) => (
                    <div
                      key={prize.place}
                      className="flex items-center justify-between py-2 px-3 bg-zinc-900 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {prize.place === 1 && "🥇"}
                          {prize.place === 2 && "🥈"}
                          {prize.place === 3 && "🥉"}
                          {prize.place > 3 && `${prize.place}.`}
                        </span>
                        <span className="text-sm">{prize.prize}</span>
                      </div>
                      {prize.amount && (
                        <span className="font-bold text-emerald-400">
                          {prize.amount.toLocaleString("ru-RU")} ₽
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Rules */}
              {selectedTournament.rules && selectedTournament.rules.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-400" />
                    Правила
                  </h3>
                  <ul className="space-y-1.5">
                    {selectedTournament.rules.map((rule, i) => (
                      <li key={i} className="text-sm text-zinc-400 flex gap-2">
                        <span className="text-emerald-500">•</span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Entry Fee */}
              <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-xl">
                <div className="flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-emerald-500" />
                  <span>Взнос за участие</span>
                </div>
                <span className="text-xl font-black text-emerald-400">
                  {selectedTournament.entryFee.toLocaleString("ru-RU")} ₽
                </span>
              </div>

              {/* Registration Deadline */}
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Clock className="h-4 w-4" />
                <span>
                  Регистрация до{" "}
                  {format(
                    new Date(selectedTournament.registrationDeadline),
                    "d MMMM, HH:mm",
                    { locale: ru }
                  )}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {isRegistered(selectedTournament.id) ? (
                  <>
                    <Button
                      variant="outline"
                      className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
                      onClick={() => handleWithdraw(selectedTournament.id)}
                    >
                      Отменить регистрацию
                    </Button>
                    <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black font-bold" disabled>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Вы зарегистрированы
                    </Button>
                  </>
                ) : selectedTournament.status === "registration" ? (
                  <Button
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black font-bold"
                    onClick={() => setShowRegistration(true)}
                    disabled={
                      selectedTournament.currentTeams >=
                      selectedTournament.maxTeams
                    }
                  >
                    {selectedTournament.currentTeams >=
                      selectedTournament.maxTeams
                      ? "Места закончились"
                      : "Зарегистрироваться"}
                  </Button>
                ) : (
                  <Button className="flex-1" disabled>
                    Регистрация закрыта
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Registration Modal */}
      <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
        <DialogContent className="max-w-md bg-zinc-950 border-zinc-800">
          <DialogHeader>
            <DialogTitle>Регистрация на турнир</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-sm text-zinc-400">
              {selectedTournament?.name}
            </p>

            <div className="space-y-2">
              <Label>Название команды</Label>
              <Input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Например: Smash Bros"
                className="bg-zinc-900 border-zinc-800"
              />
            </div>

            <div className="p-4 bg-zinc-900 rounded-xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Взнос:</span>
                <span className="font-bold">
                  {selectedTournament?.entryFee.toLocaleString("ru-RU")} ₽
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-500">
              После регистрации с вами свяжется организатор для подтверждения
              участия и оплаты.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-zinc-700"
              onClick={() => setShowRegistration(false)}
            >
              Отмена
            </Button>
            <Button
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black font-bold"
              onClick={handleRegister}
            >
              Зарегистрироваться
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-lg border-t border-zinc-800 lg:hidden">
        <div className="flex items-center justify-around py-3">
          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-1 text-zinc-500"
          >
            <span className="text-xl">🎮</span>
            <span className="text-[10px] uppercase tracking-wider">Лобби</span>
          </Link>
          <Link
            href="/tournaments"
            className="flex flex-col items-center gap-1 text-emerald-400"
          >
            <Trophy className="h-5 w-5" />
            <span className="text-[10px] uppercase tracking-wider">
              Турниры
            </span>
          </Link>
          <Link
            href="/leaderboard"
            className="flex flex-col items-center gap-1 text-zinc-500"
          >
            <Swords className="h-5 w-5" />
            <span className="text-[10px] uppercase tracking-wider">
              Рейтинг
            </span>
          </Link>
          <Link
            href="/profile"
            className="flex flex-col items-center gap-1 text-zinc-500"
          >
            <User className="h-5 w-5" />
            <span className="text-[10px] uppercase tracking-wider">
              Профиль
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

function TournamentCard({
  tournament,
  isRegistered,
  onClick,
}: {
  tournament: Tournament;
  isRegistered: boolean;
  onClick: () => void;
}) {
  const spotsLeft = tournament.maxTeams - tournament.currentTeams;
  const isFull = spotsLeft === 0;

  return (
    <Card
      className="bg-zinc-900 border-zinc-800 overflow-hidden group hover:border-emerald-500/50 transition-all cursor-pointer"
      onClick={onClick}
    >
      {/* Header gradient */}
      <div className="h-2 bg-gradient-to-r from-emerald-500 via-emerald-400 to-yellow-400" />

      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Date badge */}
          <div className="text-center bg-zinc-800 rounded-lg p-2 min-w-[60px]">
            <p className="text-2xl font-black">
              {format(new Date(tournament.startDate), "d")}
            </p>
            <p className="text-xs text-zinc-400 uppercase">
              {format(new Date(tournament.startDate), "MMM", { locale: ru })}
            </p>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(
                  tournament.status
                )}`}
              >
                {getStatusName(tournament.status)}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getLevelColor(
                  tournament.level
                )}`}
              >
                {getLevelName(tournament.level)}
              </span>
            </div>

            <h3 className="font-bold text-lg group-hover:text-emerald-400 transition-colors">
              {tournament.name}
            </h3>

            <div className="flex items-center gap-4 mt-2 text-sm text-zinc-400">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {tournament.location}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {tournament.currentTeams}/{tournament.maxTeams}
              </span>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">
                  {tournament.entryFee.toLocaleString("ru-RU")} ₽
                </span>
                <span className="text-xs text-zinc-500">взнос</span>
              </div>

              <div className="flex items-center gap-2">
                {isRegistered && (
                  <span className="flex items-center gap-1 text-xs text-emerald-400">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Вы участвуете
                  </span>
                )}
                {!isRegistered && isFull && (
                  <span className="text-xs text-red-400">Мест нет</span>
                )}
                {!isRegistered && !isFull && spotsLeft <= 3 && (
                  <span className="text-xs text-yellow-400">
                    Осталось {spotsLeft} мест
                  </span>
                )}
                <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
