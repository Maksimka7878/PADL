import { cn } from "@/lib/utils";

interface LevelBadgeProps {
  level: number;
  size?: "sm" | "md" | "lg";
}

function getLevelCategory(level: number) {
  if (level <= 3.0) return { label: "Beginner", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" };
  if (level <= 4.5) return { label: "Intermediate", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" };
  if (level <= 6.0) return { label: "Advanced", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" };
  return { label: "Pro", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" };
}

export function LevelBadge({ level, size = "md" }: LevelBadgeProps) {
  const { color } = getLevelCategory(level);

  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0.5",
    md: "text-xs px-2 py-1",
    lg: "text-sm px-3 py-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md border font-bold tabular-nums",
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
    <span className={cn("text-xs font-medium", color.split(" ")[1])}>
      {label}
    </span>
  );
}
