import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Bot } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type EntityCardProps = {
  name: string;
  type: string;
  description: string;
  metric: string;
  tags: string[];
  icon?: LucideIcon;
};

export function EntityCard({
  name,
  type,
  description,
  metric,
  tags,
  icon: Icon = Bot,
}: EntityCardProps) {
  return (
    <Card className="h-full bg-card/90 transition hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar className="rounded-lg">
            <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
              <Icon className="size-4" aria-hidden="true" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{name}</CardTitle>
            <CardDescription>{type}</CardDescription>
          </div>
        </div>
        <CardAction>
          <Badge variant="outline">{metric}</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge className="rounded-md" variant="secondary" key={tag}>
              {tag}
            </Badge>
          ))}
        </div>
        <Button className="w-full justify-between" variant="outline">
          View profile
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Button>
      </CardContent>
    </Card>
  );
}
