"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StarRating, RatingSummary } from "@/components/ratings/StarRating";
import { ReviewForm } from "@/components/ratings/ReviewForm";
import type { CourtWithReviews } from "./page";
import {
  MapPin,
  Train,
  Banknote,
  ArrowLeft,
  Search,
  Star,
  Clock,
  Grid3X3,
  ChevronRight,
  Check,
  User,
  Phone,

  SortAsc,
} from "lucide-react";

// Mock reviews
const mockReviews = [
  {
    id: "r1",
    user: "Алексей М.",
    rating: 5,
    date: "2 дня назад",
    comment: "Отличный клуб! Корты в идеальном состоянии, персонал дружелюбный.",
    tags: ["Чисто", "Хороший персонал"],
  },
  {
    id: "r2",
    user: "Мария С.",
    rating: 4,
    date: "1 неделю назад",
    comment: "Хорошее место, но парковка бывает переполнена в выходные.",
    tags: ["Хорошее покрытие"],
  },
  {
    id: "r3",
    user: "Дмитрий К.",
    rating: 5,
    date: "2 недели назад",
    comment: "Лучшие корты в Москве! Всегда приятно играть здесь.",
    tags: ["Чисто", "Удобное расположение", "Хороший персонал"],
  },
];

interface CourtsClientProps {
  courts: CourtWithReviews[];
}

