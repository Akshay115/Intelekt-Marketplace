import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type CategoryPillProps = {
  label: string;
  icon?: LucideIcon;
  active?: boolean;
  className?: string;
};

export function CategoryPill({
  label,
  icon: Icon,
  active = false,
  className,
}: CategoryPillProps) {
  return (
    <Badge
      variant={active ? "default" : "outline"}
      className={cn(
        "h-8 gap-2 rounded-md px-3 text-sm",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-background/70 text-muted-foreground hover:bg-muted",
        className
      )}
    >
      {Icon ? <Icon className="size-3.5" aria-hidden="true" /> : null}
      {label}
    </Badge>
  );
}
