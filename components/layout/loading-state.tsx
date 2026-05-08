import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type LoadingStateProps = {
  rows?: number;
  className?: string;
};

export function LoadingState({ rows = 3, className }: LoadingStateProps) {
  return (
    <Card className={cn("bg-card/70", className)}>
      <CardContent className="space-y-4 p-5">
        <Skeleton className="h-5 w-40" />
        {Array.from({ length: rows }).map((_, index) => (
          <div className="flex items-center gap-3" key={index}>
            <Skeleton className="size-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
