import Link from "next/link";
import { Github, Linkedin, Rss, Twitter } from "lucide-react";
import { footerNav, siteConfig } from "@/site.config";

const socials = [
  { name: "X", href: siteConfig.social.twitter, Icon: Twitter },
  { name: "LinkedIn", href: siteConfig.social.linkedin, Icon: Linkedin },
  { name: "GitHub", href: siteConfig.social.github, Icon: Github },
  { name: "RSS", href: siteConfig.social.rss, Icon: Rss },
];

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
            <div className="mt-5 flex gap-1">
              {socials.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={name}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
                  className="grid size-8 place-items-center rounded border border-line text-fg-subtle transition-colors hover:border-accent hover:text-accent"
                >
                  <Icon className="size-3.5" strokeWidth={1.75} />
                </a>
              ))}
            </div>
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
