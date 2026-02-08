"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { LevelBadge } from "@/components/lobby/LevelBadge";
import {
  useFriendsStore,
  formatLastSeen,
  getStatusColor,
  getStatusText,
  type Friend,
} from "@/store/friends";
import { toast } from "sonner";
import {
  ArrowLeft,
  Search,
  Users,
  UserPlus,
  UserMinus,
  Check,
  X,
  MessageCircle,
  Gamepad2,
  Clock,
  User,
  MapPin,
} from "lucide-react";

type Tab = "friends" | "requests" | "find";

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("friends");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    friends,
    pendingRequests,
    removeFriend,
    acceptRequest,
    rejectRequest,
    sendRequest,
    hasSentRequest,
  } = useFriendsStore();

  const onlineFriends = friends.filter((f) => f.status === "online");
  const inGameFriends = friends.filter((f) => f.status === "in_game");
  const offlineFriends = friends.filter((f) => f.status === "offline");

  // Mock search results
  const searchResults = searchQuery.length >= 2
    ? [
      { id: "s1", name: "Андрей Петров", skill_level: 4.0, metro: "Динамо" },
      { id: "s2", name: "Ольга Иванова", skill_level: 3.5, metro: "Сокол" },
      { id: "s3", name: "Павел Сидоров", skill_level: 3.0, metro: "Фили" },
    ].filter((u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  const handleSendRequest = (userId: string, userName: string) => {
    sendRequest(userId);
    toast.success(`Запрос отправлен ${userName}`);
  };

  const handleAcceptRequest = (requestId: string) => {
    acceptRequest(requestId);
    toast.success("Запрос принят!");
  };

  const handleRejectRequest = (requestId: string) => {
    rejectRequest(requestId);
    toast("Запрос отклонён");
  };

  const handleRemoveFriend = (friendId: string, friendName: string) => {
    if (confirm(`Удалить ${friendName} из друзей?`)) {
      removeFriend(friendId);
      toast("Друг удалён");
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
            <h1 className="font-black text-lg">Друзья</h1>
            <p className="text-xs text-zinc-500">
              {friends.length} друзей • {onlineFriends.length} онлайн
            </p>
          </div>
          {pendingRequests.length > 0 && (
            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full">
              {pendingRequests.length} заявок
            </span>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("friends")}
            className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === "friends"
                ? "bg-emerald-500 text-black"
                : "bg-zinc-900 text-zinc-400 hover:text-white"
              }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            Друзья ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-colors relative ${activeTab === "requests"
                ? "bg-emerald-500 text-black"
                : "bg-zinc-900 text-zinc-400 hover:text-white"
              }`}
          >
            <UserPlus className="h-4 w-4 inline mr-2" />
            Заявки
            {pendingRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {pendingRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("find")}
            className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === "find"
                ? "bg-emerald-500 text-black"
                : "bg-zinc-900 text-zinc-400 hover:text-white"
              }`}
          >
            <Search className="h-4 w-4 inline mr-2" />
            Найти
          </button>
        </div>

        {/* Friends List */}
        {activeTab === "friends" && (
          <div className="space-y-6">
            {/* Online Friends */}
            {onlineFriends.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs text-zinc-500 uppercase tracking-wider">
                  Онлайн — {onlineFriends.length}
                </h3>
                {onlineFriends.map((friend) => (
                  <FriendCard
                    key={friend.id}
                    friend={friend}
                    onRemove={() => handleRemoveFriend(friend.id, friend.name)}
                  />
                ))}
              </div>
            )}

            {/* In Game */}
            {inGameFriends.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs text-zinc-500 uppercase tracking-wider">
                  В игре — {inGameFriends.length}
                </h3>
                {inGameFriends.map((friend) => (
                  <FriendCard
                    key={friend.id}
                    friend={friend}
                    onRemove={() => handleRemoveFriend(friend.id, friend.name)}
                  />
                ))}
              </div>
            )}

            {/* Offline */}
            {offlineFriends.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs text-zinc-500 uppercase tracking-wider">
                  Оффлайн — {offlineFriends.length}
                </h3>
                {offlineFriends.map((friend) => (
                  <FriendCard
                    key={friend.id}
                    friend={friend}
                    onRemove={() => handleRemoveFriend(friend.id, friend.name)}
                  />
                ))}
              </div>
            )}

            {friends.length === 0 && (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-500">У вас пока нет друзей</p>
                  <Button
                    className="mt-4"
                    onClick={() => setActiveTab("find")}
                  >
                    Найти игроков
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Requests */}
        {activeTab === "requests" && (
          <div className="space-y-4">
            {pendingRequests.length === 0 ? (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="py-12 text-center">
                  <UserPlus className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-500">Нет входящих заявок</p>
                </CardContent>
              </Card>
            ) : (
              pendingRequests.map((request) => (
                <Card
                  key={request.id}
                  className="bg-zinc-900 border-zinc-800"
                >
                  <CardContent className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-emerald-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold">{request.from.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <LevelBadge
                            level={request.from.skill_level}
                            size="sm"
                          />
                          <span className="text-xs text-zinc-500">
                            {formatLastSeen(request.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-9 w-9 border-red-500/50 text-red-400 hover:bg-red-500/10"
                          onClick={() => handleRejectRequest(request.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          className="h-9 w-9 bg-emerald-500 hover:bg-emerald-600 text-black"
                          onClick={() => handleAcceptRequest(request.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Find */}
        {activeTab === "find" && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Поиск по имени..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-zinc-900 border-zinc-800"
              />
            </div>

            {searchQuery.length < 2 ? (
              <div className="text-center py-12 text-zinc-500">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Введите минимум 2 символа для поиска</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-12 text-zinc-500">
                <p>Ничего не найдено</p>
              </div>
            ) : (
              searchResults.map((user) => (
                <Card key={user.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-zinc-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold">{user.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <LevelBadge level={user.skill_level} size="sm" />
                          <span className="text-xs text-zinc-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {user.metro}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        disabled={hasSentRequest(user.id)}
                        onClick={() => handleSendRequest(user.id, user.name)}
                        className={
                          hasSentRequest(user.id)
                            ? "bg-zinc-700"
                            : "bg-emerald-500 hover:bg-emerald-600 text-black"
                        }
                      >
                        {hasSentRequest(user.id) ? (
                          <>
                            <Clock className="h-4 w-4 mr-1" />
                            Отправлено
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-1" />
                            Добавить
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </main>

      {/* Mobile Nav */}
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
            href="/friends"
            className="flex flex-col items-center gap-1 text-emerald-400"
          >
            <Users className="h-5 w-5" />
            <span className="text-[10px] uppercase tracking-wider">Друзья</span>
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

// Friend card component
function FriendCard({
  friend,
  onRemove,
}: {
  friend: Friend;
  onRemove: () => void;
}) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="py-3">
        <div className="flex items-center gap-4">
          {/* Avatar with status */}
          <div className="relative">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
              {friend.image ? (
                <Image
                  src={friend.image}
                  alt=""
                  width={48}
                  height={48}
                  className="w-full h-full rounded-full"
                />
              ) : (
                <User className="h-6 w-6 text-emerald-500" />
              )}
            </div>
            <span
              className={`absolute bottom-0 right-0 w-3.5 h-3.5 ${getStatusColor(
                friend.status
              )} rounded-full border-2 border-zinc-900`}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-bold truncate">{friend.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <LevelBadge level={friend.skill_level} size="sm" />
              <span className="text-xs text-zinc-500">
                {friend.status === "offline"
                  ? formatLastSeen(friend.lastSeen)
                  : getStatusText(friend.status)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-1">
            {friend.status === "online" && (
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 text-zinc-500 hover:text-emerald-400"
              >
                <Gamepad2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 text-zinc-500 hover:text-white"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 text-zinc-500 hover:text-red-400"
              onClick={onRemove}
            >
              <UserMinus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
