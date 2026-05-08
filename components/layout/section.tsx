import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  tone?: "default" | "subtle" | "raised";
};

export function Section({ className, tone = "default", ...props }: SectionProps) {
  return (
    <section
      className={cn(
        "py-14 sm:py-20",
        tone === "subtle" && "bg-surface-subtle",
        tone === "raised" && "bg-surface-raised",
        className
      )}
      {...props}
    />
  );
}
