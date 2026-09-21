import Link from "next/link";
import type { Project } from "@/lib/portfolio";
import { Tag } from "./ui";

// 이미지가 없을 때 쓰는 기본 헤더
export function ProjectCover({ project, large = false }: { project: Project; large?: boolean }) {
  if (project.image) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={project.image}
        alt={project.title}
        loading={large ? "eager" : "lazy"}
        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
      />
    );
  }
  return (
    <div
      className={`w-full h-full flex flex-col justify-between ${large ? "p-8" : "p-4"}`}
      style={{ background: "radial-gradient(120% 90% at 100% 0%, rgba(88,166,255,0.16), transparent 60%), var(--surface2)" }}
    >
      <span className={`font-mono font-bold ${large ? "text-5xl" : "text-2xl"}`} style={{ color: "var(--accent)", opacity: 0.55 }}>
        &lt;/&gt;
      </span>
      <span className={`font-mono leading-relaxed ${large ? "text-sm" : "text-xs"}`} style={{ color: "var(--muted)" }}>
        {project.tags.slice(0, 3).join(" · ")}
      </span>
    </div>
  );
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="card-lift group h-full p-5 rounded-xl flex flex-col gap-3 overflow-hidden"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div className="-mx-5 -mt-5 mb-1 aspect-video overflow-hidden" style={{ borderBottom: "1px solid var(--border)", background: "var(--surface2)" }}>
        <ProjectCover project={project} />
      </div>
      <div>
        <h3 className="font-semibold text-sm leading-snug mb-1 transition-colors group-hover:text-[var(--accent)]" style={{ color: "var(--foreground)" }}>
          {project.title}
        </h3>
        <p className="text-xs font-mono" style={{ color: "var(--accent)" }}>
          {[project.client, project.period].filter(Boolean).join(" · ")}
        </p>
      </div>
      <p className="text-xs leading-relaxed flex-1 line-clamp-3" style={{ color: "var(--muted)" }}>{project.desc}</p>
      <div className="flex flex-wrap gap-1.5">
        {project.tags.slice(0, 4).map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
        {project.tags.length > 4 && <Tag>{`+${project.tags.length - 4}`}</Tag>}
      </div>
      <span className="text-xs font-medium mt-1 inline-flex items-center gap-1" style={{ color: "var(--accent)" }}>
        자세히 보기 <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}
