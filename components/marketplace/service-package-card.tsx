import { CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ServicePackageCardProps = {
  title: string;
  description: string;
  price: string;
  timeline: string;
  outcomes: readonly string[];
};

export function ServicePackageCard({
  title,
  description,
  price,
  timeline,
  outcomes,
}: ServicePackageCardProps) {
  return (
    <Card className="h-full bg-card">
      <CardHeader>
        <Badge className="w-fit bg-warning/15 text-warning-foreground hover:bg-warning/15">
          Productized service
        </Badge>
        <CardTitle className="mt-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end justify-between rounded-lg bg-muted p-4">
          <div>
            <p className="text-xs text-muted-foreground">Starting at</p>
            <p className="text-2xl font-semibold">{price}</p>
          </div>
          <p className="text-sm text-muted-foreground">{timeline}</p>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {outcomes.map((outcome) => (
            <li className="flex gap-2" key={outcome}>
              <CheckCircle2 className="mt-0.5 size-4 text-success" aria-hidden="true" />
              <span>{outcome}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Add to shortlist</Button>
      </CardFooter>
    </Card>
  );
}
