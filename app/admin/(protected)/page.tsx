import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [expCount, eduCount, projCount, skillCount, certCount] = await Promise.all([
    prisma.experience.count(),
    prisma.education.count(),
    prisma.project.count(),
    prisma.skill.count(),
    prisma.certification.count(),
  ]);

  const stats = [
    { label: "경력", count: expCount, href: "/admin/experiences", color: "var(--accent)" },
    { label: "교육", count: eduCount, href: "/admin/educations", color: "#1d4ed8" },
    { label: "프로젝트", count: projCount, href: "/admin/projects", color: "var(--accent-green)" },
    { label: "기술 스택", count: skillCount, href: "/admin/skills", color: "#6d28d9" },
    { label: "자격증", count: certCount, href: "/admin/certifications", color: "#a16207" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--foreground)" }}>
        대시보드
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
        포트폴리오 데이터를 관리합니다.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="p-6 rounded-xl text-center transition-colors hover:border-[var(--accent)]"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-3xl font-bold mb-1" style={{ color: s.color }}>
              {s.count}
            </p>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              {s.label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
