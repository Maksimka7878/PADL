"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StarRating } from "./StarRating";
import { toast } from "sonner";
import { MessageSquarePlus } from "lucide-react";

interface ReviewFormProps {
  type: "player" | "court";
  targetId: string;
  targetName: string;
  onSubmit?: (review: Review) => void;
}

interface Review {
  rating: number;
  comment: string;
  tags: string[];
}

const PLAYER_TAGS = [
  "Пунктуальный",
  "Дружелюбный",
  "Хороший партнёр",
  "Сильная подача",
  "Командный игрок",
  "Помогает новичкам",
];

const COURT_TAGS = [
  "Чисто",
  "Хорошее покрытие",
  "Удобное расположение",
  "Приятный персонал",
  "Есть раздевалки",
  "Парковка",
  "Можно арендовать ракетки",
];

export function ReviewForm({ type, targetName, onSubmit }: ReviewFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tags = type === "player" ? PLAYER_TAGS : COURT_TAGS;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Выберите рейтинг");
      return;
    }

    setIsSubmitting(true);

    try {
      const review: Review = {
        rating,
        comment,
        tags: selectedTags,
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      onSubmit?.(review);
      toast.success("Отзыв отправлен!");
      setIsOpen(false);

      // Reset form
      setRating(0);
      setComment("");
      setSelectedTags([]);
    } catch {
      toast.error("Не удалось отправить отзыв");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-zinc-700">
          <MessageSquarePlus className="h-4 w-4 mr-2" />
          Оставить отзыв
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-zinc-950 border-zinc-800">
        <DialogHeader>
          <DialogTitle>
            Отзыв о {type === "player" ? "игроке" : "корте"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Target info */}
          <div className="text-center">
            <p className="text-lg font-bold">{targetName}</p>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label className="text-zinc-400">Ваша оценка</Label>
            <div className="flex justify-center py-2">
              <StarRating value={rating} onChange={setRating} size="lg" />
            </div>
            <p className="text-center text-sm text-zinc-500">
              {rating === 0 && "Нажмите на звезду"}
              {rating === 1 && "Очень плохо"}
              {rating === 2 && "Плохо"}
              {rating === 3 && "Нормально"}
              {rating === 4 && "Хорошо"}
              {rating === 5 && "Отлично!"}
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-zinc-400">
              Что понравилось? (опционально)
            </Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedTags.includes(tag)
                      ? "bg-emerald-500 text-black"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label className="text-zinc-400">Комментарий (опционально)</Label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Расскажите подробнее..."
              rows={3}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-zinc-700"
            onClick={() => setIsOpen(false)}
          >
            Отмена
          </Button>
          <Button
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black font-bold"
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
          >
            {isSubmitting ? "Отправка..." : "Отправить"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Player rating after game component
export function PostGameRating({
  players,
  onComplete,
}: {
  players: Array<{ id: string; name: string }>;
  onComplete: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const currentPlayer = players[currentIndex];

  const handleRate = (playerId: string, rating: number) => {
    setRatings({ ...ratings, [playerId]: rating });

    if (currentIndex < players.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // All rated
      toast.success("Спасибо за оценки!");
      onComplete();
    }
  };

  const skip = () => {
    if (currentIndex < players.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="text-center">
          <p className="text-xs text-emerald-400 uppercase tracking-wider">
            Оценка игрока {currentIndex + 1} из {players.length}
          </p>
          <h2 className="text-xl font-bold mt-2">{currentPlayer.name}</h2>
        </div>

        <div className="flex justify-center py-4">
          <StarRating
            value={ratings[currentPlayer.id] || 0}
            onChange={(r) => handleRate(currentPlayer.id, r)}
            size="lg"
          />
        </div>

        <button
          onClick={skip}
          className="w-full text-sm text-zinc-500 hover:text-white"
        >
          Пропустить
        </button>
      </div>
    </div>
  );
}
