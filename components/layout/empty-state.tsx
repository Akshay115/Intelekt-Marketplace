import type { LucideIcon } from "lucide-react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  className?: string;
};

export function EmptyState({
  icon: Icon = Search,
  title,
  description,
  actionLabel,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn("border-dashed bg-card/70", className)}>
      <CardContent className="flex flex-col items-center px-6 py-10 text-center">
        <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </p>
        {actionLabel ? (
          <Button className="mt-5" variant="outline" size="sm">
            {actionLabel}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
