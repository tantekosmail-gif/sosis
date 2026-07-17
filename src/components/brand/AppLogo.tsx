import type { SVGProps } from "react";

interface LogoMarkProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

/**
 * MediaWatch brand mark — an eye (monitoring) with a signal/equalizer
 * "pupil" (media), drawn in the same stroke style as the lucide icon set
 * used across the app so it drops in wherever a decorative brand mark
 * is needed (e.g. the 404 page).
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

const NAME_SIZE = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
};

// Wordmark-only brand lockup (letters, no icon mark) — used in the sidebar,
// auth screen, and anywhere else the app identity needs to be shown, so the
// wordmark stays consistent instead of being redrawn ad hoc per page.
export function AppLogo({ size = "md", theme = "dark", showTagline = false, className }: AppLogoProps) {
  const nameColor = theme === "dark" ? "text-white" : "text-slate-900 dark:text-slate-100";
  const taglineColor = theme === "dark" ? "text-slate-400" : "text-slate-500 dark:text-slate-400";

  return (
    <div className={`flex flex-col ${className ?? ""}`}>
      <p className={`font-bold leading-none tracking-tight ${nameColor} ${NAME_SIZE[size]}`}>MediaWatch</p>
      {showTagline && <p className={`mt-1.5 text-xs ${taglineColor}`}>Social Media & News Monitoring Platform</p>}
    </div>
  );
}
