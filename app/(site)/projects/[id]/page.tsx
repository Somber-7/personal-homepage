import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects } from "@/lib/portfolio";
import Reveal from "../../../components/Reveal";
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
  const found = await findProject((await params).id);
  return { title: found ? `${found.project.title} | 임준` : "프로젝트 | 임준", description: found?.project.desc.slice(0, 120) };
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
  ];

  return (
    <article className="px-6 pt-28 pb-24">
      <div className="max-w-5xl mx-auto">
        <Link href="/projects" className="hero-in group inline-flex items-center gap-1 text-sm" style={{ color: "var(--muted)" }}>
          <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> 프로젝트 목록
        </Link>

        <div className="mt-6">
          <span className="hero-in inline-block text-xs font-mono px-2.5 py-1 rounded-full" style={{ background: "rgba(63,185,80,0.12)", color: "var(--accent-green)", border: "1px solid rgba(63,185,80,0.3)", ...d(60) }}>
            {project.org || "기타"}
          </span>
          <h1 className="hero-in text-3xl md:text-4xl font-bold mt-4 tracking-tight leading-tight" style={{ color: "var(--foreground)", ...d(120) }}>
            {project.title}
          </h1>
          <p className="hero-in mt-3 text-sm font-mono" style={{ color: "var(--accent)", ...d(180) }}>
            {project.client} · {project.period}
          </p>
        </div>

        <div className={`hero-in group mt-10 overflow-hidden rounded-2xl ${project.image ? "aspect-video" : "h-40 md:h-48"}`} style={{ border: "1px solid var(--border)", background: "var(--surface2)", ...d(260) }}>
          <ProjectCover project={project} large />
        </div>

        <div className="mt-14 grid md:grid-cols-[1fr_280px] gap-12">
          <Reveal>
            <h2 className="text-xs font-mono tracking-widest mb-4" style={{ color: "var(--accent)" }}>OVERVIEW ──</h2>
            <p className="text-base leading-loose whitespace-pre-line" style={{ color: "var(--foreground)" }}>{project.desc}</p>
          </Reveal>
          <Reveal delay={120}>
            <dl className="p-6 rounded-xl space-y-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-xs font-mono mb-1" style={{ color: "var(--muted)" }}>{f.label}</dt>
                  <dd className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>{f.value}</dd>
                </div>
              ))}
              <div>
                <dt className="text-xs font-mono mb-2" style={{ color: "var(--muted)" }}>기술</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <Tag key={tag} variant="accent">{tag}</Tag>
                  ))}
                </dd>
              </div>
            </dl>
          </Reveal>
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
    <Reveal className="h-full">
      <Link
        href={`/projects/${project.id}`}
        className={`card-lift group h-full p-5 rounded-xl flex flex-col gap-1 ${isNext ? "text-right" : ""}`}
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>
          {isNext ? "다음 프로젝트 →" : "← 이전 프로젝트"}
        </span>
        <span className="text-sm font-semibold transition-colors group-hover:text-[var(--accent)]" style={{ color: "var(--foreground)" }}>
          {project.title}
        </span>
        <span className="text-xs" style={{ color: "var(--muted)" }}>{project.org}</span>
      </Link>
    </Reveal>
  );
}
