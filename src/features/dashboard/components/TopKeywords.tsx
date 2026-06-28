import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const keywords = [
  "OpenAI",
  "Next.js",
  "Indonesia",
  "AI",
  "Marketing",
  "Startup",
  "React",
  "Supabase",
];

export default function TopKeywords() {
  return (
    <Card className="rounded-2xl p-6">

      <h2 className="font-semibold mb-6">
        Trending Keywords
      </h2>

      <div className="flex flex-wrap gap-3">

        {keywords.map((k) => (
          <Badge
            key={k}
            variant="secondary"
          >
            {k}
          </Badge>
        ))}

      </div>

    </Card>
  );
}