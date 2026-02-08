/**
 * Recommendation Feed Algorithm for Moscow Padel Community
 *
 * Multi-signal scoring system:
 * - Skill level match (35% weight) — core matching
 * - Time proximity (20% weight) — urgency signal
 * - Location/metro proximity (15% weight) — convenience
 * - Engagement signals (10% weight) — collaborative filtering
 * - Lobby fill rate (8% weight) — social proof
 * - Time of day preference (7% weight) — behavioral
 * - Creator reputation (5% weight) — quality signal
 *
 * Enhanced with:
 * - Collaborative filtering (users with similar preferences)
 * - Implicit engagement tracking (views, joins, favorites)
 * - Time-decay for freshness
 * - Diversity injection to avoid filter bubbles
 * - Serendipity factor for exploration
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
  created_at?: string;
}

export interface UserPreferences {
  skill_level: number;
  preferred_metro?: string[];
  preferred_times?: string[]; // 'morning', 'afternoon', 'evening', 'night'
  max_price?: number;
  friends_ids?: string[];
}

/** Implicit engagement signals collected from user behavior */
export interface EngagementSignals {
  /** Court IDs the user has joined before */
  joinedCourts: string[];
  /** Court IDs the user has viewed (clicked into) */
  viewedCourts: string[];
  /** Court IDs the user has favorited */
  favoritedCourts: string[];
  /** Levels the user has played at (historical) */
  playedLevels: number[];
  /** Metro stations the user has played at */
  playedMetros: string[];
  /** Times of day user typically joins games */
  joinTimePatterns: string[];
  /** Court names user has dismissed / scrolled past */
  dismissedCourts: string[];
  /** Number of total joins (activity level) */
  totalJoins: number;
}

