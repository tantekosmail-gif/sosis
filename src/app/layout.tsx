import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "./providers";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MediaWatch",
  description: "AI-Powered Social Media & News Monitoring Platform",
};

const THEME_INIT_SCRIPT = `
(function() {
  try {
    var raw = localStorage.getItem("app_settings");
    var theme = raw ? JSON.parse(raw).theme : "light";
    if (theme === "dark") document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-slate-50 dark:bg-slate-950 antialiased`}
      >
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
