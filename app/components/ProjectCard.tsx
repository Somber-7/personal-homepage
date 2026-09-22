import Link from "next/link";
import type { Project } from "@/lib/portfolio";
import { Tag } from "./ui";

// 대표 이미지. 이미지가 없는 프로젝트는 부르는 쪽에서 이미지 칸 자체를 두지 않는다
export function ProjectCover({ project, large = false }: { project: Project; large?: boolean }) {
  if (!project.image) return null;
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

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="card-lift group h-full p-5 rounded-lg flex flex-col gap-3 overflow-hidden"
      style={{ background: "var(--background)", border: "1px solid var(--border)" }}
    >
      {project.image && (
        <div className="-mx-5 -mt-5 mb-1 aspect-video overflow-hidden" style={{ borderBottom: "1px solid var(--border)", background: "var(--surface2)" }}>
          <ProjectCover project={project} />
        </div>
      )}
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
