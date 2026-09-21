import type { Metadata } from "next";
import { getProjects, groupByOrg } from "@/lib/portfolio";
import Reveal from "../../components/Reveal";
import ProjectCard from "../../components/ProjectCard";
import { PageHeader } from "../../components/ui";

export const metadata: Metadata = { title: "프로젝트 | 임준" };

export default async function ProjectsPage() {
  const projects = await getProjects();
  const groups = groupByOrg(projects);

  return (
    <>
      <PageHeader
        label="03 ── PROJECTS"
        title="프로젝트"
        desc={`회사 실무와 AI 캠프, 개인 작업을 합쳐 ${projects.length}건입니다. 카드를 누르면 자세한 내용을 볼 수 있습니다.`}
      />

      {/* 소속 바로가기 */}
      <div className="sticky top-16 z-40 px-6 py-3" style={{ background: "rgba(13,17,23,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-5xl mx-auto flex gap-2 overflow-x-auto">
          {groups.map((g, i) => (
            <a
              key={g.org}
              href={`#org-${i}`}
              className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--foreground)]"
              style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
            >
              {g.org} <span className="font-mono" style={{ color: "var(--accent)" }}>{g.items.length}</span>
            </a>
          ))}
        </div>
      </div>

      <section className="pt-12 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          {groups.map((g, gi) => (
            <div key={g.org} id={`org-${gi}`} className="pt-12 scroll-mt-32">
              <Reveal>
                <h2 className="flex items-center gap-2 mb-5 text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                  <span style={{ color: "var(--accent-green)" }}>▸</span>
                  {g.org}
                  <span className="text-xs font-mono font-normal" style={{ color: "var(--muted)" }}>· {g.items.length}</span>
                </h2>
              </Reveal>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {g.items.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 3) * 90} className="h-full">
                    <ProjectCard project={p} />
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
