# Moscow Padel Community PWA

Социальное приложение для поиска партнёров по падел-теннису в Москве.

## Технологии

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS** (Premium Dark Theme)
- **NextAuth.js** (Аутентификация)
- **Vercel Postgres** (База данных)
- **Zustand** (State Management)
- **Zod** (Валидация)
- **PWA** (Progressive Web App)

## Функционал

- Создание и присоединение к лобби для игр
- Фильтрация по уровню NTRP (1.0 - 7.0)
- Каталог кортов Москвы
- Профиль игрока с настройкой уровня
- Чат в лобби (в разработке)
- PWA для мобильных устройств

## Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка окружения

Скопируйте `.env.example` в `.env.local` и заполните переменные:

```bash
cp .env.example .env.local
```

### 3. Настройка базы данных

1. Создайте проект Postgres в [Vercel Dashboard](https://vercel.com/dashboard/stores)
2. Скопируйте переменные окружения в `.env.local`
3. Выполните SQL-скрипт из `src/lib/schema.sql` в Storage Console

### 4. Запуск

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## Структура проекта

```
/src
  /app
    /api/auth/[...nextauth]  # NextAuth API
    /login                    # Страница входа
    /dashboard               # Главная страница с лобби
    /dashboard/lobbies/[id]  # Детали лобби
    /courts                  # Каталог кортов
    /profile                 # Профиль игрока
  /components
    /ui                      # UI компоненты (shadcn-style)
    /lobby                   # Компоненты лобби
  /lib
    auth.ts                  # NextAuth конфигурация
    db.ts                    # Database queries
    actions.ts               # Server Actions
    schema.sql               # SQL схема
  /store
    useLobbyStore.ts         # Zustand store
```

## Деплой на Vercel

1. Push в GitHub репозиторий
2. Импортируйте проект в Vercel
3. Добавьте переменные окружения
4. Deploy!

## Лицензия

MIT
