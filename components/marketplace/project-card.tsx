import { CalendarDays, CircleDollarSign } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProjectCardProps = {
  title: string;
  stage: string;
  budget: string;
  timeline: string;
  description: string;
};

export function ProjectCard({
  title,
  stage,
  budget,
  timeline,
  description,
}: ProjectCardProps) {
  return (
    <Card className="bg-card/90">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle>{title}</CardTitle>
          <Badge variant="outline">{stage}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2">
            <CircleDollarSign className="size-4 text-primary" aria-hidden="true" />
            {budget}
          </div>
          <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2">
            <CalendarDays className="size-4 text-primary" aria-hidden="true" />
            {timeline}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
