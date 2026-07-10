import { ReactNode } from "react";
import { Sparkles, BarChart2, Globe, Shield } from "lucide-react";

const FEATURES = [
  { icon: BarChart2, text: "Real-time sentiment analysis across platforms" },
  { icon: Globe, text: "Multi-platform: YouTube, TikTok, Instagram, Facebook, Twitter/X, News" },
  { icon: Sparkles, text: "AI-powered executive summaries & insights" },
  { icon: Shield, text: "Secure JWT authentication & data privacy" },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] flex-col justify-between bg-slate-900 p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-slate-900 to-violet-900/40" />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl" />

        <div className="relative z-10">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none">MediaWatch</p>
              <p className="text-slate-400 text-xs mt-0.5">Social Media & News Monitoring Platform</p>
            </div>
          </div>

          {/* Headline */}
          <div className="mt-16">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Monitor every platform,
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                powered by AI.
              </span>
            </h1>
            <p className="mt-4 text-slate-400 text-lg leading-relaxed max-w-sm">
              Track, analyze, and understand what people are saying about your brand across social media and the news.
            </p>
          </div>

          {/* Features */}
          <ul className="mt-12 space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                  <Icon size={15} className="text-indigo-400" />
                </div>
                <span className="text-slate-300 text-sm">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-slate-300 text-sm leading-relaxed italic">
              "Precision social intelligence for data-driven teams. Know what the public thinks before it becomes a crisis."
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-900">MediaWatch</span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
