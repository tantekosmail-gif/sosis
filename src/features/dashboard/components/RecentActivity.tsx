import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activities = [
  {
    title: "New project created",
    time: "5 minutes ago",
  },
  {
    title: "Twitter data synchronized",
    time: "15 minutes ago",
  },
  {
    title: "Admin invited a new member",
    time: "1 hour ago",
  },
];

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Recent Activity
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {activities.map((item) => (
          <div
            key={item.title}
            className="flex justify-between border-b pb-3"
          >
            <p>{item.title}</p>

            <span className="text-sm text-muted-foreground">
              {item.time}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}