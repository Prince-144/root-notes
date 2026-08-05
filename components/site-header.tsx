"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { mainNav, siteConfig } from "@/site.config";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="container-page flex h-14 items-center justify-between gap-4">
        {/* Wordmark — terminal prompt style */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-mono text-sm tracking-[0.18em] text-fg transition-colors hover:text-accent"
          onClick={() => setOpen(false)}
        >
          <span className="text-accent" aria-hidden>
            &gt;
          </span>
          <span className="font-medium uppercase">{siteConfig.name}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {mainNav.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded px-2.5 py-1.5 font-mono text-xs tracking-wider transition-colors ${
                  active ? "text-accent" : "text-fg-muted hover:text-fg"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/search"
            aria-label="Search"
            className="grid size-8 place-items-center rounded border border-transparent text-fg-subtle transition-colors hover:border-line hover:text-accent"
          >
            <Search className="size-4" strokeWidth={1.75} />
          </Link>
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid size-8 place-items-center rounded border border-transparent text-fg-subtle transition-colors hover:border-line hover:text-accent md:hidden"
          >
            {open ? (
              <X className="size-4" strokeWidth={1.75} />
            ) : (
              <Menu className="size-4" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav
          className="border-t border-line bg-panel md:hidden"
          aria-label="Mobile"
        >
          <ul className="container-page divide-y divide-line py-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 py-3 font-mono text-sm text-fg-muted transition-colors hover:text-accent"
                >
                  <span className="text-accent/60" aria-hidden>
                    ./
                  </span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
