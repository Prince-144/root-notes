/**
 * Single source of truth for site identity.
 * Change the name here and it updates everywhere: header, footer,
 * page titles, OG tags, RSS feed, newsletter emails.
 */

export const siteConfig = {
  name: "Root Notes",
  shortName: "RN",
  tagline: "Breaches, patches and the infrastructure underneath — in five minutes.",
  description:
    "Daily security and infrastructure reporting: vulnerabilities, breaches, supply-chain attacks and the tooling that holds it together. Every post explains why it matters before it explains what happened.",
  url: "https://rootnotes.in",
  locale: "en_US",
  author: "Prince Baruwala",
  contactEmail: "hello@rootnotes.in",
  // GA4 measurement ID — not secret, it's embedded in every page's HTML anyway.
  googleAnalyticsId: "G-WNY1HWKZPT",
} as const;

export type Category = {
  name: string;
  slug: string;
  /** CSS custom property from globals.css @theme — drives the tag chip colour */
  color: string;
  description: string;
};

// Slugs are load-bearing (lib/articles.ts references them) — reorder freely,
// but changing a slug means updating the sample data too.
export const categories: Category[] = [
  {
    name: "Security",
    slug: "security",
    color: "var(--color-sig-indigo)",
    description: "Breaches, vulnerabilities, malware and the patches that matter.",
  },
  {
    name: "AI",
    slug: "ai",
    color: "var(--color-sig-violet)",
    description: "Models, agents and the new attack surface they create.",
  },
  {
    name: "Startups",
    slug: "startups",
    color: "var(--color-sig-green)",
    description: "Funding, launches, shutdowns and the people behind them.",
  },
  {
    name: "Gadgets",
    slug: "gadgets",
    color: "var(--color-sig-amber)",
    description: "Hardware, firmware and the devices worth trusting.",
  },
  {
    name: "World",
    slug: "world",
    color: "var(--color-sig-cyan)",
    description: "Regulation, policy and global stories with the context you need.",
  },
];

/** Look up a category by slug, with a safe fallback. */
export function getCategory(slug: string): Category {
  return (
    categories.find((c) => c.slug === slug) ?? {
      name: slug,
      slug,
      color: "var(--color-shell-300)",
      description: "",
    }
  );
}

export const mainNav = [
  { name: "Home", href: "/" },
  ...categories.map((c) => ({ name: c.name, href: `/category/${c.slug}` })),
];

export const footerNav = {
  Sections: categories.map((c) => ({ name: c.name, href: `/category/${c.slug}` })),
  Company: [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Advertise", href: "/advertise" },
    { name: "Write for us", href: "/contribute" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Use", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
  ],
};
