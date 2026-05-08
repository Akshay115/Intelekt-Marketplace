import { Bot, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AiProductCardProps = {
  name: string;
  category: string;
  description: string;
  tags: readonly string[];
};

export function AiProductCard({
  name,
  category,
  description,
  tags,
}: AiProductCardProps) {
  return (
    <Card className="h-full rounded-lg">
      <CardHeader>
        <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-accent/15 text-accent">
          <Bot className="size-5" aria-hidden="true" />
        </div>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{category}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge className="rounded-md" key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <Button className="w-full justify-between" variant="outline">
          View product
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Button>
      </CardContent>
    </Card>
  );
}
