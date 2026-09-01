"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

/* ── Theme toggle ──────────────────────────────────────────── */
function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // The server already applied the saved theme class (from the `theme`
    // cookie). Only fall back to the system preference when neither class
    // is present, i.e. the visitor has never toggled.
    const root = document.documentElement;
    const resolved: "light" | "dark" = root.classList.contains("dark")
      ? "dark"
      : root.classList.contains("light")
        ? "light"
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    setTheme(resolved);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(next);
    // Cookie (not localStorage) so the server can render the right class on
    // the next request — that's what keeps the first paint flash-free.
    document.cookie = `theme=${next};path=/;max-age=31536000;samesite=lax`;
  };

  return { theme, toggle };
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] active:scale-95 transition-all duration-150"
    >
      {theme === "dark" ? (
        /* Sun icon */
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        /* Moon icon */
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

/* ── Navbar ────────────────────────────────────────────────── */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const links = [
    { href: "/#about",  label: "About"  },
    { href: "/events",  label: "Events" },
    { href: "/#faq",    label: "FAQ"    },
  ];

  const isLinkActive = (href: string) => {
    if (href.startsWith("/#")) {
      return pathname === "/" && typeof window !== "undefined" && window.location.hash === href.substring(1);
    }
    return pathname === href;
  };

  return (
    <>
      <nav
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[var(--background)]/90 backdrop-blur-lg border-b border-[var(--border)] shadow-[var(--shadow-sm)]"
            : "bg-transparent",
        ].join(" ")}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group"
              aria-label="Everest Hack Club — home"
            >
              <div className="w-8 h-8 flex-shrink-0">
                <Image
                  src="/Image/logo2.svg"
                  alt=""
                  width={32}
                  height={32}
                  className="group-hover:rotate-12 transition-transform duration-300 object-contain"
                />
              </div>
              <span className="font-bold text-base text-[var(--text-primary)] leading-tight">
                Everest{" "}
                <span style={{ color: "var(--red)" }}>Hack Club</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {links.map((l) => {
                const active = isLinkActive(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={[
                      "relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                      active
                        ? "text-[var(--text-primary)] bg-[var(--surface-2)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-1)]",
                    ].join(" ")}
                  >
                    {l.label}
                    {active && (
                      <span
                        className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                        style={{ background: "var(--red)" }}
                      />
                    )}
                  </Link>
                );
              })}
              <div className="w-[1px] h-4 bg-[var(--border)] mx-2" />
              <ThemeToggle />
              <Link
                href="/contact"
                className={[
                  "ml-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-150 active:scale-95",
                  pathname === "/contact"
                    ? "bg-[var(--red)] text-white"
                    : "bg-[var(--text-primary)] text-[var(--text-invert)] hover:opacity-90",
                ].join(" ")}
              >
                Contact
              </Link>
            </div>

            {/* Mobile: theme toggle + hamburger */}
            <div className="md:hidden flex items-center gap-1.5">
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-all"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  {isOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-black/10 dark:bg-black/40 backdrop-blur-sm animate-fade-in" />
        </div>
      )}

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        className={[
          "fixed top-16 left-0 right-0 z-40 md:hidden transition-all duration-200 origin-top",
          isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-95 pointer-events-none",
        ].join(" ")}
        aria-hidden={!isOpen}
      >
        <div className="mx-4 mt-1 bg-[var(--background)] rounded-2xl border border-[var(--border)] shadow-[var(--shadow-lg)] overflow-hidden">
          <div className="p-3 space-y-0.5">
            {links.map((l) => {
              const active = isLinkActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setIsOpen(false)}
                  className={[
                    "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    active
                      ? "text-[var(--text-primary)] bg-[var(--surface-2)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-1)]",
                  ].join(" ")}
                >
                  {l.label}
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--red)" }} />
                  )}
                </Link>
              );
            })}
          </div>
          <div className="px-3 pb-3">
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center w-full px-4 py-3 text-sm font-semibold rounded-xl bg-[var(--text-primary)] text-[var(--text-invert)] hover:opacity-90 transition-opacity"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
