import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LobbyCardSkeleton() {
  return (
    <Card className="overflow-hidden border-2 bg-zinc-950 shadow-xl shadow-emerald-900/10">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="flex gap-1 items-center bg-zinc-900 p-1.5 rounded-lg border border-zinc-800">
            <Skeleton className="h-6 w-8 rounded" />
            <Skeleton className="h-6 w-8 rounded" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-2 space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-40" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-10" />
          </div>
          <Skeleton className="h-1.5 w-full" />
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

export function LobbiesGridSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <LobbyCardSkeleton />
      <LobbyCardSkeleton />
      <LobbyCardSkeleton />
      <LobbyCardSkeleton />
    </div>
  );
}
