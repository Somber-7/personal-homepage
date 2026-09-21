import type { Metadata } from "next";
import { pageMeta } from "@/lib/site-meta";
import { getProjects, groupByOrg } from "@/lib/portfolio";
import ProjectCard from "../../components/ProjectCard";
import { PageHeader } from "../../components/ui";

export const metadata: Metadata = pageMeta("프로젝트 | 임준", "회사 실무, AI 캠프, 개인 작업으로 진행한 프로젝트를 소속별로 모았습니다.", "/projects");

export default async function ProjectsPage() {
  const projects = await getProjects();
  const groups = groupByOrg(projects);

  return (
    <>
      <PageHeader
        title="프로젝트"
        desc={`${projects.length}건 · 소속 ${groups.length}곳`}
      />

      {/* 소속 바로가기 */}
      <div className="sticky top-16 z-40 px-6 py-3" style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-5xl mx-auto flex gap-2 overflow-x-auto">
          {groups.map((g, i) => (
            <a
              key={g.org}
              href={`#org-${i}`}
              className="flex-shrink-0 text-sm px-3 py-1.5 rounded-md transition-colors duration-200 hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
              style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
            >
              {g.org} <span className="font-mono">{g.items.length}</span>
            </a>
          ))}
        </div>
      </div>

      <section className="pt-12 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          {groups.map((g, gi) => (
            <div key={g.org} id={`org-${gi}`} className="pt-12 scroll-mt-32">
              <h2 className="flex items-baseline gap-2 mb-6 pb-3 text-2xl font-semibold" style={{ color: "var(--foreground)", borderBottom: "1px solid var(--foreground)" }}>
                {g.org}
                <span className="text-sm font-normal" style={{ color: "var(--muted)" }}>{g.items.length}건</span>
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {g.items.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
