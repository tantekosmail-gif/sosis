"use client";

export interface PageTab<T extends string> {
  key: T;
  label: string;
}

export default function PageTabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: readonly PageTab<T>[];
  active: T;
  onChange: (key: T) => void;
}) {
  return (
    <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
            active === tab.key
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
