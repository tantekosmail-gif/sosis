import type { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function DocCard({ title, description, children }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-slate-100 px-6 py-5">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-slate-400">{description}</p>}
      </div>
      <div className="px-6 py-5 space-y-3 text-sm leading-relaxed text-slate-600">{children}</div>
    </div>
  );
}
