import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";

interface Props {
  children: ReactNode;
  onOpenHistory?: () => void;
  historyCount?: number;
}

export default function DashboardLayout({ children, onOpenHistory, historyCount }: Props) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AppSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader onOpenHistory={onOpenHistory} historyCount={historyCount} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6 max-w-screen-2xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
