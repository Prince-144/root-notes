import Link from "next/link";
import { footerNav, siteConfig, socialLinks } from "@/site.config";

/**
 * Inline SVGs rather than an icon package: two glyphs is not worth a
 * dependency, and these inherit currentColor so they follow the chip's hover
 * state and both themes for free.
 */
const icons: Record<(typeof socialLinks)[number]["name"], React.ReactNode> = {
  Instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.4" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  ),
  RSS: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-4" aria-hidden>
      <circle cx="5.2" cy="18.8" r="1.7" fill="currentColor" stroke="none" />
      <path d="M4 11.2a8.8 8.8 0 0 1 8.8 8.8" />
      <path d="M4 4.2A15.8 15.8 0 0 1 19.8 20" />
    </svg>
  ),
};

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="container-page py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-sm tracking-[0.18em]">
              <span className="text-accent" aria-hidden>
                &gt;
              </span>
              <span className="font-medium uppercase text-fg">{siteConfig.name}</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-fg-subtle">
              {siteConfig.tagline}
            </p>

            {/* Icon only. The name is carried by aria-label and title rather
                than visible text — a screen reader still announces "Root Notes
                on Instagram", and a mouse user gets it on hover. */}
            <ul className="mt-5 flex flex-wrap items-center gap-2">
              {socialLinks.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    title={s.label}
                    {...(s.external
                      ? { target: "_blank", rel: "me noreferrer noopener" }
                      : {})}
                    className="inline-flex size-9 items-center justify-center rounded-sm border border-current text-fg-subtle transition-colors hover:border-accent hover:text-accent"
                  >
                    {icons[s.name]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {Object.entries(footerNav).map(([group, links]) => (
            <div key={group}>
              <h2 className="label-mono">{group}</h2>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-fg-muted transition-colors hover:text-accent"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 font-mono text-2xs tracking-wider text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[var(--color-sig-green)]" aria-hidden />
            ALL SYSTEMS OPERATIONAL
          </p>
        </div>
      </div>
    </footer>
  );
}
