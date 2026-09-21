import Link from "next/link";
import type { CSSProperties } from "react";
import { getCertifications, getEducations, getExperiences, getProjects, getSkills, groupByOrg, type Project } from "@/lib/portfolio";
import Reveal from "../components/Reveal";
import CountUp from "../components/CountUp";
import { ProjectCover } from "../components/ProjectCard";
import { SectionTitle, Tag } from "../components/ui";

// 홈은 한 화면(data-screen)씩 넘어간다: app/components/FullPage.tsx
const STATS = [
  { value: "5년 4개월", label: "웹 개발 경력", sub: "공공 SI · 웹에이전시" },
  { value: "200개 이상", label: "구축 · 유지보수 사이트", sub: "웹에이전시 프로그램파트" },
  { value: "5회", label: "팀 프로젝트 PM", sub: "AI 캠프 전 프로젝트" },
  { value: "최우수상", label: "AI 캠프 최종 프로젝트", sub: "halil 에이전트 플랫폼" },
];

export default async function Home() {
  const [experiences, educations, projects, skills, certifications] = await Promise.all([
    getExperiences(),
    getEducations(),
    getProjects(),
    getSkills(),
    getCertifications(),
  ]);
  const groups = groupByOrg(projects);
  // 소속마다 가장 최근 프로젝트(기간 문자열 "YYYY.MM"이 가장 늦은 것)를 하나씩 골라 폭을 보여 준다
  const featured = groups
    .map((g) => g.items.reduce((a, b) => (b.period > a.period ? b : a)))
    .slice(0, 3);

  // 경력 흐름: 회사 경력과 교육을 시작 시점 순으로
  const flow = [
    ...experiences.map((e) => ({ key: `e${e.id}`, period: e.period, duration: e.duration, title: e.company, sub: e.role, tags: e.tags })),
    ...educations.map((e) => ({ key: `d${e.id}`, period: e.period, duration: e.duration, title: e.name, sub: e.course, tags: e.tags })),
  ].sort((a, b) => a.period.localeCompare(b.period));

  const pages = [
    { href: "/about", label: "소개", title: "어떤 개발자인가", meta: `기술 ${skills.length}개 분야 · 자격증 ${certifications.length}개` },
    { href: "/career", label: "경력", title: "어디서 일했나", meta: `경력 ${experiences.length}곳 · 교육 ${educations.length}개` },
    { href: "/projects", label: "프로젝트", title: "무엇을 만들었나", meta: `프로젝트 ${projects.length}건 · 소속 ${groups.length}곳` },
  ];

  const [lead, ...rest] = featured;

  return (
    <>
      <Hero />

      {/* 2. 한눈에 */}
      <section className="screen py-24 px-6" data-screen="한눈에" style={{ background: "var(--surface)" }}>
        <div className="max-w-5xl mx-auto w-full">
          <SectionTitle label="AT A GLANCE" title="한눈에 보기" />
          <Reveal delay={80}>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
              공공 SI와 웹에이전시에서 5년 넘게 <span style={{ color: "var(--foreground)" }}>웹 백엔드를 만들고 운영</span>했고,
              6개월 AI 과정을 마치며 <span style={{ color: "var(--foreground)" }}>LLM과 에이전트를 실제 서비스에 붙이는 일</span>로 영역을 넓혔습니다.
            </p>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={120 + i * 90} className="h-full">
                <div className="card-lift h-full p-7 rounded-2xl" style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
                  <p className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: "var(--accent)" }}>
                    <CountUp text={s.value} />
                  </p>
                  <p className="mt-3 text-sm font-semibold" style={{ color: "var(--foreground)" }}>{s.label}</p>
                  <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>{s.sub}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. 경력 흐름 */}
      <section className="screen py-24 px-6" data-screen="경력 흐름">
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <SectionTitle label="CAREER" title="경력 흐름" desc="공공 SI에서 웹에이전시, 그리고 AI까지" />
            <Reveal>
              <Link href="/career" className="group text-sm inline-flex items-center gap-1" style={{ color: "var(--accent)" }}>
                경력 자세히 보기 <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </Reveal>
          </div>
          <div className="relative mt-16">
            <Reveal className="hidden md:block absolute left-0 right-0 top-[7px] h-px">
              <span className="hline block h-full w-full" style={{ background: "linear-gradient(90deg, var(--border), var(--accent), var(--accent-green))" }} />
            </Reveal>
            <div className="grid md:grid-cols-3 gap-8">
              {flow.map((f, i) => (
                <Reveal key={f.key} delay={200 + i * 160} className="relative">
                  <span
                    className="block w-[15px] h-[15px] rounded-full"
                    style={{ background: "var(--background)", border: `2px solid ${i === flow.length - 1 ? "var(--accent-green)" : "var(--accent)"}`, boxShadow: "0 0 0 5px rgba(88,166,255,0.12)" }}
                  />
                  <p className="mt-6 text-xs font-mono" style={{ color: "var(--muted)" }}>{f.period} · {f.duration}</p>
                  <h3 className="mt-2 text-xl font-bold" style={{ color: "var(--foreground)" }}>{f.title}</h3>
                  <p className="mt-1 text-sm" style={{ color: i === flow.length - 1 ? "var(--accent-green)" : "var(--accent)" }}>{f.sub}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {f.tags.slice(0, 4).map((t) => <Tag key={t}>{t}</Tag>)}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. 대표 프로젝트 */}
      <section className="screen py-24 px-6" data-screen="대표 프로젝트" style={{ background: "var(--surface)" }}>
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <SectionTitle label="FEATURED" title="대표 프로젝트" desc="AI 캠프, 공공 SI, 웹에이전시에서 한 일을 하나씩 골랐습니다." />
            <Reveal>
              <Link href="/projects" className="group text-sm inline-flex items-center gap-1" style={{ color: "var(--accent)" }}>
                전체 {projects.length}건 보기 <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </Reveal>
          </div>
          {lead && (
            <Reveal delay={100} className="mt-10">
              <FeaturedLead project={lead} />
            </Reveal>
          )}
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {rest.map((p, i) => (
              <Reveal key={p.id} delay={200 + i * 100} className="h-full">
                <FeaturedMini project={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 기술 스택 */}
      <section className="screen py-24 px-6" data-screen="기술 스택">
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <SectionTitle label="SKILLS" title="기술 스택" desc="실무에서 쓴 웹 백엔드 위에 AI 스택을 더했습니다." />
            <Reveal>
              <Link href="/about" className="group text-sm inline-flex items-center gap-1" style={{ color: "var(--accent)" }}>
                소개 자세히 보기 <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </Reveal>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {skills.map((g, i) => (
              <Reveal key={g.id} delay={100 + i * 80} className="h-full">
                <div className="card-lift h-full p-6 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <p className="text-xs font-mono tracking-widest mb-4" style={{ color: g.isLearning ? "var(--accent-green)" : "var(--accent)" }}>
                    {g.category.toUpperCase()}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {g.items.map((t) => <Tag key={t}>{t}</Tag>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. 더 알아보기 (+ 아래 연락처까지 한 화면) */}
      <section className="screen-last py-24 px-6" data-screen="더 알아보기" style={{ background: "var(--surface)" }}>
        <div className="max-w-5xl mx-auto w-full">
          <SectionTitle label="EXPLORE" title="더 알아보기" />
          <div className="grid md:grid-cols-3 gap-5 mt-12">
            {pages.map((p, i) => (
              <Reveal key={p.href} delay={i * 100} className="h-full">
                <Link
                  href={p.href}
                  className="card-lift group h-full p-6 rounded-xl flex flex-col gap-3"
                  style={{ background: "var(--background)", border: "1px solid var(--border)" }}
                >
                  <span className="text-xs font-mono tracking-widest" style={{ color: "var(--accent)" }}>{p.label}</span>
                  <h3 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>{p.title}</h3>
                  <p className="text-xs font-mono flex-1" style={{ color: "var(--muted)" }}>{p.meta}</p>
                  <span className="text-sm inline-flex items-center gap-1" style={{ color: "var(--accent)" }}>
                    보러 가기 <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// 대표 프로젝트 중 첫 번째를 가로로 크게
function FeaturedLead({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="card-lift group grid md:grid-cols-[1.15fr_1fr] rounded-2xl overflow-hidden"
      style={{ background: "var(--background)", border: "1px solid var(--border)" }}
    >
      <div className="aspect-video md:aspect-auto md:h-[250px] overflow-hidden" style={{ background: "var(--surface2)" }}>
        <ProjectCover project={project} large />
      </div>
      <div className="p-6 flex flex-col gap-2.5">
        <span className="text-xs font-mono" style={{ color: "var(--accent-green)" }}>{project.org}</span>
        <h3 className="text-xl font-bold leading-snug transition-colors group-hover:text-[var(--accent)]" style={{ color: "var(--foreground)" }}>
          {project.title}
        </h3>
        <p className="text-xs font-mono" style={{ color: "var(--accent)" }}>{[project.client, project.period].filter(Boolean).join(" · ")}</p>
        <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "var(--muted)" }}>{project.desc}</p>
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {project.tags.slice(0, 4).map((t) => <Tag key={t}>{t}</Tag>)}
        </div>
      </div>
    </Link>
  );
}

// 대표 프로젝트 나머지: 작은 썸네일 + 제목만 (자세한 내용은 프로젝트 페이지에서)
function FeaturedMini({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="card-lift group h-full flex items-center gap-4 p-3 rounded-xl"
      style={{ background: "var(--background)", border: "1px solid var(--border)" }}
    >
      <div className="w-36 aspect-video flex-shrink-0 overflow-hidden rounded-lg" style={{ background: "var(--surface2)" }}>
        <ProjectCover project={project} small />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-mono" style={{ color: "var(--accent-green)" }}>{project.org}</p>
        <h3 className="mt-1 text-sm font-semibold leading-snug line-clamp-2 transition-colors group-hover:text-[var(--accent)]" style={{ color: "var(--foreground)" }}>
          {project.title}
        </h3>
        <p className="mt-1 text-xs font-mono truncate" style={{ color: "var(--muted)" }}>{[project.client, project.period].filter(Boolean).join(" · ")}</p>
      </div>
      <span className="pr-2 transition-transform duration-300 group-hover:translate-x-1" style={{ color: "var(--accent)" }}>→</span>
    </Link>
  );
}

function Hero() {
  const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
  return (
    <section className="screen min-h-screen flex items-center justify-center relative overflow-hidden" data-screen="처음">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="hero-glow absolute top-1/3 left-1/2 w-[500px] h-[500px] rounded-full opacity-[0.07] blur-3xl pointer-events-none"
        style={{ background: "var(--accent)" }}
      />
      <div className="relative z-10 text-center px-6">
        <p className="hero-in font-mono text-sm mb-4 tracking-widest" style={{ color: "var(--accent)" }}>
          &gt; HELLO, WORLD<span className="caret">_</span>
        </p>
        <h1 className="hero-in text-5xl md:text-7xl font-bold mb-4 tracking-tight" style={d(100)}>
          임<span style={{ color: "var(--accent)" }}>준</span>
        </h1>
        <p className="hero-in text-xl md:text-2xl font-semibold mb-2" style={{ color: "var(--foreground)", ...d(200) }}>
          Backend Developer
        </p>
        <p className="hero-in text-sm mb-2 font-mono" style={{ color: "var(--muted)", ...d(300) }}>
          웹 개발 5년 4개월 · PHP / Java / eGovFramework · LLM 애플리케이션
        </p>
        <p className="hero-in text-sm mb-10" style={{ color: "var(--accent-green)", ...d(400) }}>
          ▸ SK네트웍스 Family AI 캠프 29기 수료 · 기업참여 최종 프로젝트 최우수상
        </p>
        <div className="hero-in flex gap-4 justify-center flex-wrap" style={d(500)}>
          <Link
            href="/projects"
            className="px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: "var(--accent)", color: "#0d1117" }}
          >
            프로젝트 보기
          </Link>
          <Link
            href="/about"
            className="px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-[var(--surface2)] hover:-translate-y-0.5"
            style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
          >
            소개 보기
          </Link>
        </div>
        <div className="hero-in mt-16 flex flex-col items-center gap-2" style={d(700)}>
          <span className="text-xs" style={{ color: "var(--muted)" }}>scroll</span>
          <svg className="animate-bounce" width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: "var(--muted)" }}>
            <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </section>
  );
}
