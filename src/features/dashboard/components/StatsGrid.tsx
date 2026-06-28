import StatCard from "./StatCard";
import { dashboardStats } from "../mocks/dashboard";

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {dashboardStats.map((item) => (
        <StatCard
          key={item.title}
          title={item.title}
          value={item.value}
          change={item.change}
        />
      ))}
    </div>
  );
}