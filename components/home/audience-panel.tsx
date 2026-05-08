import { CheckCircle2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AudiencePanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  points: readonly string[];
};

export function AudiencePanel({
  eyebrow,
  title,
  description,
  points,
}: AudiencePanelProps) {
  return (
    <Card className="h-full rounded-lg">
      <CardHeader>
        <p className="text-sm font-medium text-primary">{eyebrow}</p>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-2 text-sm text-muted-foreground">
          {points.map((point) => (
            <li className="flex gap-2" key={point}>
              <CheckCircle2 className="mt-0.5 size-4 text-success" aria-hidden="true" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
