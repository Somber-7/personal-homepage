"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/#experience", label: "경력" },
  { href: "/projects", label: "프로젝트" },
  { href: "/#skills", label: "기술" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 홈 안의 위치(/#...)는 따로 표시하지 않고, 프로젝트 페이지만 표시한다
  const isActive = (href: string) => !href.includes("#") && pathname.startsWith(href);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled || menuOpen ? "rgba(255,255,255,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      }}
    >
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight" style={{ color: "var(--foreground)" }}>
          임준
        </Link>
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="nav-link text-sm transition-colors duration-200 hover:text-[var(--foreground)]"
                data-active={isActive(link.href) || undefined}
                style={{ color: isActive(link.href) ? "var(--foreground)" : "var(--muted)" }}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="text-sm px-4 py-1.5 rounded-md transition-opacity duration-200 hover:opacity-85"
              style={{ background: "var(--foreground)", color: "var(--background)" }}
            >
              연락하기
            </a>
          </li>
        </ul>
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="메뉴"
          aria-expanded={menuOpen}
        >
          {[0, 1, 2].map((i) => (
            <span key={i} className="block w-5 h-0.5" style={{ background: "var(--foreground)" }} />
          ))}
        </button>
      </nav>
      {menuOpen && (
        <div className="md:hidden px-6 pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
          {[...NAV_LINKS, { href: "#contact", label: "연락하기" }].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm"
              style={{ color: isActive(link.href) ? "var(--foreground)" : "var(--muted)" }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