export interface ScoredLobby extends FeedLobby {
  score: number;
  matchReasons: string[];
  /** Why this was recommended (for transparency) */
  recommendationType: 'personalized' | 'popular' | 'serendipity' | 'friends' | 'new';
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

// ─────────────────────────────────────
// SCORING FUNCTIONS
// ─────────────────────────────────────

/** Skill level match score (0-100) */
function calculateSkillScore(userLevel: number, minLevel: number, maxLevel: number): number {
  if (userLevel >= minLevel && userLevel <= maxLevel) {
    const rangeCenter = (minLevel + maxLevel) / 2;
    const rangeSize = maxLevel - minLevel;
    const distanceFromCenter = Math.abs(userLevel - rangeCenter);
    const normalizedDistance = rangeSize > 0 ? distanceFromCenter / (rangeSize / 2) : 0;
    return Math.round(100 - (normalizedDistance * 20));
  }
  const distanceOutside = userLevel < minLevel
    ? minLevel - userLevel
    : userLevel - maxLevel;
  return Math.max(0, 50 - (distanceOutside * 50));
}

/** Time proximity score (0-100) */
function calculateTimeScore(startTime: string): number {
  const now = new Date();
  const gameTime = new Date(startTime);
  const hoursUntilGame = (gameTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntilGame < 0) return 0;
  if (hoursUntilGame >= 2 && hoursUntilGame <= 6) return 100;
  if (hoursUntilGame >= 1 && hoursUntilGame < 2) return 80;
  if (hoursUntilGame < 1) return 60;
  if (hoursUntilGame <= 24) return Math.round(90 - ((hoursUntilGame - 6) * 2));
  if (hoursUntilGame <= 72) return Math.round(60 - ((hoursUntilGame - 24) / 2));
  return Math.max(20, Math.round(40 - (hoursUntilGame - 72) / 10));
}

/** Metro proximity score (0-100) */
function calculateLocationScore(lobbyMetro: string, preferredMetros?: string[]): number {
  if (!preferredMetros || preferredMetros.length === 0) return 70;

  if (preferredMetros.includes(lobbyMetro)) return 100;

  for (const [, stations] of Object.entries(METRO_LINES)) {
    const lobbyIndex = stations.indexOf(lobbyMetro);
    if (lobbyIndex === -1) continue;
    for (const preferred of preferredMetros) {
      const preferredIndex = stations.indexOf(preferred);
      if (preferredIndex !== -1) {
        const stationDistance = Math.abs(lobbyIndex - preferredIndex);
        return Math.max(50, 90 - (stationDistance * 5));
      }
    }
  }
  return 40;
}

/** Fill rate score — social proof (0-100) */
function calculateFillScore(participants: number, required: number): number {
  const fillRate = participants / required;
  if (fillRate >= 0.5 && fillRate < 1) return Math.round(70 + (fillRate * 40));
  if (fillRate === 0) return 40;
  if (fillRate < 0.5) return Math.round(50 + (fillRate * 40));
  return 30; // full
}

/** Time-of-day preference score (0-100) */
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

// ─────────────────────────────────────
// ENGAGEMENT / COLLABORATIVE FILTERING
// ─────────────────────────────────────

/** Score based on implicit engagement signals — collaborative filtering lite */
function calculateEngagementScore(lobby: FeedLobby, signals: EngagementSignals): number {
  if (signals.totalJoins === 0) return 50; // cold start — neutral

  let score = 50;

  // Boost courts user has played at before (familiarity)
  if (signals.joinedCourts.includes(lobby.court_name)) {
    score += 20;
  }

  // Boost courts user has favorited
  if (signals.favoritedCourts.includes(lobby.court_name)) {
    score += 15;
  }

  // Boost metros user has played at before
  if (signals.playedMetros.includes(lobby.metro)) {
    score += 10;
  }

  // Boost if lobby level aligns with user's historical play levels
  if (signals.playedLevels.length > 0) {
    const avgPlayedLevel = signals.playedLevels.reduce((a, b) => a + b, 0) / signals.playedLevels.length;
    const lobbyCenter = (lobby.min_level + lobby.max_level) / 2;
    const levelDiff = Math.abs(avgPlayedLevel - lobbyCenter);
    if (levelDiff <= 0.5) score += 10;
    else if (levelDiff <= 1.0) score += 5;
  }

  // Inferred time-of-day preference from join history
  if (signals.joinTimePatterns.length > 0) {
    const hour = new Date(lobby.start_time).getHours();
    let timeOfDay: string;
    if (hour >= 6 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
    else timeOfDay = 'night';

    // Count occurrences of this timeOfDay in user's patterns
    const matchCount = signals.joinTimePatterns.filter(t => t === timeOfDay).length;
    const ratio = matchCount / signals.joinTimePatterns.length;
    score += Math.round(ratio * 15);
  }

  // Penalize dismissed courts (negative signal)
  if (signals.dismissedCourts.includes(lobby.court_name)) {
    score -= 15;
  }

  return Math.max(0, Math.min(100, score));
}

/** Freshness/recency decay — newer lobbies get a boost */
function calculateFreshnessScore(createdAt?: string): number {
  if (!createdAt) return 50;
  const now = new Date();
  const created = new Date(createdAt);
  const hoursAgo = (now.getTime() - created.getTime()) / (1000 * 60 * 60);

  if (hoursAgo < 1) return 100;   // just created
  if (hoursAgo < 3) return 85;
  if (hoursAgo < 12) return 70;
  if (hoursAgo < 24) return 55;
  return Math.max(20, 50 - (hoursAgo - 24) / 5);
}

// ─────────────────────────────────────
// MAIN SCORING
// ─────────────────────────────────────

const DEFAULT_ENGAGEMENT: EngagementSignals = {
  joinedCourts: [],
  viewedCourts: [],
  favoritedCourts: [],
  playedLevels: [],
  playedMetros: [],
  joinTimePatterns: [],
  dismissedCourts: [],
  totalJoins: 0,
};

/** Score a single lobby against user preferences and engagement history */
export function scoreLobby(
  lobby: FeedLobby,
  userPrefs: UserPreferences,
  engagement: EngagementSignals = DEFAULT_ENGAGEMENT,
): ScoredLobby {
  const reasons: string[] = [];

  // Individual scores
  const skillScore = calculateSkillScore(userPrefs.skill_level, lobby.min_level, lobby.max_level);
  const timeScore = calculateTimeScore(lobby.start_time);
  const locationScore = calculateLocationScore(lobby.metro, userPrefs.preferred_metro);
  const engagementScore = calculateEngagementScore(lobby, engagement);
  const fillScore = calculateFillScore(lobby.participants_count, lobby.required_players);
  const timePreferenceScore = calculateTimePreferenceScore(lobby.start_time, userPrefs.preferred_times);
  const freshnessScore = calculateFreshnessScore(lobby.created_at);
  const creatorScore = (lobby.creator_rating || 4) * 20; // 0-100

  // Match reasons for transparency
  if (skillScore >= 80) reasons.push('Подходящий уровень');
  if (timeScore >= 80) reasons.push('Удобное время');
  if (locationScore >= 80) reasons.push('Близко к вам');
  if (fillScore >= 80) reasons.push('Почти собрано');
  if (engagementScore >= 70 && engagement.totalJoins > 0) reasons.push('Вам понравится');
  if (freshnessScore >= 85) reasons.push('Новое');

  // Price check
  let priceBonus = 0;
  if (userPrefs.max_price && lobby.price_per_hour) {
    const pricePerPerson = lobby.price_per_hour / lobby.required_players;
    if (pricePerPerson <= userPrefs.max_price) {
      priceBonus = 5;
      reasons.push('В бюджете');
    }
  }

  // Weighted final score
  const weightedScore =
    (skillScore * 0.35) +
    (timeScore * 0.20) +
    (locationScore * 0.15) +
    (engagementScore * 0.10) +
    (fillScore * 0.08) +
    (timePreferenceScore * 0.07) +
    (creatorScore * 0.03) +
    (freshnessScore * 0.02) +
    priceBonus;

  // Determine recommendation type
  let recommendationType: ScoredLobby['recommendationType'] = 'personalized';
  if (freshnessScore >= 85) recommendationType = 'new';
  else if (engagementScore >= 70 && engagement.totalJoins > 2) recommendationType = 'personalized';
  else if (fillScore >= 80) recommendationType = 'popular';

  return {
    ...lobby,
    score: Math.round(Math.min(100, weightedScore)),
    matchReasons: reasons,
    recommendationType,
  };
}

// ─────────────────────────────────────
// FEED GENERATION
// ─────────────────────────────────────

/** Serendipity injection — randomly boost some lower-scored lobbies */
function injectSerendipity(lobbies: ScoredLobby[], probability: number = 0.1): ScoredLobby[] {
  return lobbies.map(lobby => {
    if (lobby.score < 60 && Math.random() < probability) {
      return {
        ...lobby,
        score: lobby.score + 15,
        matchReasons: [...lobby.matchReasons, 'Попробуйте новое'],
        recommendationType: 'serendipity' as const,
      };
    }
    return lobby;
  });
}

/** Generate the full recommendation feed */
export function generateFeed(
  lobbies: FeedLobby[],
  userPrefs: UserPreferences,
  engagement: EngagementSignals = DEFAULT_ENGAGEMENT,
): ScoredLobby[] {
  // Score all lobbies
  let scored = lobbies.map(lobby => scoreLobby(lobby, userPrefs, engagement));

  // Inject serendipity for exploration (10% chance for low-score lobbies)
  scored = injectSerendipity(scored, 0.1);

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Apply diversity rules — max 3 per court in top results
  const diversified: ScoredLobby[] = [];
  const courtCount: Record<string, number> = {};

  for (const lobby of scored) {
    const count = courtCount[lobby.court_name] || 0;
    if (count < 3 || diversified.length > 20) {
      diversified.push(lobby);
      courtCount[lobby.court_name] = count + 1;
    }
  }

  return diversified;
}

/** Group feed into UI sections */
export function getFeedSections(lobbies: ScoredLobby[]): {
  recommended: ScoredLobby[];
  startingSoon: ScoredLobby[];
  nearYou: ScoredLobby[];
  popular: ScoredLobby[];
  newLobbies: ScoredLobby[];
  serendipity: ScoredLobby[];
} {
  const now = new Date();
  const in6Hours = new Date(now.getTime() + 6 * 60 * 60 * 1000);

  return {
    // Top scored — personalized recommendations
    recommended: lobbies.filter(l => l.score >= 65).slice(0, 8),

    // Urgent — starting within 6 hours
    startingSoon: lobbies
      .filter(l => {
        const startTime = new Date(l.start_time);
        return startTime > now && startTime < in6Hours;
      })
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
      .slice(0, 5),

    // Location-based
    nearYou: lobbies
      .filter(l => l.matchReasons.includes('Близко к вам'))
      .slice(0, 4),

    // Social proof — almost full
    popular: lobbies
      .filter(l => l.participants_count >= l.required_players * 0.5 && l.participants_count < l.required_players)
      .sort((a, b) => b.participants_count - a.participants_count)
      .slice(0, 4),

    // Recently created
    newLobbies: lobbies
      .filter(l => l.recommendationType === 'new')
      .slice(0, 4),

    // Exploration / serendipity
    serendipity: lobbies
      .filter(l => l.recommendationType === 'serendipity')
      .slice(0, 3),
  };
}

// ─────────────────────────────────────
// MANUAL FILTERS
// ─────────────────────────────────────

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
    if (filters.minLevel && lobby.max_level < filters.minLevel) return false;
    if (filters.maxLevel && lobby.min_level > filters.maxLevel) return false;
    if (filters.metro && filters.metro.length > 0) {
      if (!filters.metro.includes(lobby.metro)) return false;
    }
    const startTime = new Date(lobby.start_time);
    if (filters.dateFrom && startTime < filters.dateFrom) return false;
    if (filters.dateTo && startTime > filters.dateTo) return false;
    if (filters.maxPrice && lobby.price_per_hour) {
      const pricePerPerson = lobby.price_per_hour / lobby.required_players;
      if (pricePerPerson > filters.maxPrice) return false;
    }
    if (filters.hasSpots && lobby.participants_count >= lobby.required_players) return false;
    return true;
  });
}
