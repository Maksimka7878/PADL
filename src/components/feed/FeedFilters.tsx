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
        <Button variant="outline" size="sm" className="relative border-zinc-700">
          <Filter className="h-4 w-4 mr-2" />
          Фильтры
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-black text-xs rounded-full flex items-center justify-center font-bold">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-zinc-950 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Фильтры</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-zinc-500 hover:text-white"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Сбросить
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Level Range */}
          <div className="space-y-4">
            <Label className="text-zinc-400">Уровень игроков</Label>
            <div className="flex items-center justify-center gap-4 py-2">
              <LevelBadge level={levelRange[0]} size="lg" />
              <span className="text-zinc-600">—</span>
              <LevelBadge level={levelRange[1]} size="lg" />
            </div>
            <Slider
              min={1.0}
              max={7.0}
              step={0.5}
              value={levelRange}
              onValueChange={(v) => setLevelRange(v as [number, number])}
            />
            <div className="flex justify-between text-xs text-zinc-600">
              <span>Новичок</span>
              <span>Про</span>
            </div>
          </div>

          {/* Metro Stations */}
          <div className="space-y-3">
            <Label className="text-zinc-400">Станции метро</Label>
            <div className="flex flex-wrap gap-2">
              {METRO_STATIONS.map((metro) => (
                <button
                  key={metro}
                  onClick={() => toggleMetro(metro)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    preferredMetros.includes(metro)
                      ? "bg-emerald-500 text-black"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  {metro}
                </button>
              ))}
            </div>
          </div>

          {/* Time Preferences */}
          <div className="space-y-3">
            <Label className="text-zinc-400">Время игры</Label>
            <div className="grid grid-cols-2 gap-2">
              {TIME_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleTime(option.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    preferredTimes.includes(option.value)
                      ? "bg-emerald-500 text-black"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price */}
          <div className="space-y-3">
            <Label className="text-zinc-400">Максимальная цена за игру</Label>
            <Select
              value={maxPrice?.toString() || "any"}
              onValueChange={(v) => setMaxPrice(v === "any" ? null : parseInt(v))}
            >
              <SelectTrigger className="bg-zinc-900 border-zinc-800">
                <SelectValue placeholder="Любая" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-zinc-800">
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
            className="flex-1 border-zinc-700"
            onClick={() => setIsOpen(false)}
          >
            Отмена
          </Button>
          <Button
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black font-bold"
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
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-800 rounded-full text-xs">
            Уровень: {filters.minLevel || 1.0} - {filters.maxLevel || 7.0}
            <button onClick={removeLevelFilter} className="hover:text-red-400">
              <X className="h-3 w-3" />
            </button>
          </span>
        )}

      {/* Metro filter chips */}
      {filters.metro?.map((metro) => (
        <span
          key={metro}
          className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-800 rounded-full text-xs"
        >
          {metro}
          <button onClick={() => removeMetroFilter(metro)} className="hover:text-red-400">
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      {/* Price filter chip */}
      {filters.maxPrice !== undefined && (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-800 rounded-full text-xs">
          до {filters.maxPrice} ₽
          <button onClick={removePriceFilter} className="hover:text-red-400">
            <X className="h-3 w-3" />
          </button>
        </span>
      )}
    </div>
  );
}
