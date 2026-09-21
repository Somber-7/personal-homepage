"use client";

import { useState, useEffect, useRef } from "react";

// ─── 타입 ─────────────────────────────────────────────────────

type Experience = {
  id: number;
  period: string;
  duration: string;
  company: string;
  role: string;
  desc: string;
  tags: string[];
  isCurrent: boolean;
  order: number;
};

type Project = {
  id: number;
  title: string;
  client: string;
  period: string;
  desc: string;
  role: string;
  image?: string | null;
  tags: string[];
  order: number;
};

type Skill = {
  id: number;
  category: string;
  items: string[];
  isLearning: boolean;
  order: number;
};

type Certification = {
  id: number;
  name: string;
  org: string;
  year: string;
  order: number;
};

type Props = {
  experiences: Experience[];
  projects: Project[];
  skills: Skill[];
  certifications: Certification[];
};

// ─── 애니메이션 훅 ────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ─── 공통 컴포넌트 ────────────────────────────────────────────

const NAV_LINKS = [
  { href: "#about", label: "소개" },
  { href: "#skills", label: "기술 스택" },
  { href: "#experience", label: "경력" },
  { href: "#projects", label: "프로젝트" },
  { href: "#certifications", label: "자격증" },
  { href: "#contact", label: "연락처" },
];

function SectionTitle({ label, title, centered = false }: { label: string; title: string; centered?: boolean }) {
  const { ref, visible } = useInView(0.3);
  return (
    <div
      ref={ref}
      className={`${centered ? "flex flex-col items-center" : ""} transition-all duration-700`}
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)" }}
    >
      <span className="text-xs font-mono tracking-widest" style={{ color: "var(--accent)" }}>
        {label} ──
      </span>
      <h2 className="text-3xl font-bold mt-1" style={{ color: "var(--foreground)" }}>
        {title}
      </h2>
    </div>
  );
}

function Tag({ children, variant = "default" }: { children: string; variant?: "default" | "accent" | "green" }) {
  const styles = {
    default: { background: "var(--surface2)", color: "var(--muted)", border: "1px solid var(--border)" },
    accent: { background: "rgba(88,166,255,0.12)", color: "var(--accent)", border: "1px solid rgba(88,166,255,0.3)" },
    green: { background: "rgba(63,185,80,0.12)", color: "var(--accent-green)", border: "1px solid rgba(63,185,80,0.3)" },
  };
  return (
    <span className="text-xs px-2 py-0.5 rounded font-mono" style={styles[variant]}>
      {children}
    </span>
  );
}

