"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

export function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
  showValue = false,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue ?? value;

  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div
        className="flex"
        onMouseLeave={() => !readonly && setHoverValue(null)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readonly && setHoverValue(star)}
            disabled={readonly}
            className={`${readonly ? "cursor-default" : "cursor-pointer"} p-0.5 transition-transform hover:scale-110`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                star <= displayValue
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-zinc-600"
              } transition-colors`}
            />
          </button>
        ))}
      </div>
      {showValue && (
        <span className="text-sm text-zinc-400 ml-1">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}

// Rating summary with breakdown
interface RatingSummaryProps {
  average: number;
  total: number;
  breakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export function RatingSummary({ average, total, breakdown }: RatingSummaryProps) {
  const maxCount = Math.max(...Object.values(breakdown), 1);

  return (
    <div className="flex gap-6">
      {/* Average */}
      <div className="text-center">
        <p className="text-4xl font-black">{average.toFixed(1)}</p>
        <StarRating value={average} readonly size="sm" />
        <p className="text-xs text-zinc-500 mt-1">{total} отзывов</p>
      </div>

      {/* Breakdown */}
      <div className="flex-1 space-y-1.5">
        {[5, 4, 3, 2, 1].map((stars) => (
          <div key={stars} className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 w-3">{stars}</span>
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full transition-all"
                style={{
                  width: `${(breakdown[stars as keyof typeof breakdown] / maxCount) * 100}%`,
                }}
              />
            </div>
            <span className="text-xs text-zinc-500 w-8 text-right">
              {breakdown[stars as keyof typeof breakdown]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
