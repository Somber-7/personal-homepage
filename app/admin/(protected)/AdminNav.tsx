"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const MENUS = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/experiences", label: "경력" },
  { href: "/admin/educations", label: "교육" },
  { href: "/admin/projects", label: "프로젝트" },
  { href: "/admin/skills", label: "기술 스택" },
  { href: "/admin/certifications", label: "자격증" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "rgba(255,255,255,0.95)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          <span className="font-mono text-sm mr-3 flex-shrink-0" style={{ color: "var(--accent)" }}>
            Admin
          </span>
          {MENUS.map((m) => {
            // 수정 페이지(/admin/projects/3 등)에서도 해당 메뉴를 켠다
            const active = m.href === "/admin" ? pathname === "/admin" : pathname.startsWith(m.href);
            return (
              <Link
                key={m.href}
                href={m.href}
                className="px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 transition-colors duration-150"
                style={{
                  background: active ? "var(--surface2)" : "transparent",
                  color: active ? "var(--foreground)" : "var(--muted)",
                }}
              >
                {m.label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link href="/" className="text-xs hover:text-[var(--accent)]" style={{ color: "var(--muted)" }}>
            홈으로
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="text-xs px-3 py-1.5 rounded-lg transition-colors"
            style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
}
