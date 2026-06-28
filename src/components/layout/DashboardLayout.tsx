import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="flex h-screen bg-[var(--background)]">
      {/* <Sidebar /> */}

      <main className="flex-1 overflow-y-auto">
        {/* <Header /> */}

        <div className="p-6 space-y-6">{children}</div>
      </main>
    </div>
  );
}
