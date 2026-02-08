/**
 * Feed Algorithm for Moscow Padel Community
 *
 * Scores and ranks lobbies based on multiple factors:
 * - Skill level match (40% weight)
 * - Time proximity (25% weight)
 * - Location/metro proximity (20% weight)
 * - Lobby fill rate (10% weight)
 * - Creator reputation (5% weight)
 */

export interface FeedLobby {
  id: string;
  court_name: string;
  metro: string;
  address: string;
  start_time: string;
  min_level: number;
  max_level: number;
  required_players: number;
  participants_count: number;
  description?: string;
  creator_rating?: number;
  price_per_hour?: number;
}

export interface UserPreferences {
  skill_level: number;
  preferred_metro?: string[];
  preferred_times?: string[]; // 'morning', 'afternoon', 'evening', 'night'
  max_price?: number;
  friends_ids?: string[];
}

export interface ScoredLobby extends FeedLobby {
  score: number;
  matchReasons: string[];
}

// Metro stations grouped by line for proximity calculation
const METRO_LINES: Record<string, string[]> = {
  red: ['Сокольники', 'Красносельская', 'Комсомольская', 'Красные Ворота', 'Чистые пруды', 'Лубянка', 'Охотный Ряд', 'Библиотека им. Ленина', 'Кропоткинская', 'Парк культуры', 'Фрунзенская', 'Спортивная', 'Воробьёвы горы', 'Университет', 'Проспект Вернадского', 'Юго-Западная'],
  blue: ['Ховрино', 'Беломорская', 'Речной вокзал', 'Водный стадион', 'Войковская', 'Сокол', 'Аэропорт', 'Динамо', 'Белорусская', 'Маяковская', 'Тверская', 'Театральная', 'Новокузнецкая', 'Павелецкая', 'Автозаводская', 'Технопарк', 'Коломенская', 'Каширская', 'Кантемировская', 'Царицыно', 'Орехово', 'Домодедовская', 'Красногвардейская'],
  green: ['Пятницкое шоссе', 'Митино', 'Волоколамская', 'Мякинино', 'Строгино', 'Крылатское', 'Молодёжная', 'Кунцевская', 'Славянский бульвар', 'Парк Победы', 'Киевская', 'Смоленская', 'Арбатская', 'Площадь Революции', 'Курская', 'Бауманская', 'Электрозаводская', 'Семёновская', 'Партизанская', 'Измайловская', 'Первомайская', 'Щёлковская'],
  lightblue: ['Фили', 'Багратионовская', 'Филёвский парк', 'Пионерская', 'Кунцевская'],
  orange: ['Калужская', 'Беляево', 'Коньково', 'Тёплый Стан', 'Ясенево', 'Новоясеневская'],
  purple: ['Медведково', 'Бабушкинская', 'Свиблово', 'Ботанический сад', 'ВДНХ', 'Алексеевская', 'Рижская', 'Проспект Мира', 'Сухаревская', 'Тургеневская', 'Китай-город', 'Третьяковская', 'Октябрьская', 'Шаболовская', 'Ленинский проспект', 'Академическая', 'Профсоюзная', 'Новые Черёмушки', 'Калужская', 'Беляево', 'Коньково', 'Тёплый Стан', 'Ясенево', 'Новоясеневская', 'Битцевский парк'],
};

/**
 * Calculate skill level match score (0-100)
 * Perfect match = 100, outside range = 0
 */
function calculateSkillScore(userLevel: number, minLevel: number, maxLevel: number): number {
  // User is within range
  if (userLevel >= minLevel && userLevel <= maxLevel) {
    // Calculate how centered the user is in the range
    const rangeCenter = (minLevel + maxLevel) / 2;
    const rangeSize = maxLevel - minLevel;
    const distanceFromCenter = Math.abs(userLevel - rangeCenter);
    const normalizedDistance = rangeSize > 0 ? distanceFromCenter / (rangeSize / 2) : 0;

    // Closer to center = higher score
    return Math.round(100 - (normalizedDistance * 20));
  }

  // User is outside range - calculate penalty
  const distanceOutside = userLevel < minLevel
    ? minLevel - userLevel
    : userLevel - maxLevel;

  // Each 0.5 level outside = -25 points
  return Math.max(0, 50 - (distanceOutside * 50));
}

