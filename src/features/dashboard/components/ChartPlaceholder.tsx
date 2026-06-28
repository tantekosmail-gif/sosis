import { Card, CardContent } from "@/components/ui/card";

export default function ChartPlaceholder() {
  return (
    <Card>
      <CardContent className="h-80 flex items-center justify-center">
        <p className="text-muted-foreground">
          📈 Chart Coming Soon
        </p>
      </CardContent>
    </Card>
  );
}