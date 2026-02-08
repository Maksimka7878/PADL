"use client";

import { useState, useEffect, useCallback } from "react";

interface PushNotificationState {
  isSupported: boolean;
  permission: NotificationPermission | null;
  isSubscribed: boolean;
  isLoading: boolean;
}

export function usePushNotifications() {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    permission: null,
    isSubscribed: false,
    isLoading: true,
  });

  useEffect(() => {
    const checkSupport = async () => {
      const isSupported =
        typeof window !== "undefined" &&
        "serviceWorker" in navigator &&
        "PushManager" in window &&
        "Notification" in window;

      if (!isSupported) {
        setState((s) => ({ ...s, isSupported: false, isLoading: false }));
        return;
      }

      const permission = Notification.permission;

      // Check if already subscribed
      let isSubscribed = false;
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        isSubscribed = !!subscription;
      } catch {
        // Ignore errors
      }

      setState({
        isSupported: true,
        permission,
        isSubscribed,
        isLoading: false,
      });
    };

    checkSupport();
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported) return false;

    try {
      const permission = await Notification.requestPermission();
      setState((s) => ({ ...s, permission }));
      return permission === "granted";
    } catch {
      return false;
    }
  }, [state.isSupported]);

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported || state.permission !== "granted") {
      return false;
    }

    try {
      setState((s) => ({ ...s, isLoading: true }));

      const registration = await navigator.serviceWorker.ready;

      // Using a placeholder VAPID key - in production, replace with your actual key
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
        "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U";

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
      });

      // In production, send subscription to your server
      console.log("Push subscription:", subscription);

      setState((s) => ({ ...s, isSubscribed: true, isLoading: false }));
      return true;
    } catch (error) {
      console.error("Failed to subscribe:", error);
      setState((s) => ({ ...s, isLoading: false }));
      return false;
    }
  }, [state.isSupported, state.permission]);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    try {
      setState((s) => ({ ...s, isLoading: true }));

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
      }

      setState((s) => ({ ...s, isSubscribed: false, isLoading: false }));
      return true;
    } catch (error) {
      console.error("Failed to unsubscribe:", error);
      setState((s) => ({ ...s, isLoading: false }));
      return false;
    }
  }, []);

  const showNotification = useCallback(
    async (title: string, options?: NotificationOptions): Promise<void> => {
      if (state.permission !== "granted") return;

      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, {
          icon: "/icons/icon-192x192.png",
          badge: "/icons/badge-72x72.png",
          ...options,
        } as NotificationOptions);
      } catch {
        // Fallback to regular Notification API
        new Notification(title, options);
      }
    },
    [state.permission]
  );

  return {
    ...state,
    requestPermission,
    subscribe,
    unsubscribe,
    showNotification,
  };
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
