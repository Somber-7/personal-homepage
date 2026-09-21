import type { Metadata } from "next";
import { pageMeta } from "@/lib/site-meta";
import { getCertifications, getSkills } from "@/lib/portfolio";
import Reveal from "../../components/Reveal";
import CountUp from "../../components/CountUp";
import { PageHeader, SectionTitle } from "../../components/ui";

export const metadata: Metadata = pageMeta("소개 | 임준", "공공 SI와 웹에이전시에서 쌓은 웹 백엔드 경험을 바탕으로 LLM과 에이전트를 업무 시스템에 연결하는 개발자 임준을 소개합니다.", "/about");

const STATS = [
  { label: "총 경력", value: "5년 4개월" },
  { label: "수행 프로젝트", value: "15건" },
  { label: "주요 도메인", value: "공공 SI · 에이전시" },
  { label: "최근", value: "LLM · 에이전트" },
];

export default async function AboutPage() {
  const [skills, certifications] = await Promise.all([getSkills(), getCertifications()]);

  return (
    <>
      <PageHeader
        label="01 ── ABOUT"
        title="소개"
        desc="공공 SI와 웹에이전시에서 쌓은 웹 백엔드 경험을 바탕으로, LLM과 에이전트를 실제 업무 시스템에 연결하는 개발자입니다."
      />

      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          <Reveal className="space-y-4 text-base leading-relaxed" style={{ color: "var(--muted)" }}>
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
          </Reveal>
          <div className="grid grid-cols-2 gap-4 content-start">
            {STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 80} className="h-full">
                <div className="card-lift p-5 rounded-xl text-center h-full" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <p className="text-2xl font-bold mb-1" style={{ color: "var(--accent)" }}>
                    <CountUp text={stat.value} />
                  </p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6" style={{ background: "var(--surface)" }}>
        <div className="max-w-5xl mx-auto">
          <SectionTitle label="02" title="기술 스택" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {skills.map((group, i) => (
              <Reveal key={group.id} delay={i * 80} className="h-full">
                <div className="card-lift p-6 rounded-xl h-full" style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
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
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionTitle label="03" title="자격증" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
            {certifications.map((cert, i) => (
              <Reveal key={cert.id} delay={i * 60} className="h-full">
                <div className="card-lift flex items-center gap-4 p-4 rounded-xl h-full" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
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
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