// ─── 섹션 컴포넌트 ────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(13,17,23,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "none",
      }}
    >
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="font-mono font-bold text-lg" style={{ color: "var(--accent)" }}>
          &lt;임준 /&gt;
        </span>
        <ul className="hidden md:flex gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm transition-colors duration-200 hover:text-[var(--accent)]"
                style={{ color: "var(--muted)" }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="메뉴"
        >
          {[0, 1, 2].map((i) => (
            <span key={i} className="block w-5 h-0.5" style={{ background: "var(--foreground)" }} />
          ))}
        </button>
      </nav>
      {menuOpen && (
        <div
          className="md:hidden px-6 pb-4"
          style={{ borderBottom: "1px solid var(--border)", background: "rgba(13,17,23,0.97)" }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-2 text-sm hover:text-[var(--accent)]"
              style={{ color: "var(--muted)" }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

function Hero() {
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
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.07] blur-3xl pointer-events-none"
        style={{ background: "var(--accent)" }}
      />
      <div className="relative z-10 text-center px-6">
        <p className="font-mono text-sm mb-4 tracking-widest" style={{ color: "var(--accent)" }}>
          &gt; HELLO, WORLD
        </p>
        <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
          임<span style={{ color: "var(--accent)" }}>준</span>
        </h1>
        <p className="text-xl md:text-2xl font-semibold mb-2" style={{ color: "var(--foreground)" }}>
          Backend Developer
        </p>
        <p className="text-sm mb-2 font-mono" style={{ color: "var(--muted)" }}>
          웹 개발 5년 4개월 · PHP / Java / eGovFramework · LLM 애플리케이션
        </p>
        <p className="text-sm mb-10" style={{ color: "var(--accent-green)" }}>
          ▸ SK네트웍스 Family AI 캠프 29기 수료 · 기업참여 최종 프로젝트 최우수상
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="#projects"
            className="px-6 py-3 rounded-lg font-medium text-sm transition-opacity duration-200 hover:opacity-80"
            style={{ background: "var(--accent)", color: "#0d1117" }}
          >
            프로젝트 보기
          </a>
          <a
            href="#contact"
            className="px-6 py-3 rounded-lg font-medium text-sm transition-colors duration-200 hover:bg-[var(--surface2)]"
            style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
          >
            연락하기
          </a>
        </div>
        <div className="mt-16 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs" style={{ color: "var(--muted)" }}>scroll</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: "var(--muted)" }}>
            <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </section>
  );
}

function About() {
  const { ref, visible } = useInView();
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionTitle label="01" title="소개" />
        <div
          ref={ref}
          className="grid md:grid-cols-2 gap-12 mt-12 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)" }}
        >
          <div className="space-y-4 text-base leading-relaxed" style={{ color: "var(--muted)" }}>
            <p>안녕하세요, <span style={{ color: "var(--foreground)" }}>백엔드 개발자 임준</span>입니다.</p>
            <p>
              <span style={{ color: "var(--foreground)" }}>(주)그리드텍</span>에서 4년 2개월간
              한국전력공사, 교육부 등 공공기관 대상 Java EgovFramework 기반 SI 프로젝트에 다수 참여했습니다.
            </p>
            <p>
              이후 <span style={{ color: "var(--foreground)" }}>쓰리애니아이앤시</span>에서
              순수 PHP와 사내 자체 솔루션으로 약 200개 사이트의 구축·유지보수에 참여했고,
              Linux 웹 서버 운영과 외부 연동, 장애 대응까지 함께 담당했습니다.
            </p>
            <p>
              이후 <span style={{ color: "var(--accent)" }}>SK네트웍스 Family AI 캠프 29기</span>를 수료하며
              팀 프로젝트 다섯 건을 모두 PM으로 이끌었고, 최종 프로젝트에서 최우수상을 받았습니다.
              지금까지 해 온 웹 백엔드를 축으로 삼되 LLM과 에이전트를 실제 업무 시스템에 연결하는 쪽으로 역할을 넓혀 가려 합니다.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "총 경력", value: "5년 4개월" },
              { label: "수행 프로젝트", value: "15건" },
              { label: "주요 도메인", value: "공공 SI · 에이전시" },
              { label: "최근", value: "LLM · 에이전트" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="p-5 rounded-xl text-center transition-all duration-500"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(16px)",
                  transitionDelay: visible ? `${i * 80}ms` : "0ms",
                }}
              >
                <p className="text-2xl font-bold mb-1" style={{ color: "var(--accent)" }}>{stat.value}</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills({ skills }: { skills: Skill[] }) {
  const { ref, visible } = useInView();
  return (
    <section id="skills" className="py-24 px-6" style={{ background: "var(--surface)" }}>
      <div className="max-w-5xl mx-auto">
        <SectionTitle label="02" title="기술 스택" />
        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {skills.map((group, i) => (
            <div
              key={group.id}
              className="p-6 rounded-xl transition-all duration-500"
              style={{
                background: "var(--background)",
                border: "1px solid var(--border)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transitionDelay: visible ? `${i * 80}ms` : "0ms",
              }}
            >
              <p
                className="text-xs font-mono mb-4 tracking-widest"
                style={{ color: group.isLearning ? "var(--accent-green)" : "var(--accent)" }}
              >
                {group.category.toUpperCase()}
              </p>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: group.isLearning ? "var(--accent-green)" : "var(--accent)" }}
                    />
                    <span className="text-sm" style={{ color: "var(--foreground)" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience({ experiences }: { experiences: Experience[] }) {
  const { ref, visible } = useInView();
  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionTitle label="03" title="경력" />
        <div ref={ref} className="mt-12 space-y-6">
          {experiences.map((exp, i) => (
            <div
              key={exp.id}
              className="p-6 rounded-xl flex flex-col md:flex-row gap-6 transition-all duration-600"
              style={{
                background: "var(--surface)",
                border: exp.isCurrent ? "1px solid var(--accent)" : "1px solid var(--border)",
                boxShadow: exp.isCurrent ? "0 0 20px rgba(88,166,255,0.06)" : "none",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transitionDelay: visible ? `${i * 100}ms` : "0ms",
              }}
            >
              <div className="md:w-44 flex-shrink-0 space-y-1">
                <span
                  className="inline-block text-xs font-mono px-2 py-1 rounded"
                  style={{
                    background: exp.isCurrent ? "rgba(63,185,80,0.15)" : "var(--surface2)",
                    color: exp.isCurrent ? "var(--accent-green)" : "var(--accent)",
                  }}
                >
                  {exp.duration}
                </span>
                <p className="text-xs font-mono" style={{ color: "var(--muted)" }}>{exp.period}</p>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base mb-1" style={{ color: "var(--foreground)" }}>{exp.company}</h3>
                <p className="text-sm mb-3" style={{ color: exp.isCurrent ? "var(--accent-green)" : "var(--accent)" }}>
                  {exp.role}
                </p>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--muted)" }}>{exp.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <Tag key={tag} variant={exp.isCurrent ? "green" : "default"}>{tag}</Tag>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects({ projects }: { projects: Project[] }) {
  const { ref, visible } = useInView();
  return (
    <section id="projects" className="py-24 px-6" style={{ background: "var(--surface)" }}>
      <div className="max-w-5xl mx-auto">
        <SectionTitle label="04" title="프로젝트" />
        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {projects.map((proj, i) => (
            <div
              key={proj.id}
              className="group p-5 rounded-xl flex flex-col gap-3 overflow-hidden transition-all duration-500 hover:border-[var(--accent)]"
              style={{
                background: "var(--background)",
                border: "1px solid var(--border)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transitionDelay: visible ? `${i * 70}ms` : "0ms",
              }}
            >
              {proj.image ? (
                <div className="-mx-5 -mt-5 mb-1 aspect-video overflow-hidden" style={{ borderBottom: "1px solid var(--border)", background: "var(--surface2)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={proj.image}
                    alt={proj.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div
                  className="-mx-5 -mt-5 mb-1 aspect-video flex flex-col justify-between p-4"
                  style={{
                    borderBottom: "1px solid var(--border)",
                    background: "radial-gradient(120% 90% at 100% 0%, rgba(88,166,255,0.16), transparent 60%), var(--surface2)",
                  }}
                >
                  <span className="font-mono text-2xl font-bold" style={{ color: "var(--accent)", opacity: 0.55 }}>&lt;/&gt;</span>
                  <span className="font-mono text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                    {proj.tags.slice(0, 3).join(" · ")}
                  </span>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-sm leading-snug mb-1" style={{ color: "var(--foreground)" }}>
                  {proj.title}
                </h3>
                <p className="text-xs font-mono" style={{ color: "var(--accent)" }}>
                  {proj.client} · {proj.period}
                </p>
              </div>
              <p className="text-xs leading-relaxed flex-1" style={{ color: "var(--muted)" }}>{proj.desc}</p>
              <div>
                <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>
                  <span style={{ color: "var(--accent-green)" }}>▸</span> {proj.role}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {proj.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Certifications({ certifications }: { certifications: Certification[] }) {
  const { ref, visible } = useInView();
  return (
    <section id="certifications" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionTitle label="05" title="자격증" />
        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {certifications.map((cert, i) => (
            <div
              key={cert.id}
              className="flex items-center gap-4 p-4 rounded-xl transition-all duration-500"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transitionDelay: visible ? `${i * 60}ms` : "0ms",
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold font-mono"
                style={{ background: "var(--surface2)", color: "var(--accent)" }}
              >
                {cert.year.slice(2)}
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{cert.name}</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>{cert.org} · {cert.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const { ref, visible } = useInView();
  return (
    <section id="contact" className="py-24 px-6" style={{ background: "var(--surface)" }}>
      <div className="max-w-5xl mx-auto text-center">
        <SectionTitle label="06" title="연락처" centered />
        <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>새로운 기회나 협업 제안을 환영합니다.</p>
        <div
          ref={ref}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)" }}
        >
          <a
            href="mailto:true_j@naver.com"
            className="flex items-center gap-3 px-6 py-4 rounded-xl transition-colors duration-200 hover:border-[var(--accent)]"
            style={{ background: "var(--background)", border: "1px solid var(--border)" }}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ color: "var(--accent)" }}>
              <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M2 5l8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-sm font-mono" style={{ color: "var(--foreground)" }}>true_j@naver.com</span>
          </a>
          <a
            href="tel:010-5024-7939"
            className="flex items-center gap-3 px-6 py-4 rounded-xl transition-colors duration-200 hover:border-[var(--accent)]"
            style={{ background: "var(--background)", border: "1px solid var(--border)" }}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ color: "var(--accent)" }}>
              <path d="M3 4a1 1 0 011-1h2.5a1 1 0 01.97.757l.7 2.8a1 1 0 01-.274 1.002L6.6 8.6a11.04 11.04 0 004.8 4.8l1.04-1.296a1 1 0 011.003-.274l2.8.7A1 1 0 0117 13.5V16a1 1 0 01-1 1h-1C7.163 17 3 12.837 3 8V4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-sm font-mono" style={{ color: "var(--foreground)" }}>010-5024-7939</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-6 px-6 text-center" style={{ borderTop: "1px solid var(--border)" }}>
      <p className="text-xs font-mono" style={{ color: "var(--muted)" }}>
        © 2026 임준 · Built with Next.js & Tailwind CSS
      </p>
    </footer>
  );
}

// ─── 메인 ─────────────────────────────────────────────────────

export default function HomeClient({ experiences, projects, skills, certifications }: Props) {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills skills={skills} />
        <Experience experiences={experiences} />
        <Projects projects={projects} />
        <Certifications certifications={certifications} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
