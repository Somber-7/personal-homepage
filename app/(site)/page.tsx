import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { getCertifications, getEducations, getExperiences, getProjects, getSkills, groupByOrg, type Project } from "@/lib/portfolio";
import { AWARDS, CAREER_GAP, PROFILE, STATS, STRENGTHS } from "@/lib/profile";
import Bullets from "../components/Bullets";
import { ProjectCover } from "../components/ProjectCard";
import { Tag } from "../components/ui";

// 홈은 한 페이지 이력서: 머리 → 핵심 역량 → 경력 → 교육 → 대표 프로젝트 → 기술 → 자격증·수상 (연락처는 공통 푸터)
export default async function Home() {
  const [experiences, educations, projects, skills, certifications] = await Promise.all([
    getExperiences(),
    getEducations(),
    getProjects(),
    getSkills(),
    getCertifications(),
  ]);
  // 소속마다 가장 최근 프로젝트(기간 문자열 "YYYY.MM"이 가장 늦은 것)를 하나씩
  const featured = groupByOrg(projects)
    .map((g) => g.items.reduce((a, b) => (b.period > a.period ? b : a)))
    .slice(0, 3);

  return (
    <>
      <Hero />

      <Section id="strengths" title="핵심 역량">
        <div className="grid md:grid-cols-3 gap-4 pt-8">
          {STRENGTHS.map((s) => (
            <div key={s.title} className="p-5 rounded-lg" style={{ background: "var(--surface)" }}>
              <h3 className="text-base font-bold" style={{ color: "var(--foreground)" }}>{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="experience" title="경력" aside="총 5년 4개월">
        {/* 회사 경력과 공백 기간을 시작 시점 최신순으로 */}
        {[
          ...experiences.map((e) => ({ key: `e${e.id}`, period: e.period, duration: e.duration, title: e.company, sub: e.role, body: e.desc, tags: e.tags, current: e.isCurrent })),
          { key: "gap", ...CAREER_GAP, sub: "", body: CAREER_GAP.desc, tags: [] as string[], current: false },
        ]
          .sort((a, b) => b.period.localeCompare(a.period))
          .map(({ key, ...e }) => <Entry key={key} {...e} />)}
      </Section>

      <Section id="education" title="교육 · 학력">
        {educations.map((e) => (
          <Entry key={e.id} period={e.period} duration={e.duration} title={e.name} sub={e.course} body={e.desc} tags={e.tags} />
        ))}
      </Section>

      <Section
        id="projects"
        title="대표 프로젝트"
        aside={<MoreLink href="/projects">프로젝트 전체 {projects.length}건</MoreLink>}
      >
        <div className="pt-8 space-y-4">
          {featured.map((p) => (
            <FeaturedProject key={p.id} project={p} />
          ))}
        </div>
      </Section>

      <Section id="skills" title="기술">
        {/* isLearning이 켜진 분야는 AI 캠프·개인 프로젝트에서 쓴 기술, 꺼진 분야는 실무에서 운영한 기술 */}
        <div className="grid md:grid-cols-2 gap-x-12">
          {[
            { title: "실무", groups: skills.filter((g) => !g.isLearning) },
            { title: "AI 캠프 · 개인 프로젝트", groups: skills.filter((g) => g.isLearning) },
          ].map((col) => (
            <div key={col.title} className="pt-8">
              <h3 className="text-base font-bold mb-2" style={{ color: "var(--foreground)" }}>{col.title}</h3>
              <dl>
                {col.groups.map((g) => (
                  <div key={g.id} className="py-3 grid grid-cols-[112px_1fr] gap-3" style={{ borderBottom: "1px solid var(--border)" }}>
                    <dt className="text-sm font-semibold pt-0.5" style={{ color: "var(--foreground)" }}>{g.category}</dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {g.items.map((t) => <Tag key={t}>{t}</Tag>)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </Section>

      <Section id="certifications" title="자격증 · 수상">
        <div className="grid md:grid-cols-2 gap-x-12">
          <ItemList title="자격증" rows={certifications.map((c) => ({ key: `c${c.id}`, year: c.year, name: c.name, org: c.org }))} />
          <ItemList title="수상" rows={AWARDS.map((a, i) => ({ key: `a${i}`, year: a.year, name: a.name, org: a.org }))} />
        </div>
      </Section>
    </>
  );
}

function Hero() {
  const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
  const contacts = [
    { label: "이메일", value: PROFILE.email, href: `mailto:${PROFILE.email}` },
    { label: "GitHub", value: PROFILE.github.replace("https://", ""), href: PROFILE.github },
  ];
  return (
    <section className="px-6 pt-36 pb-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="hero-in text-4xl md:text-6xl font-bold leading-tight" style={{ color: "var(--foreground)" }}>
          {PROFILE.title} {PROFILE.name}
        </h1>
        <p className="hero-in mt-4 text-lg" style={{ color: "var(--muted)", ...d(80) }}>{PROFILE.summary}</p>
        <ul className="hero-in mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm" style={d(160)}>
          {contacts.map((c) => (
            <li key={c.label}>
              <span style={{ color: "var(--muted)" }}>{c.label}</span>{" "}
              <a
                href={c.href}
                {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="font-medium underline decoration-1 underline-offset-4 hover:text-[var(--accent)]"
                style={{ color: "var(--foreground)", textDecorationColor: "var(--border)" }}
              >
                {c.value}
              </a>
            </li>
          ))}
        </ul>
        <div className="hero-in mt-8 flex gap-3 flex-wrap" style={d(240)}>
          <a
            href={PROFILE.pdf}
            download={PROFILE.pdfName}
            className="px-5 py-2.5 rounded-md font-semibold text-sm transition-opacity duration-200 hover:opacity-85"
            style={{ background: "var(--foreground)", color: "var(--background)" }}
          >
            경력기술서 PDF
          </a>
          <Link
            href="/projects"
            className="px-5 py-2.5 rounded-md font-semibold text-sm transition-colors duration-200 hover:bg-[var(--surface)]"
            style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
          >
            프로젝트 전체
          </Link>
        </div>
        {/* 칸 사이 1px 틈으로 비치는 바탕색이 구분선이 된다 */}
        <dl className="hero-in grid grid-cols-2 lg:grid-cols-4 gap-px mt-12 rounded-lg overflow-hidden" style={{ background: "var(--border)", border: "1px solid var(--border)", ...d(320) }}>
          {STATS.map((s) => (
            <div key={s.label} className="p-4 sm:p-6 flex flex-col" style={{ background: "var(--background)" }}>
              <dt className="order-2 mt-2 text-sm font-semibold" style={{ color: "var(--foreground)" }}>{s.label}</dt>
              <dd className="order-1 text-xl sm:text-3xl font-bold tracking-tight whitespace-nowrap" style={{ color: "var(--foreground)" }}>{s.value}</dd>
              <dd className="order-3 mt-0.5 text-xs" style={{ color: "var(--muted)" }}>{s.sub}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

// 제목 줄(굵은 밑줄) + 내용
function Section({ id, title, aside, children }: { id: string; title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="px-6 py-14">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-baseline justify-between gap-4 pb-4" style={{ borderBottom: "2px solid var(--foreground)" }}>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--foreground)" }}>{title}</h2>
          {typeof aside === "string" ? <span className="text-sm" style={{ color: "var(--muted)" }}>{aside}</span> : aside}
        </div>
        {children}
      </div>
    </section>
  );
}

// 경력·교육 한 건: 왼쪽 기간, 오른쪽 내용
function Entry({ period, duration, title, sub, body, tags, current }: {
  period: string; duration: string; title: string; sub: string; body: string; tags: string[]; current?: boolean;
}) {
  return (
    <article className="py-8 grid md:grid-cols-[180px_1fr] gap-3 md:gap-10" style={{ borderBottom: "1px solid var(--border)" }}>
      <div>
        <p className="text-sm font-mono" style={{ color: "var(--foreground)" }}>{period}</p>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          {duration}
          {current && <span style={{ color: "var(--accent)" }}> · 현재</span>}
        </p>
      </div>
      <div>
        <h3 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>{title}</h3>
        {sub && <p className="mt-1 text-base font-medium" style={{ color: "var(--accent)" }}>{sub}</p>}
        <Bullets text={body} className="mt-4 text-[15px]" />
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tags.map((t) => <Tag key={t}>{t}</Tag>)}
          </div>
        )}
      </div>
    </article>
  );
}

function FeaturedProject({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="card-lift group grid md:grid-cols-[280px_1fr] gap-5 p-4 rounded-lg"
      style={{ border: "1px solid var(--border)" }}
    >
      <div className="aspect-video overflow-hidden rounded" style={{ background: "var(--surface2)" }}>
        <ProjectCover project={project} />
      </div>
      <div className="flex flex-col gap-2 min-w-0">
        <span className="text-sm" style={{ color: "var(--accent)" }}>{project.org}</span>
        <h3 className="text-xl font-bold leading-snug transition-colors group-hover:text-[var(--accent)]" style={{ color: "var(--foreground)" }}>
          {project.title}
        </h3>
        <p className="text-sm" style={{ color: "var(--muted)" }}>{[project.client, project.period].filter(Boolean).join(" · ")}</p>
        <p className="text-[15px] leading-relaxed line-clamp-2" style={{ color: "var(--muted)" }}>{project.desc}</p>
        <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
          {project.tags.slice(0, 5).map((t) => <Tag key={t}>{t}</Tag>)}
        </div>
      </div>
    </Link>
  );
}

function ItemList({ title, rows }: { title: string; rows: { key: string; year: string; name: string; org: string }[] }) {
  return (
    <div className="pt-8">
      <h3 className="text-base font-bold mb-2" style={{ color: "var(--foreground)" }}>{title}</h3>
      <ul>
        {rows.map((r) => (
          <li key={r.key} className="py-3 grid grid-cols-[72px_1fr] gap-x-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <span className="text-sm font-mono" style={{ color: "var(--muted)" }}>{r.year}</span>
            <span>
              <span className="text-[15px] font-medium" style={{ color: "var(--foreground)" }}>{r.name}</span>
              <span className="block text-sm" style={{ color: "var(--muted)" }}>{r.org}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MoreLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group text-sm inline-flex items-center gap-1 underline decoration-1 underline-offset-4"
      style={{ color: "var(--foreground)", textDecorationColor: "var(--muted)" }}
    >
      {children} <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
    </Link>
  );
}
