import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome back 👋
        </h1>

        <p className="text-muted-foreground mt-2">
          Here's your social intelligence overview.
        </p>
      </div>

      <Button className="gap-2">
        <Plus size={18} />
        New Project
      </Button>
    </div>
  );
}