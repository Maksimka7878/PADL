"use client";

import { useState, useCallback } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: GeolocationPositionError | null;
  isLoading: boolean;
  isSupported: boolean;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}



export function useGeolocation(options: UseGeolocationOptions = {}) {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    isLoading: false,
    isSupported: typeof navigator !== "undefined" && "geolocation" in navigator,
  });

  const { enableHighAccuracy = true, timeout = 10000, maximumAge = 60000 } = options;

  const getCurrentPosition = useCallback(() => {
    if (!state.isSupported) return;

    setState((s) => ({ ...s, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          error: null,
          isLoading: false,
          isSupported: true,
        });
      },
      (error) => {
        setState((s) => ({
          ...s,
          error,
          isLoading: false,
        }));
      },
      { enableHighAccuracy, timeout, maximumAge }
    );
  }, [state.isSupported, enableHighAccuracy, timeout, maximumAge]);

  return {
    ...state,
    getCurrentPosition,
  };
}

// Moscow metro stations coordinates
export const METRO_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Фили": { lat: 55.7469, lng: 37.4899 },
  "Павелецкая": { lat: 55.7319, lng: 37.6383 },
  "Тушинская": { lat: 55.8266, lng: 37.4360 },
  "Кутузовская": { lat: 55.7403, lng: 37.5339 },
  "Спортивная": { lat: 55.7250, lng: 37.5644 },
  "Динамо": { lat: 55.7897, lng: 37.5581 },
  "Сокол": { lat: 55.8051, lng: 37.5159 },
  "ВДНХ": { lat: 55.8197, lng: 37.6406 },
  "Киевская": { lat: 55.7447, lng: 37.5666 },
  "Парк Культуры": { lat: 55.7355, lng: 37.5936 },
  "Октябрьская": { lat: 55.7295, lng: 37.6124 },
  "Новокузнецкая": { lat: 55.7419, lng: 37.6294 },
  "Третьяковская": { lat: 55.7406, lng: 37.6258 },
  "Площадь Революции": { lat: 55.7561, lng: 37.6225 },
  "Арбатская": { lat: 55.7522, lng: 37.6014 },
};

// Calculate distance between two coordinates in km
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
    Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Get distance to metro station
export function getDistanceToMetro(
  userLat: number,
  userLng: number,
  metroStation: string
): number | null {
  const coords = METRO_COORDINATES[metroStation];
  if (!coords) return null;
  return calculateDistance(userLat, userLng, coords.lat, coords.lng);
}

// Find nearest metro station
export function findNearestMetro(
  userLat: number,
  userLng: number
): { station: string; distance: number } | null {
  let nearest: { station: string; distance: number } | null = null;

  for (const [station, coords] of Object.entries(METRO_COORDINATES)) {
    const distance = calculateDistance(userLat, userLng, coords.lat, coords.lng);
    if (!nearest || distance < nearest.distance) {
      nearest = { station, distance };
    }
  }

  return nearest;
}

// Sort items by distance from user
export function sortByDistance<T extends { metro_station?: string }>(
  items: T[],
  userLat: number,
  userLng: number
): Array<T & { distance: number | null }> {
  return items
    .map((item) => ({
      ...item,
      distance: item.metro_station
        ? getDistanceToMetro(userLat, userLng, item.metro_station)
        : null,
    }))
    .sort((a, b) => {
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });
}

// Format distance for display
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} м`;
  }
  return `${km.toFixed(1)} км`;
}
