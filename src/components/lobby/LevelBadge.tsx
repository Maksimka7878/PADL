import { cn } from "@/lib/utils";

interface LevelBadgeProps {
  level: number;
  size?: "sm" | "md" | "lg";
}

function getLevelCategory(level: number) {
  if (level <= 3.0) return { label: "Beginner", color: "bg-cyan/15 text-cyan border-cyan/20" };
  if (level <= 4.5) return { label: "Intermediate", color: "bg-lime/15 text-lime border-lime/20" };
  if (level <= 6.0) return { label: "Advanced", color: "bg-violet/15 text-violet border-violet/20" };
  return { label: "Pro", color: "bg-hot-pink/15 text-hot-pink border-hot-pink/20" };
}

export function LevelBadge({ level, size = "md" }: LevelBadgeProps) {
  const { color } = getLevelCategory(level);

  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
    lg: "text-sm px-3 py-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border font-bold tabular-nums font-display",
        color,
        sizeClasses[size]
      )}
    >
      {level.toFixed(1)}
    </span>
  );
}

export function LevelLabel({ level }: { level: number }) {
  const { label, color } = getLevelCategory(level);

  return (
    <span className={cn("text-xs font-semibold", color.split(" ")[1])}>
      {label}
    </span>
  );
}
