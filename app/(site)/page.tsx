import Link from "next/link";
import type { CSSProperties } from "react";
import { getCertifications, getEducations, getExperiences, getProjects, getSkills, groupByOrg } from "@/lib/portfolio";
import Reveal from "../components/Reveal";
import ProjectCard from "../components/ProjectCard";
import { SectionTitle } from "../components/ui";

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

  const pages = [
    { href: "/about", label: "소개", title: "어떤 개발자인가", meta: `기술 ${skills.length}개 분야 · 자격증 ${certifications.length}개` },
    { href: "/career", label: "경력", title: "어디서 일했나", meta: `경력 ${experiences.length}곳 · 교육 ${educations.length}개` },
    { href: "/projects", label: "프로젝트", title: "무엇을 만들었나", meta: `프로젝트 ${projects.length}건 · 소속 ${groups.length}곳` },
  ];

  return (
    <>
      <Hero />

      <section className="py-24 px-6" style={{ background: "var(--surface)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <SectionTitle label="FEATURED" title="대표 프로젝트" desc="AI 캠프, 공공 SI, 웹에이전시에서 한 일을 하나씩 골랐습니다." />
            <Reveal>
              <Link href="/projects" className="group text-sm inline-flex items-center gap-1" style={{ color: "var(--accent)" }}>
                전체 {projects.length}건 보기 <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </Reveal>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 100} className="h-full">
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionTitle label="EXPLORE" title="더 알아보기" />
          <div className="grid md:grid-cols-3 gap-5 mt-12">
            {pages.map((p, i) => (
              <Reveal key={p.href} delay={i * 100} className="h-full">
                <Link
                  href={p.href}
                  className="card-lift group h-full p-6 rounded-xl flex flex-col gap-3"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
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

function Hero() {
  const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
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
