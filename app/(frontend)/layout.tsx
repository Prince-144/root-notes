import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LiveBackground } from "@/components/live-background";
import { ScanTerminal } from "@/components/scan-terminal";
import { siteConfig } from "@/site.config";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans-ui",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-ui",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": `${siteConfig.url}/rss.xml` },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0d111a" },
    { media: "(prefers-color-scheme: light)", color: "#f7f8fa" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${mono.variable}`}>
      <body className="min-h-dvh flex flex-col">
        <ThemeProvider>
          <LiveBackground />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-accent focus:text-accent-fg focus:px-3 focus:py-2 focus:rounded font-mono text-xs"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <ScanTerminal />
        </ThemeProvider>
      </body>
    </html>
  );
}