export function CourtsClient({ courts }: CourtsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "price" | "name">("rating");
  const [selectedCourt, setSelectedCourt] = useState<CourtWithReviews | null>(null);

  const filteredCourts = courts
    .filter(
      (court) =>
        court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        court.metro_station?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        court.address?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price")
        return (a.price_per_hour || 0) - (b.price_per_hour || 0);
      return a.name.localeCompare(b.name);
    });

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
          <div className="flex-1">
            <h1 className="font-display font-black text-lg">Корты Москвы</h1>
            <p className="text-[11px] text-white/30">{courts.length} площадок</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Search & Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
            <Input
              placeholder="Поиск по названию, метро..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() =>
              setSortBy(sortBy === "rating" ? "price" : sortBy === "price" ? "name" : "rating")
            }
          >
            <SortAsc className="h-4 w-4 mr-2" />
            {sortBy === "rating" && "По рейтингу"}
            {sortBy === "price" && "По цене"}
            {sortBy === "name" && "По названию"}
          </Button>
        </div>

        {/* Courts Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourts.map((court) => (
            <Card
              key={court.id}
              className="glass overflow-hidden group hover:border-lime/20 transition-all duration-500 cursor-pointer hover:shadow-[0_0_40px_#BFFF0008]"
              onClick={() => setSelectedCourt(court)}
            >
              {/* Court Image */}
              <div className="h-40 bg-gradient-to-br from-violet/15 via-surface to-lime/10 flex items-center justify-center relative overflow-hidden">
                <span className="text-6xl opacity-30 group-hover:scale-110 transition-transform duration-500">🎾</span>
                {/* Rating badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 glass rounded-full">
                  <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-display font-bold">{court.rating}</span>
                </div>
                {/* Courts count */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 glass rounded-full text-xs">
                  <Grid3X3 className="h-3 w-3 text-violet" />
                  {court.courtsCount} кортов
                </div>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="font-display text-lg text-white group-hover:text-lime transition-colors duration-300 flex items-center justify-between">
                  {court.name}
                  <ChevronRight className="h-5 w-5 text-white/15 group-hover:text-lime transition-colors" />
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 text-sm text-white/40">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-hot-pink" />
                  <span className="line-clamp-1">{court.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/40">
                  <Train className="h-4 w-4 shrink-0 text-violet" />
                  <span>м. {court.metro_station}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/40">
                  <Clock className="h-4 w-4 shrink-0 text-cyan" />
                  <span>{court.workingHours}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2 font-display font-bold text-lime">
                    <Banknote className="h-4 w-4" />
                    <span>
                      {court.price_per_hour?.toLocaleString("ru-RU")} ₽/час
                    </span>
                  </div>
                  <span className="text-[11px] text-white/25">
                    {court.reviewCount} отзывов
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourts.length === 0 && (
          <div className="text-center py-16">
            <MapPin className="h-12 w-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 font-display">Корты не найдены</p>
          </div>
        )}
      </main>

      {/* Court Detail Modal */}
      <Dialog
        open={!!selectedCourt}
        onOpenChange={(open) => !open && setSelectedCourt(null)}
      >
        {selectedCourt && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-surface border-white/[0.06] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">{selectedCourt.name}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Image */}
              <div className="h-48 bg-gradient-to-br from-violet/15 via-surface to-lime/10 rounded-2xl flex items-center justify-center">
                <span className="text-8xl opacity-30">🎾</span>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass rounded-2xl p-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-display text-2xl font-black">
                      {selectedCourt.rating}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/25">
                    {selectedCourt.reviewCount} отзывов
                  </p>
                </div>
                <div className="glass rounded-2xl p-4 text-center">
                  <p className="font-display text-2xl font-black text-lime">
                    {selectedCourt.price_per_hour?.toLocaleString("ru-RU")} ₽
                  </p>
                  <p className="text-[11px] text-white/25">за час</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="h-5 w-5 text-hot-pink shrink-0" />
                  <div>
                    <p className="text-white/35 text-xs">Адрес</p>
                    <p className="font-medium">{selectedCourt.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Train className="h-5 w-5 text-violet shrink-0" />
                  <div>
                    <p className="text-white/35 text-xs">Метро</p>
                    <p className="font-medium">{selectedCourt.metro_station}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Clock className="h-5 w-5 text-cyan shrink-0" />
                  <div>
                    <p className="text-white/35 text-xs">Режим работы</p>
                    <p className="font-medium">{selectedCourt.workingHours}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Grid3X3 className="h-5 w-5 text-lime shrink-0" />
                  <div>
                    <p className="text-white/35 text-xs">Количество кортов</p>
                    <p className="font-medium">{selectedCourt.courtsCount}</p>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-3">
                <h3 className="font-display font-bold">Удобства</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCourt.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-full text-sm"
                    >
                      <Check className="h-3.5 w-3.5 text-lime" />
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rating Summary */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold">Отзывы</h3>
                  <ReviewForm
                    type="court"
                    targetId={selectedCourt.id}
                    targetName={selectedCourt.name}
                  />
                </div>
                <RatingSummary
                  average={selectedCourt.rating}
                  total={selectedCourt.reviewCount}
                  breakdown={{ 5: 35, 4: 8, 3: 3, 2: 1, 1: 0 }}
                />
              </div>

              {/* Reviews */}
              <div className="space-y-4">
                {mockReviews.map((review) => (
                  <div
                    key={review.id}
                    className="glass rounded-2xl p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-violet/20 to-lime/20 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white/40" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{review.user}</p>
                          <p className="text-[11px] text-white/25">{review.date}</p>
                        </div>
                      </div>
                      <StarRating value={review.rating} readonly size="sm" />
                    </div>
                    <p className="text-sm text-white/40">{review.comment}</p>
                    {review.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {review.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-0.5 bg-lime/10 text-lime text-xs rounded-full border border-lime/15"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.open(`tel:+74951234567`)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Позвонить
                </Button>
                <Link href="/dashboard" className="flex-1">
                  <Button className="w-full font-display font-bold">
                    Найти игру
                  </Button>
                </Link>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 glass-strong lg:hidden">
        <div className="flex items-center justify-around py-3">
          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-1 text-white/30"
          >
            <span className="text-xl">🎮</span>
            <span className="text-[9px] font-display uppercase tracking-[0.15em] font-bold">Лобби</span>
          </Link>
          <Link
            href="/courts"
            className="flex flex-col items-center gap-1 text-lime"
          >
            <MapPin className="h-5 w-5" />
            <span className="text-[9px] font-display uppercase tracking-[0.15em] font-bold">Корты</span>
          </Link>
          <Link
            href="/profile"
            className="flex flex-col items-center gap-1 text-white/30"
          >
            <span className="text-xl">👤</span>
            <span className="text-[9px] font-display uppercase tracking-[0.15em] font-bold">
              Профиль
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
