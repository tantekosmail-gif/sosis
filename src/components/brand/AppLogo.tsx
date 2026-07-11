import type { SVGProps } from "react";

interface LogoMarkProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

/**
 * MediaWatch brand mark — an eye (monitoring) with a signal/equalizer
 * "pupil" (media), drawn in the same stroke style as the lucide icon set
 * used across the app so it drops in wherever the generic Sparkles icon
 * used to stand in for the logo.
 */
export function LogoMark({ size = 24, strokeWidth = 2, ...props }: LogoMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 12C2 12 6 6 12 6C18 6 22 12 22 12C22 12 18 18 12 18C6 18 2 12 2 12Z" />
      <path d="M9 10v4" />
      <path d="M12 8v8" />
      <path d="M15 10v4" />
    </svg>
  );
}

interface AppLogoProps {
  size?: "sm" | "md" | "lg";
  /** "dark" = white wordmark for dark panels (sidebar, auth hero). "light" = slate wordmark for light backgrounds. */
  theme?: "dark" | "light";
  showTagline?: boolean;
  className?: string;
}

const BADGE_SIZE = {
  sm: "h-8 w-8 rounded-lg",
  md: "h-9 w-9 rounded-xl",
  lg: "h-10 w-10 rounded-xl",
};

const MARK_SIZE = {
  sm: 16,
  md: 17,
  lg: 20,
};

const NAME_SIZE = {
  sm: "text-sm",
  md: "text-sm",
  lg: "text-lg",
};

// Full brand lockup (mark + wordmark) — used in the sidebar, auth screen, and
// anywhere else the app identity needs to be shown, so the mark stays
// consistent instead of being redrawn ad hoc per page.
export function AppLogo({ size = "md", theme = "dark", showTagline = false, className }: AppLogoProps) {
  const nameColor = theme === "dark" ? "text-white" : "text-slate-900 dark:text-slate-100";
  const taglineColor = theme === "dark" ? "text-slate-400" : "text-slate-500 dark:text-slate-400";

  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <div
        className={`flex shrink-0 items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 ${BADGE_SIZE[size]}`}
      >
        <LogoMark size={MARK_SIZE[size]} className="text-white" />
      </div>
      <div>
        <p className={`font-bold leading-none ${nameColor} ${NAME_SIZE[size]}`}>MediaWatch</p>
        {showTagline && <p className={`mt-0.5 text-xs ${taglineColor}`}>Social Media & News Monitoring Platform</p>}
      </div>
    </div>
  );
}