/**
 * Calculate time proximity score (0-100)
 * Games starting soon get higher scores, but not too soon
 */
function calculateTimeScore(startTime: string): number {
  const now = new Date();
  const gameTime = new Date(startTime);
  const hoursUntilGame = (gameTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  // Past games get 0
  if (hoursUntilGame < 0) return 0;

  // Games in 2-6 hours are ideal (100 points)
  if (hoursUntilGame >= 2 && hoursUntilGame <= 6) return 100;

  // Games in 1-2 hours (might be too soon to travel)
  if (hoursUntilGame >= 1 && hoursUntilGame < 2) return 80;

  // Games in less than 1 hour
  if (hoursUntilGame < 1) return 60;

  // Games 6-24 hours away
  if (hoursUntilGame <= 24) return Math.round(90 - ((hoursUntilGame - 6) * 2));

  // Games 1-3 days away
  if (hoursUntilGame <= 72) return Math.round(60 - ((hoursUntilGame - 24) / 2));

  // Games more than 3 days away
  return Math.max(20, Math.round(40 - (hoursUntilGame - 72) / 10));
}

/**
 * Calculate metro proximity score (0-100)
 */
function calculateLocationScore(lobbyMetro: string, preferredMetros?: string[]): number {
  if (!preferredMetros || preferredMetros.length === 0) return 70; // Neutral score

  // Direct match
  if (preferredMetros.includes(lobbyMetro)) return 100;

  // Check if on the same metro line
  for (const [, stations] of Object.entries(METRO_LINES)) {
    const lobbyIndex = stations.indexOf(lobbyMetro);
    if (lobbyIndex === -1) continue;

    for (const preferred of preferredMetros) {
      const preferredIndex = stations.indexOf(preferred);
      if (preferredIndex !== -1) {
        // Same line - score based on distance
        const stationDistance = Math.abs(lobbyIndex - preferredIndex);
        return Math.max(50, 90 - (stationDistance * 5));
      }
    }
  }

  // Different lines
  return 40;
}

/**
 * Calculate fill rate score (0-100)
 * Almost full lobbies are more appealing (social proof)
 */
function calculateFillScore(participants: number, required: number): number {
  const fillRate = participants / required;

  // 75% full is ideal (will likely happen)
  if (fillRate >= 0.5 && fillRate < 1) {
    return Math.round(70 + (fillRate * 40));
  }

  // Empty lobbies less appealing
  if (fillRate === 0) return 40;

  // Has some players
  if (fillRate < 0.5) return Math.round(50 + (fillRate * 40));

  // Full lobby
  return 30;
}

/**
 * Calculate time of day preference score (0-100)
 */
function calculateTimePreferenceScore(startTime: string, preferredTimes?: string[]): number {
  if (!preferredTimes || preferredTimes.length === 0) return 70;

  const hour = new Date(startTime).getHours();
  let timeOfDay: string;

  if (hour >= 6 && hour < 12) timeOfDay = 'morning';
  else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
  else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
  else timeOfDay = 'night';

  return preferredTimes.includes(timeOfDay) ? 100 : 50;
}

/**
 * Main feed algorithm - scores and sorts lobbies
 */
export function scoreLobby(lobby: FeedLobby, userPrefs: UserPreferences): ScoredLobby {
  const reasons: string[] = [];

  // Calculate individual scores
  const skillScore = calculateSkillScore(userPrefs.skill_level, lobby.min_level, lobby.max_level);
  const timeScore = calculateTimeScore(lobby.start_time);
  const locationScore = calculateLocationScore(lobby.metro, userPrefs.preferred_metro);
  const fillScore = calculateFillScore(lobby.participants_count, lobby.required_players);
  const timePreferenceScore = calculateTimePreferenceScore(lobby.start_time, userPrefs.preferred_times);

  // Add match reasons
  if (skillScore >= 80) reasons.push('Подходящий уровень');
  if (timeScore >= 80) reasons.push('Удобное время');
  if (locationScore >= 80) reasons.push('Близко к вам');
  if (fillScore >= 80) reasons.push('Почти собрано');

  // Price filter
  let priceBonus = 0;
  if (userPrefs.max_price && lobby.price_per_hour) {
    const pricePerPerson = lobby.price_per_hour / lobby.required_players;
    if (pricePerPerson <= userPrefs.max_price) {
      priceBonus = 10;
      reasons.push('В бюджете');
    }
  }

  // Weighted final score
  const weightedScore =
    (skillScore * 0.40) +      // 40% skill match
    (timeScore * 0.20) +        // 20% time proximity
    (locationScore * 0.15) +    // 15% location
    (fillScore * 0.10) +        // 10% fill rate
    (timePreferenceScore * 0.10) + // 10% time preference
    ((lobby.creator_rating || 4) * 5 * 0.05) + // 5% creator reputation
    priceBonus;

  return {
    ...lobby,
    score: Math.round(weightedScore),
    matchReasons: reasons,
  };
}

/**
 * Sort lobbies by score and apply feed rules
 */
export function generateFeed(lobbies: FeedLobby[], userPrefs: UserPreferences): ScoredLobby[] {
  // Score all lobbies
  const scored = lobbies.map(lobby => scoreLobby(lobby, userPrefs));

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Apply diversity rules - don't show too many from same court
  const diversified: ScoredLobby[] = [];
  const courtCount: Record<string, number> = {};

  for (const lobby of scored) {
    const count = courtCount[lobby.court_name] || 0;

    // Max 3 lobbies per court in top results
    if (count < 3 || diversified.length > 20) {
      diversified.push(lobby);
      courtCount[lobby.court_name] = count + 1;
    }
  }

  return diversified;
}

/**
 * Get feed sections for UI display
 */
export function getFeedSections(lobbies: ScoredLobby[]): {
  recommended: ScoredLobby[];
  startingSoon: ScoredLobby[];
  nearYou: ScoredLobby[];
  popular: ScoredLobby[];
} {
  const now = new Date();
  const in6Hours = new Date(now.getTime() + 6 * 60 * 60 * 1000);

  return {
    // Top scored lobbies
    recommended: lobbies.filter(l => l.score >= 70).slice(0, 6),

    // Starting in next 6 hours
    startingSoon: lobbies
      .filter(l => {
        const startTime = new Date(l.start_time);
        return startTime > now && startTime < in6Hours;
      })
      .slice(0, 4),

    // High location score
    nearYou: lobbies
      .filter(l => l.matchReasons.includes('Близко к вам'))
      .slice(0, 4),

    // Almost full (social proof)
    popular: lobbies
      .filter(l => l.participants_count >= l.required_players * 0.5)
      .sort((a, b) => b.participants_count - a.participants_count)
      .slice(0, 4),
  };
}

/**
 * Filter options for manual filtering
 */
export interface FeedFilters {
  minLevel?: number;
  maxLevel?: number;
  metro?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  maxPrice?: number;
  hasSpots?: boolean;
}

export function applyFilters(lobbies: ScoredLobby[], filters: FeedFilters): ScoredLobby[] {
  return lobbies.filter(lobby => {
    // Level filter
    if (filters.minLevel && lobby.max_level < filters.minLevel) return false;
    if (filters.maxLevel && lobby.min_level > filters.maxLevel) return false;

    // Metro filter
    if (filters.metro && filters.metro.length > 0) {
      if (!filters.metro.includes(lobby.metro)) return false;
    }

    // Date filter
    const startTime = new Date(lobby.start_time);
    if (filters.dateFrom && startTime < filters.dateFrom) return false;
    if (filters.dateTo && startTime > filters.dateTo) return false;

    // Price filter
    if (filters.maxPrice && lobby.price_per_hour) {
      const pricePerPerson = lobby.price_per_hour / lobby.required_players;
      if (pricePerPerson > filters.maxPrice) return false;
    }

    // Has spots filter
    if (filters.hasSpots && lobby.participants_count >= lobby.required_players) return false;

    return true;
  });
}
