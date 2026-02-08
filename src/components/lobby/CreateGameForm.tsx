"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin } from "lucide-react";

const formSchema = z.object({
  court_id: z.string().min(1, "Выберите корт"),
  start_time: z.string().min(1, "Выберите время"),
  min_level: z.number().min(1).max(7),
  max_level: z.number().min(1).max(7),
  description: z.string().optional(),
}).refine((data) => data.max_level >= data.min_level, {
  message: "Максимальный уровень должен быть >= минимального",
  path: ["max_level"],
});

type FormValues = z.infer<typeof formSchema>;

interface Court {
  id: string;
  name: string;
  metro_station: string | null;
  price_per_hour: number | null;
}

interface CreateGameFormProps {
  courts: Court[];
  onSubmit: (data: FormValues) => Promise<void>;
  isLoading?: boolean;
}

export function CreateGameForm({ courts, onSubmit, isLoading }: CreateGameFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      court_id: "",
      start_time: "",
      min_level: 3.5,
      max_level: 5.0,
      description: "",
    },
  });

  const minLevel = useWatch({ control: form.control, name: "min_level" });
  const maxLevel = useWatch({ control: form.control, name: "max_level" });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 glass gradient-border p-8 rounded-2xl"
      >
        <FormField
          control={form.control}
          name="court_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white/40 text-xs tracking-wider flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-violet" />
                Выберите корт в Москве
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white/[0.04] border-white/10 rounded-xl">
                    <SelectValue placeholder="Выберите корт..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-surface-2 border-white/10 rounded-xl">
                  {courts.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      <div className="flex flex-col">
                        <span>{c.name}</span>
                        <span className="text-xs text-white/30">
                          м. {c.metro_station} • {c.price_per_hour}₽/час
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="start_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white/40 text-xs tracking-wider flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-hot-pink" />
                Дата и время игры
              </FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel className="text-white/40 text-xs tracking-wider">Диапазон уровней (NTRP)</FormLabel>
          <div className="flex gap-4 items-center">
            <div className="w-12 text-center font-display text-lime font-black text-xl">
              {minLevel.toFixed(1)}
            </div>
            <Slider
              min={1.0}
              max={7.0}
              step={0.5}
              value={[minLevel, maxLevel]}
              onValueChange={(v) => {
                form.setValue("min_level", v[0]);
                form.setValue("max_level", v[1]);
              }}
              className="flex-1"
            />
            <div className="w-12 text-center font-display text-lime font-black text-xl">
              {maxLevel.toFixed(1)}
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-white/20 uppercase tracking-[0.1em]">
            <span>Beginner</span>
            <span>Intermediate</span>
            <span>Advanced</span>
            <span>Pro</span>
          </div>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white/40 text-xs tracking-wider">Описание (опционально)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Напишите что-нибудь о игре..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full py-6 text-lg font-display font-black"
          variant="violet"
        >
          {isLoading ? "Создание..." : "Создать лобби"}
        </Button>
      </form>
    </Form>
  );
}
