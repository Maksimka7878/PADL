import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCourts } from "@/lib/db";
import type { Court } from "@/lib/types";
import { CourtsClient } from "./courts-client";

// Extended court type with reviews
export interface CourtWithReviews extends Court {
  rating: number;
  reviewCount: number;
  amenities: string[];
  workingHours: string;
  courtsCount: number;
}

const mockCourts: CourtWithReviews[] = [
  {
    id: "c1",
    name: "Padel Moscow Club",
    address: "ул. Большая Филёвская, 22",
    metro_station: "Фили",
    surface_type: "Artificial Grass",
    price_per_hour: 3500,
    image_url: "/courts/padel-moscow.jpg",
    created_at: new Date(),
    rating: 4.8,
    reviewCount: 47,
    amenities: ["Раздевалки", "Душевые", "Прокат ракеток", "Парковка", "Кафе"],
    workingHours: "07:00 - 23:00",
    courtsCount: 4,
  },
  {
    id: "c2",
    name: "World Class Paveletskaya",
    address: "ул. Кожевническая, 14",
    metro_station: "Павелецкая",
    surface_type: "Artificial Grass",
    price_per_hour: 4000,
    image_url: "/courts/world-class.jpg",
    created_at: new Date(),
    rating: 4.6,
    reviewCount: 32,
    amenities: ["Раздевалки", "Душевые", "СПА", "Парковка", "Ресторан"],
    workingHours: "06:00 - 00:00",
    courtsCount: 2,
  },
  {
    id: "c3",
    name: "Racket Club",
    address: "ул. Лодочная, 19",
    metro_station: "Тушинская",
    surface_type: "Artificial Grass",
    price_per_hour: 3000,
    image_url: "/courts/racket-club.jpg",
    created_at: new Date(),
    rating: 4.3,
    reviewCount: 28,
    amenities: ["Раздевалки", "Прокат ракеток", "Парковка"],
    workingHours: "08:00 - 22:00",
    courtsCount: 3,
  },
  {
    id: "c4",
    name: "Padel Point",
    address: "Кутузовский проспект, 36",
    metro_station: "Кутузовская",
    surface_type: "Artificial Grass",
    price_per_hour: 3800,
    image_url: "/courts/padel-point.jpg",
    created_at: new Date(),
    rating: 4.5,
    reviewCount: 41,
    amenities: ["Раздевалки", "Душевые", "Прокат ракеток", "Магазин"],
    workingHours: "07:00 - 23:00",
    courtsCount: 3,
  },
  {
    id: "c5",
    name: "Sport Palace Luzhniki",
    address: "ул. Лужники, 24",
    metro_station: "Спортивная",
    surface_type: "Artificial Grass",
    price_per_hour: 4500,
    image_url: "/courts/luzhniki.jpg",
    created_at: new Date(),
    rating: 4.9,
    reviewCount: 63,
    amenities: ["Раздевалки", "Душевые", "Прокат", "Парковка", "Тренеры", "Магазин"],
    workingHours: "06:00 - 00:00",
    courtsCount: 6,
  },
];

export default async function CourtsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  let courts: CourtWithReviews[] = mockCourts;

  try {
    const dbCourts = await getCourts();
    if (dbCourts.length > 0) {
      // Add mock ratings to db courts
      courts = dbCourts.map((court, i) => ({
        ...court,
        rating: mockCourts[i % mockCourts.length].rating,
        reviewCount: mockCourts[i % mockCourts.length].reviewCount,
        amenities: mockCourts[i % mockCourts.length].amenities,
        workingHours: mockCourts[i % mockCourts.length].workingHours,
        courtsCount: mockCourts[i % mockCourts.length].courtsCount,
      }));
    }
  } catch {
    // Use mock data
  }

  return <CourtsClient courts={courts} />;
}
