// Accessibility utilities for the application

// Focus trap for modals and dialogs
export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  element.addEventListener("keydown", handleKeyDown);
  firstElement?.focus();

  return () => element.removeEventListener("keydown", handleKeyDown);
}

// Announce to screen readers
export function announce(message: string, priority: "polite" | "assertive" = "polite") {
  const announcer = document.getElementById("sr-announcer") || createAnnouncer();
  announcer.setAttribute("aria-live", priority);
  announcer.textContent = message;

  // Clear after announcement
  setTimeout(() => {
    announcer.textContent = "";
  }, 1000);
}

function createAnnouncer(): HTMLElement {
  const announcer = document.createElement("div");
  announcer.id = "sr-announcer";
  announcer.setAttribute("aria-live", "polite");
  announcer.setAttribute("aria-atomic", "true");
  announcer.className = "sr-only";
  announcer.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `;
  document.body.appendChild(announcer);
  return announcer;
}

// Keyboard navigation helpers
export const KEYS = {
  ENTER: "Enter",
  SPACE: " ",
  ESCAPE: "Escape",
  TAB: "Tab",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  HOME: "Home",
  END: "End",
} as const;

export function isActivationKey(key: string): boolean {
  return key === KEYS.ENTER || key === KEYS.SPACE;
}

export function handleListKeyDown(
  e: React.KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  onSelect: (index: number) => void
) {
  const { key } = e;

  if (key === KEYS.ARROW_DOWN || key === KEYS.ARROW_RIGHT) {
    e.preventDefault();
    const nextIndex = (currentIndex + 1) % items.length;
    items[nextIndex]?.focus();
    onSelect(nextIndex);
  } else if (key === KEYS.ARROW_UP || key === KEYS.ARROW_LEFT) {
    e.preventDefault();
    const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    items[prevIndex]?.focus();
    onSelect(prevIndex);
  } else if (key === KEYS.HOME) {
    e.preventDefault();
    items[0]?.focus();
    onSelect(0);
  } else if (key === KEYS.END) {
    e.preventDefault();
    items[items.length - 1]?.focus();
    onSelect(items.length - 1);
  }
}

// Generate unique IDs for accessibility
let idCounter = 0;
export function generateId(prefix: string = "padel"): string {
  return `${prefix}-${++idCounter}`;
}

// Check for reduced motion preference
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Skip link component helper
export const skipLinkStyles = `
  position: absolute;
  top: -40px;
  left: 0;
  background: #10b981;
  color: black;
  padding: 8px 16px;
  z-index: 100;
  font-weight: bold;
  transition: top 0.3s;
  &:focus {
    top: 0;
  }
`;

// Color contrast checker (WCAG AA = 4.5:1, AAA = 7:1)
export function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// ARIA label generators
export function getLobbyAriaLabel(lobby: {
  title?: string;
  participants_count: number;
  required_players: number;
  start_time: string;
  court_name?: string;
}): string {
  const parts = [
    lobby.title || "Игра в падел",
    `${lobby.participants_count} из ${lobby.required_players} игроков`,
    `Время: ${new Date(lobby.start_time).toLocaleString("ru-RU")}`,
    lobby.court_name && `Корт: ${lobby.court_name}`,
  ].filter(Boolean);

  return parts.join(". ");
}

export function getRatingAriaLabel(rating: number, max: number = 5): string {
  return `Рейтинг ${rating} из ${max} звёзд`;
}

export function getProgressAriaLabel(
  current: number,
  total: number,
  label?: string
): string {
  const percent = Math.round((current / total) * 100);
  return `${label || "Прогресс"}: ${percent}%, ${current} из ${total}`;
}
