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
    <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
            active === tab.key
              ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
