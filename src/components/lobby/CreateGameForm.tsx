"use client";

import { useForm } from "react-hook-form";
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

  const minLevel = form.watch("min_level");
  const maxLevel = form.watch("max_level");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 bg-zinc-900 border border-zinc-800 p-8 rounded-2xl"
      >
        <FormField
          control={form.control}
          name="court_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-400 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Выберите корт в Москве
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-zinc-950 border-zinc-800">
                    <SelectValue placeholder="Выберите корт..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-zinc-950 border-zinc-800">
                  {courts.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      <div className="flex flex-col">
                        <span>{c.name}</span>
                        <span className="text-xs text-zinc-500">
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
              <FormLabel className="text-zinc-400 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Дата и время игры
              </FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  className="bg-zinc-950 border-zinc-800"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel className="text-zinc-400">Диапазон уровней (NTRP)</FormLabel>
          <div className="flex gap-4 items-center">
            <div className="w-12 text-center text-emerald-500 font-black text-xl">
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
            <div className="w-12 text-center text-emerald-500 font-black text-xl">
              {maxLevel.toFixed(1)}
            </div>
          </div>
          <div className="flex justify-between text-xs text-zinc-500">
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
              <FormLabel className="text-zinc-400">Описание (опционально)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Напишите что-нибудь о игре..."
                  className="bg-zinc-950 border-zinc-800"
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
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-black py-6 text-lg"
        >
          {isLoading ? "СОЗДАНИЕ..." : "СОЗДАТЬ ЛОББИ"}
        </Button>
      </form>
    </Form>
  );
}
