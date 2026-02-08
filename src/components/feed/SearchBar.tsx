"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { useFeedStore } from "@/store/feed";
import { Search, X, Clock, MapPin } from "lucide-react";

const RECENT_SEARCHES_KEY = "padel-recent-searches";
const MAX_RECENT = 5;

interface SearchBarProps {
  placeholder?: string;
}

export function SearchBar({ placeholder = "Поиск по кортам, метро..." }: SearchBarProps) {
  const { searchQuery, setSearchQuery } = useFeedStore();
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      // eslint-disable-next-line
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  const saveSearch = (query: string) => {
    if (!query.trim()) return;

    const updated = [
      query,
      ...recentSearches.filter((s) => s !== query),
    ].slice(0, MAX_RECENT);

    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveSearch(searchQuery);
      inputRef.current?.blur();
    }
  };

  const handleRecentClick = (query: string) => {
    setSearchQuery(query);
    saveSearch(query);
    setIsFocused(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    inputRef.current?.focus();
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            ref={inputRef}
            type="search"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className="pl-10 pr-10 bg-zinc-900 border-zinc-800 focus:border-emerald-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown with recent searches */}
      {isFocused && recentSearches.length > 0 && !searchQuery && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800">
            <span className="text-xs text-zinc-500 uppercase tracking-wider">
              Недавние поиски
            </span>
            <button
              onClick={clearRecent}
              className="text-xs text-zinc-500 hover:text-red-400"
            >
              Очистить
            </button>
          </div>
          <div className="py-1">
            {recentSearches.map((query, i) => (
              <button
                key={i}
                onClick={() => handleRecentClick(query)}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-zinc-800 transition-colors"
              >
                <Clock className="h-4 w-4 text-zinc-600" />
                <span className="text-sm">{query}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick suggestions */}
      {isFocused && searchQuery.length > 0 && searchQuery.length < 3 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden">
          <div className="px-3 py-2 text-xs text-zinc-500">
            Популярные корты:
          </div>
          <div className="py-1">
            {["Padel Moscow Club", "World Class", "Padel Hall"].map((court) => (
              <button
                key={court}
                onClick={() => handleRecentClick(court)}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-zinc-800 transition-colors"
              >
                <MapPin className="h-4 w-4 text-emerald-500" />
                <span className="text-sm">{court}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
