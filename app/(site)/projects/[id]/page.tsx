import type { Metadata } from "next";
import { pageMeta } from "@/lib/site-meta";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects } from "@/lib/portfolio";
import Bullets from "../../../components/Bullets";
import { ProjectCover } from "../../../components/ProjectCard";
import { Tag } from "../../../components/ui";

type Params = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ id: String(p.id) }));
}

async function findProject(id: string) {
  const projects = await getProjects();
  const index = projects.findIndex((p) => String(p.id) === id);
  if (index < 0) return null;
  return { project: projects[index], prev: projects[index - 1], next: projects[index + 1] };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const found = await findProject(id);
  if (!found) return { title: "프로젝트 | 임준" };
  const { project } = found;
  const desc = project.desc.length > 120 ? project.desc.slice(0, 118) + "…" : project.desc;
  return pageMeta(`${project.title} | 임준`, desc, `/projects/${id}`, project.image ? [project.image] : undefined);
}

export default async function ProjectDetailPage({ params }: Params) {
  const found = await findProject((await params).id);
  if (!found) notFound();
  const { project, prev, next } = found;
  const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

  const facts = [
    { label: "소속", value: project.org || "기타" },
    { label: "기간", value: project.period },
    { label: "구분", value: project.client },
    { label: "역할", value: project.role },
  ].filter((f) => f.value);

  // 상세 칸. 비어 있는 칸은 보여 주지 않는다
  const details = [
    { title: "맡은 일", text: project.work },
    { title: "구현과 문제 해결", text: project.solution },
    { title: "결과", text: project.result },
  ].filter((s) => s.text.trim());

  return (
    <article className="px-6 pt-28 pb-24">
      <div className="max-w-5xl mx-auto">
        <Link href="/projects" className="hero-in group inline-flex items-center gap-1 text-sm" style={{ color: "var(--muted)" }}>
          <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> 프로젝트 목록
        </Link>

        <div className="mt-6">
          <p className="hero-in text-sm" style={{ color: "var(--accent)", ...d(60) }}>
            {project.org || "기타"}
          </p>
          <h1 className="hero-in text-3xl md:text-5xl font-bold mt-3 leading-tight" style={{ color: "var(--foreground)", ...d(120) }}>
            {project.title}
          </h1>
          <p className="hero-in mt-4 text-base" style={{ color: "var(--muted)", ...d(180) }}>
            {[project.client, project.period].filter(Boolean).join(" · ")}
          </p>
          {(project.link || project.repo) && (
            <div className="hero-in mt-6 flex flex-wrap gap-3" style={d(220)}>
              {project.link && <ExternalButton href={project.link} primary>사이트 방문</ExternalButton>}
              {project.repo && <ExternalButton href={project.repo} primary={!project.link}>코드 보기</ExternalButton>}
            </div>
          )}
        </div>

        {project.image && (
          <div className="hero-in mt-10 overflow-hidden rounded-lg aspect-video" style={{ border: "1px solid var(--border)", background: "var(--surface2)", ...d(260) }}>
            <ProjectCover project={project} large />
          </div>
        )}

        <div className="mt-14 grid md:grid-cols-[1fr_280px] gap-12">
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>개요</h2>
              <p className="text-lg leading-loose whitespace-pre-line" style={{ color: "var(--foreground)" }}>{project.desc}</p>
            </section>
            {details.map((s) => (
              <section key={s.title}>
                <h2 className="text-xl font-bold pb-3 mb-4" style={{ color: "var(--foreground)", borderBottom: "1px solid var(--border)" }}>{s.title}</h2>
                <Bullets text={s.text} className="text-base" />
              </section>
            ))}
          </div>
          <div>
            <dl className="pt-5 space-y-5 md:sticky md:top-24" style={{ borderTop: "1px solid var(--foreground)" }}>
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-sm mb-1" style={{ color: "var(--muted)" }}>{f.label}</dt>
                  <dd className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>{f.value}</dd>
                </div>
              ))}
              <div>
                <dt className="text-sm mb-2" style={{ color: "var(--muted)" }}>기술</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <Tag key={tag} variant="accent">{tag}</Tag>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <nav className="mt-20 grid sm:grid-cols-2 gap-4" aria-label="이전·다음 프로젝트">
          {prev ? <Neighbor project={prev} dir="prev" /> : <span />}
          {next && <Neighbor project={next} dir="next" />}
        </nav>
      </div>
    </article>
  );
}

function Neighbor({ project, dir }: { project: { id: number; title: string; org: string }; dir: "prev" | "next" }) {
  const isNext = dir === "next";
  return (
    <Link
      href={`/projects/${project.id}`}
      className={`card-lift group h-full p-5 rounded-lg flex flex-col gap-1 ${isNext ? "text-right" : ""}`}
      style={{ background: "var(--background)", border: "1px solid var(--border)" }}
    >
      <span className="text-sm" style={{ color: "var(--muted)" }}>
        {isNext ? "다음 프로젝트 →" : "← 이전 프로젝트"}
      </span>
      <span className="text-base font-semibold transition-colors group-hover:text-[var(--accent)]" style={{ color: "var(--foreground)" }}>
        {project.title}
      </span>
      <span className="text-sm" style={{ color: "var(--muted)" }}>{project.org}</span>
    </Link>
  );
}

function ExternalButton({ href, primary, children }: { href: string; primary?: boolean; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md text-sm font-medium transition-opacity duration-200 hover:opacity-85"
      style={primary ? { background: "var(--foreground)", color: "var(--background)" } : { border: "1px solid var(--border)", color: "var(--foreground)" }}
    >
      {children} <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
    </a>
  );
}
