"use client";

import { useMemo, useRef, useCallback } from "react";
import { FeedCard, FeedCardCompact } from "./FeedCard";
import { FeedFilters, QuickFilters } from "./FeedFilters";
import { SearchBar } from "./SearchBar";
import { useFeedStore } from "@/store/feed";
import {
  generateFeed,
  getFeedSections,
  applyFilters,
  type FeedLobby,
  type UserPreferences,
} from "@/lib/feed-algorithm";
import { Sparkles, Clock, MapPin, Zap, Star, Compass, ChevronRight } from "lucide-react";

interface DashboardFeedProps {
  lobbies: FeedLobby[];
  userPrefs: UserPreferences;
  onJoin?: (id: string) => Promise<void>;
}

interface SectionConfig {
  key: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accentColor: string;
}

const SECTIONS: SectionConfig[] = [
  {
    key: "recommended",
    title: "Рекомендации",
    subtitle: "Подобрано под ваш уровень и предпочтения",
    icon: <Sparkles className="h-4 w-4" />,
    accentColor: "text-lime",
  },
  {
    key: "startingSoon",
    title: "Скоро начинаются",
    subtitle: "Не упустите ближайшие игры",
    icon: <Clock className="h-4 w-4" />,
    accentColor: "text-hot-pink",
  },
  {
    key: "nearYou",
    title: "Рядом с вами",
    subtitle: "Удобные локации для быстрой игры",
    icon: <MapPin className="h-4 w-4" />,
    accentColor: "text-violet",
  },
  {
    key: "popular",
    title: "Популярные",
    subtitle: "Самые востребованные лобби",
    icon: <Zap className="h-4 w-4" />,
    accentColor: "text-hot-pink",
  },
  {
    key: "newLobbies",
    title: "Новые",
    subtitle: "Только что созданные лобби",
    icon: <Star className="h-4 w-4" />,
    accentColor: "text-cyan",
  },
  {
    key: "serendipity",
    title: "Попробуйте новое",
    subtitle: "Расширьте горизонты — неожиданные варианты",
    icon: <Compass className="h-4 w-4" />,
    accentColor: "text-cyan",
  },
];

export function DashboardFeed({ lobbies, userPrefs, onJoin }: DashboardFeedProps) {
  const { filters, searchQuery, engagement, activeSection, setActiveSection } = useFeedStore();
  const feedContainerRef = useRef<HTMLDivElement>(null);

  // Generate scored & sorted feed
  const scoredFeed = useMemo(() => {
    return generateFeed(lobbies, userPrefs, engagement);
  }, [lobbies, userPrefs, engagement]);

  // Apply manual filters
  const filteredFeed = useMemo(() => {
    let result = applyFilters(scoredFeed, filters);

    // Apply search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.court_name.toLowerCase().includes(q) ||
          l.metro.toLowerCase().includes(q) ||
          l.address.toLowerCase().includes(q) ||
          (l.description && l.description.toLowerCase().includes(q))
      );
    }

    return result;
  }, [scoredFeed, filters, searchQuery]);

  // Group into sections
  const sections = useMemo(() => {
    return getFeedSections(filteredFeed);
  }, [filteredFeed]);

  const scrollToSection = useCallback((key: string) => {
    setActiveSection(key);
    const el = document.getElementById(`feed-section-${key}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [setActiveSection]);

  // Check if we have any results
  const hasResults = filteredFeed.length > 0;
  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="space-y-6" ref={feedContainerRef}>
      {/* Search + Filters bar */}
      <div className="space-y-3">
        <div className="flex gap-3 items-start">
          <div className="flex-1">
            <SearchBar />
          </div>
          <FeedFilters />
        </div>
        <QuickFilters />
      </div>

      {/* Section navigation pills */}
      {!isSearching && hasResults && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
          {SECTIONS.map((section) => {
            const sectionData = sections[section.key as keyof typeof sections];
            if (!sectionData || sectionData.length === 0) return null;

            const isActive = activeSection === section.key;

            return (
              <button
                key={section.key}
                onClick={() => scrollToSection(section.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-display font-medium whitespace-nowrap transition-all duration-300 border shrink-0 ${
                  isActive
                    ? "bg-lime/20 text-lime border-lime/30 shadow-[0_0_10px_#BFFF0020]"
                    : "bg-white/[0.04] text-white/40 border-white/[0.06] hover:bg-white/[0.08] hover:text-white/60"
                }`}
              >
                <span className={section.accentColor}>{section.icon}</span>
                {section.title}
                <span className="text-[10px] opacity-50">
                  {sectionData.length}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Feed content */}
      {isSearching ? (
        // Search results — flat list
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/40 font-display">
              Найдено <span className="text-lime font-bold">{filteredFeed.length}</span> результатов
            </p>
          </div>
          {filteredFeed.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {filteredFeed.map((lobby) => (
                <FeedCard key={lobby.id} lobby={lobby} onJoin={onJoin} />
              ))}
            </div>
          ) : (
            <EmptyState message="Ничего не найдено" />
          )}
        </div>
      ) : hasResults ? (
        // Sectioned feed
        <div className="space-y-10">
          {SECTIONS.map((section) => {
            const sectionData = sections[section.key as keyof typeof sections];
            if (!sectionData || sectionData.length === 0) return null;

            return (
              <div key={section.key} id={`feed-section-${section.key}`} className="scroll-mt-20">
                {/* Section header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center border border-white/[0.06] ${section.accentColor}`}>
                      {section.icon}
                    </div>
                    <div>
                      <h3 className="font-display font-black text-base">{section.title}</h3>
                      <p className="text-[11px] text-white/25">{section.subtitle}</p>
                    </div>
                  </div>
                  {sectionData.length > 4 && (
                    <button className="flex items-center gap-1 text-xs text-white/30 hover:text-lime transition-colors font-display">
                      Все <ChevronRight className="h-3 w-3" />
                    </button>
                  )}
                </div>

                {/* Section content */}
                {section.key === "startingSoon" ? (
                  // Compact horizontal cards for starting soon
                  <div className="space-y-2">
                    {sectionData.map((lobby) => (
                      <FeedCardCompact key={lobby.id} lobby={lobby} />
                    ))}
                  </div>
                ) : (
                  // Grid cards for other sections
                  <div className="grid sm:grid-cols-2 gap-4">
                    {sectionData.map((lobby) => (
                      <FeedCard key={lobby.id} lobby={lobby} onJoin={onJoin} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState message="Пока нет активных лобби" />
      )}

      {/* Algorithm transparency */}
      {hasResults && !isSearching && (
        <div className="glass rounded-2xl p-4 border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-lime" />
            <span className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-display font-bold">
              Как работает рекомендация
            </span>
          </div>
          <p className="text-[11px] text-white/20 leading-relaxed">
            Мы учитываем ваш уровень игры, предпочтения по времени и локации,
            историю ваших игр, и заполненность лобби для формирования персональной ленты.
            Чем больше играете — тем точнее рекомендации.
          </p>
        </div>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-16 glass rounded-2xl gradient-border">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.04] flex items-center justify-center border border-white/[0.06]">
        <span className="text-3xl">🎾</span>
      </div>
      <p className="text-white/40 font-display font-bold">{message}</p>
      <p className="text-sm text-white/20 mt-2">Создайте первое лобби!</p>
    </div>
  );
}
