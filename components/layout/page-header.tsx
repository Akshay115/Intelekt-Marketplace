import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end",
        className
      )}
    >
      <div className="max-w-3xl">
        {eyebrow ? (
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/10">
            {eyebrow}
          </Badge>
        ) : null}
        <h1 className="text-4xl font-semibold leading-none tracking-normal text-foreground sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
