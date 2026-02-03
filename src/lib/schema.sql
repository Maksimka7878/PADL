-- Moscow Padel Community - Database Schema
-- Run this in Vercel Postgres Storage Console

-- Основная таблица пользователей для NextAuth
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  email_verified TIMESTAMPTZ,
  image TEXT
);

-- Профили игроков (расширение данных пользователя)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  skill_level DECIMAL(2,1) CHECK (skill_level >= 1.0 AND skill_level <= 7.0),
  preferred_hand TEXT CHECK (preferred_hand IN ('Left', 'Right', 'Ambidextrous')),
  games_played INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- База кортов Москвы
CREATE TABLE courts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  metro_station TEXT,
  surface_type TEXT,
  price_per_hour INTEGER,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Лобби для поиска партнеров
CREATE TABLE lobbies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES profiles(id),
  court_id UUID REFERENCES courts(id),
  start_time TIMESTAMPTZ NOT NULL,
  min_level DECIMAL(2,1),
  max_level DECIMAL(2,1),
  required_players INTEGER DEFAULT 4,
  description TEXT,
  is_closed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Участники лобби
CREATE TABLE lobby_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lobby_id UUID REFERENCES lobbies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lobby_id, user_id)
);

-- Сообщения чата лобби
CREATE TABLE lobby_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lobby_id UUID REFERENCES lobbies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для оптимизации запросов
CREATE INDEX idx_lobbies_start_time ON lobbies(start_time);
CREATE INDEX idx_lobbies_is_closed ON lobbies(is_closed);
CREATE INDEX idx_lobby_participants_lobby_id ON lobby_participants(lobby_id);
CREATE INDEX idx_lobby_messages_lobby_id ON lobby_messages(lobby_id);

-- Начальные данные: корты Москвы
INSERT INTO courts (name, address, metro_station, surface_type, price_per_hour, image_url) VALUES
  ('Padel Moscow Club', 'ул. Большая Филёвская, 22', 'Фили', 'Artificial Grass', 3500, '/courts/padel-moscow.jpg'),
  ('World Class Paveletskaya', 'ул. Кожевническая, 14', 'Павелецкая', 'Artificial Grass', 4000, '/courts/world-class.jpg'),
  ('Racket Club', 'ул. Лодочная, 19', 'Тушинская', 'Artificial Grass', 3000, '/courts/racket-club.jpg'),
  ('Padel Point', 'Кутузовский проспект, 36', 'Кутузовская', 'Artificial Grass', 3800, '/courts/padel-point.jpg'),
  ('Sport Palace Luzhniki', 'ул. Лужники, 24', 'Спортивная', 'Artificial Grass', 4500, '/courts/luzhniki.jpg');
