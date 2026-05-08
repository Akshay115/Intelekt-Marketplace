import { Star } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ProposalCardProps = {
  provider: string;
  summary: string;
  score: string;
  estimate: string;
};

export function ProposalCard({ provider, summary, score, estimate }: ProposalCardProps) {
  return (
    <Card className="bg-card">
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <Avatar className="rounded-lg">
          <AvatarFallback className="rounded-lg bg-accent/15 text-accent">
            {provider
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{provider}</h3>
            <Badge className="gap-1 bg-success/10 text-success hover:bg-success/10">
              <Star className="size-3" aria-hidden="true" />
              {score}
            </Badge>
          </div>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{summary}</p>
        </div>
        <div className="flex items-center justify-between gap-3 sm:block sm:text-right">
          <p className="text-sm font-medium">{estimate}</p>
          <Button className="mt-0 sm:mt-2" variant="outline" size="sm">
            Compare
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
