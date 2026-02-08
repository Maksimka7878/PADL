"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LevelBadge } from "@/components/lobby/LevelBadge";
import { useFeedStore } from "@/store/feed";
import { Filter, X, RotateCcw } from "lucide-react";

const METRO_STATIONS = [
  "Фили", "Кунцевская", "Парк Победы", "Киевская", "Смоленская",
  "Арбатская", "Динамо", "Сокол", "Аэропорт", "ВДНХ",
  "Спортивная", "Лужники", "Воробьёвы горы", "Университет",
];

const TIME_OPTIONS = [
  { value: "morning", label: "Утро (6-12)" },
  { value: "afternoon", label: "День (12-17)" },
  { value: "evening", label: "Вечер (17-21)" },
  { value: "night", label: "Ночь (21-6)" },
];

export function FeedFilters() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    filters,
    setFilters,
    resetFilters,
    preferredMetros,
    setPreferredMetros,
    preferredTimes,
    setPreferredTimes,
    maxPrice,
    setMaxPrice,
  } = useFeedStore();

  const [levelRange, setLevelRange] = useState<[number, number]>([
    filters.minLevel || 1.0,
    filters.maxLevel || 7.0,
  ]);

  const activeFiltersCount = [
    filters.minLevel !== undefined || filters.maxLevel !== undefined,
    filters.metro && filters.metro.length > 0,
    filters.maxPrice !== undefined,
    preferredTimes.length > 0,
  ].filter(Boolean).length;

  const handleApply = () => {
    setFilters({
      minLevel: levelRange[0],
      maxLevel: levelRange[1],
      metro: preferredMetros.length > 0 ? preferredMetros : undefined,
      maxPrice: maxPrice || undefined,
    });
    setIsOpen(false);
  };

  const handleReset = () => {
    setLevelRange([1.0, 7.0]);
    setPreferredMetros([]);
    setPreferredTimes([]);
    setMaxPrice(null);
    resetFilters();
  };

  const toggleMetro = (metro: string) => {
    if (preferredMetros.includes(metro)) {
      setPreferredMetros(preferredMetros.filter((m) => m !== metro));
    } else {
      setPreferredMetros([...preferredMetros, metro]);
    }
  };

  const toggleTime = (time: string) => {
    if (preferredTimes.includes(time)) {
      setPreferredTimes(preferredTimes.filter((t) => t !== time));
    } else {
      setPreferredTimes([...preferredTimes, time]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="relative rounded-xl border-white/10 bg-white/[0.04] hover:bg-white/[0.08]">
          <Filter className="h-4 w-4 mr-2 text-violet" />
          <span className="font-display text-xs">Фильтры</span>
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-lime text-black text-[10px] rounded-full flex items-center justify-center font-display font-bold shadow-[0_0_10px_#BFFF0040]">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-surface border-white/[0.08] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between font-display">
            <span className="text-lg font-black">Фильтры</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-white/40 hover:text-white rounded-xl"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Сбросить
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Level Range */}
          <div className="space-y-4">
            <Label className="text-white/40 text-xs tracking-wider uppercase">Уровень игроков</Label>
            <div className="flex items-center justify-center gap-4 py-2">
              <LevelBadge level={levelRange[0]} size="lg" />
              <span className="text-white/15 font-display">—</span>
              <LevelBadge level={levelRange[1]} size="lg" />
            </div>
            <Slider
              min={1.0}
              max={7.0}
              step={0.5}
              value={levelRange}
              onValueChange={(v) => setLevelRange(v as [number, number])}
            />
            <div className="flex justify-between text-[10px] text-white/20 uppercase tracking-[0.15em]">
              <span>Новичок</span>
              <span>Про</span>
            </div>
          </div>

          {/* Metro Stations */}
          <div className="space-y-3">
            <Label className="text-white/40 text-xs tracking-wider uppercase">Станции метро</Label>
            <div className="flex flex-wrap gap-2">
              {METRO_STATIONS.map((metro) => (
                <button
                  key={metro}
                  onClick={() => toggleMetro(metro)}
                  className={`px-3 py-1.5 rounded-full text-xs font-display font-medium transition-all duration-200 border ${
                    preferredMetros.includes(metro)
                      ? "bg-lime/20 text-lime border-lime/30 shadow-[0_0_10px_#BFFF0020]"
                      : "bg-white/[0.04] text-white/40 border-white/[0.06] hover:bg-white/[0.08] hover:text-white/60"
                  }`}
                >
                  {metro}
                </button>
              ))}
            </div>
          </div>

          {/* Time Preferences */}
          <div className="space-y-3">
            <Label className="text-white/40 text-xs tracking-wider uppercase">Время игры</Label>
            <div className="grid grid-cols-2 gap-2">
              {TIME_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleTime(option.value)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-display font-medium transition-all duration-200 border ${
                    preferredTimes.includes(option.value)
                      ? "bg-violet/20 text-violet border-violet/30 shadow-[0_0_10px_#8B5CF620]"
                      : "bg-white/[0.04] text-white/40 border-white/[0.06] hover:bg-white/[0.08] hover:text-white/60"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price */}
          <div className="space-y-3">
            <Label className="text-white/40 text-xs tracking-wider uppercase">Максимальная цена за игру</Label>
            <Select
              value={maxPrice?.toString() || "any"}
              onValueChange={(v) => setMaxPrice(v === "any" ? null : parseInt(v))}
            >
              <SelectTrigger className="bg-white/[0.04] border-white/10 rounded-xl">
                <SelectValue placeholder="Любая" />
              </SelectTrigger>
              <SelectContent className="bg-surface-2 border-white/10 rounded-xl">
                <SelectItem value="any">Любая</SelectItem>
                <SelectItem value="500">до 500 ₽</SelectItem>
                <SelectItem value="800">до 800 ₽</SelectItem>
                <SelectItem value="1000">до 1000 ₽</SelectItem>
                <SelectItem value="1500">до 1500 ₽</SelectItem>
                <SelectItem value="2000">до 2000 ₽</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-xl border-white/10"
            onClick={() => setIsOpen(false)}
          >
            Отмена
          </Button>
          <Button
            className="flex-1 font-display font-bold rounded-xl"
            onClick={handleApply}
          >
            Применить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Quick filter chips for inline display
export function QuickFilters() {
  const { filters, setFilters, preferredMetros, setPreferredMetros } = useFeedStore();

  const removeMetroFilter = (metro: string) => {
    const newMetros = preferredMetros.filter((m) => m !== metro);
    setPreferredMetros(newMetros);
    setFilters({ metro: newMetros.length > 0 ? newMetros : undefined });
  };

  const removeLevelFilter = () => {
    setFilters({ minLevel: undefined, maxLevel: undefined });
  };

  const removePriceFilter = () => {
    setFilters({ maxPrice: undefined });
  };

  const hasFilters =
    (filters.minLevel !== undefined && filters.minLevel > 1) ||
    (filters.maxLevel !== undefined && filters.maxLevel < 7) ||
    (filters.metro && filters.metro.length > 0) ||
    filters.maxPrice !== undefined;

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {/* Level filter chip */}
      {(filters.minLevel !== undefined || filters.maxLevel !== undefined) &&
        (filters.minLevel !== 1 || filters.maxLevel !== 7) && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-lime/10 text-lime rounded-full text-xs font-display border border-lime/15">
            Уровень: {filters.minLevel || 1.0} - {filters.maxLevel || 7.0}
            <button onClick={removeLevelFilter} className="hover:text-hot-pink transition-colors">
              <X className="h-3 w-3" />
            </button>
          </span>
        )}

      {/* Metro filter chips */}
      {filters.metro?.map((metro) => (
        <span
          key={metro}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-violet/10 text-violet rounded-full text-xs font-display border border-violet/15"
        >
          {metro}
          <button onClick={() => removeMetroFilter(metro)} className="hover:text-hot-pink transition-colors">
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      {/* Price filter chip */}
      {filters.maxPrice !== undefined && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cyan/10 text-cyan rounded-full text-xs font-display border border-cyan/15">
          до {filters.maxPrice} ₽
          <button onClick={removePriceFilter} className="hover:text-hot-pink transition-colors">
            <X className="h-3 w-3" />
          </button>
        </span>
      )}
    </div>
  );
}
