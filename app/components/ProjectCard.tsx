import Link from "next/link";
import type { Project } from "@/lib/portfolio";
import { Tag } from "./ui";

// 이미지가 없을 때 쓰는 글자 헤더: 제목을 되풀이하지 않고 발주처(구분에서 인원 표기는 뺌)와 기간을 보여 준다.
// small은 작은 썸네일용으로 시작 연도만 둔다
export function ProjectCover({ project, large = false, small = false }: { project: Project; large?: boolean; small?: boolean }) {
  if (project.image) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={project.image}
        alt={project.title}
        loading={large ? "eager" : "lazy"}
        className="w-full h-full object-cover object-top"
      />
    );
  }
  if (small) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ background: "var(--surface2)" }}>
        <span className="text-lg font-semibold" style={{ color: "var(--muted)" }}>{project.period.slice(0, 4)}</span>
      </div>
    );
  }
  const client = project.client.replace(/\s*\([^)]*\)\s*$/, "") || project.org;
  return (
    <div className={`w-full h-full flex flex-col justify-between ${large ? "p-8" : "p-5"}`} style={{ background: "var(--surface)" }}>
      <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>{project.period}</span>
      <span className={`font-bold leading-snug tracking-tight ${large ? "text-3xl" : "text-xl"}`} style={{ color: "var(--foreground)", opacity: 0.8 }}>
        {client}
      </span>
    </div>
  );
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="card-lift group h-full p-5 rounded-lg flex flex-col gap-3 overflow-hidden"
      style={{ background: "var(--background)", border: "1px solid var(--border)" }}
    >
      <div className="-mx-5 -mt-5 mb-1 aspect-video overflow-hidden" style={{ borderBottom: "1px solid var(--border)", background: "var(--surface2)" }}>
        <ProjectCover project={project} />
      </div>
      <div>
        <h3 className="font-semibold text-base leading-snug mb-1 transition-colors group-hover:text-[var(--accent)]" style={{ color: "var(--foreground)" }}>
          {project.title}
        </h3>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          {[project.client, project.period].filter(Boolean).join(" · ")}
        </p>
      </div>
      <p className="text-sm leading-relaxed flex-1 line-clamp-3" style={{ color: "var(--muted)" }}>{project.desc}</p>
      <div className="flex flex-wrap gap-1.5">
        {project.tags.slice(0, 4).map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
        {project.tags.length > 4 && <Tag>{`+${project.tags.length - 4}`}</Tag>}
      </div>
    </Link>
  );
}
