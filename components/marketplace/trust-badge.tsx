import type { LucideIcon } from "lucide-react";
import { ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

type TrustBadgeProps = {
  label: string;
  detail?: string;
  icon?: LucideIcon;
  className?: string;
};

export function TrustBadge({
  label,
  detail,
  icon: Icon = ShieldCheck,
  className,
}: TrustBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm shadow-sm",
        className
      )}
    >
      <span className="flex size-7 items-center justify-center rounded-md bg-success/10 text-success">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="grid leading-tight">
        <span className="font-medium">{label}</span>
        {detail ? <span className="text-xs text-muted-foreground">{detail}</span> : null}
      </span>
    </div>
  );
}
