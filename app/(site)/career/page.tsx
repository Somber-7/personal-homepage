import type { Metadata } from "next";
import { pageMeta } from "@/lib/site-meta";
import { getEducations, getExperiences } from "@/lib/portfolio";
import Timeline from "../../components/Timeline";
import { PageHeader, SectionTitle } from "../../components/ui";

export const metadata: Metadata = pageMeta("경력 | 임준", "공공기관 SI와 웹에이전시에서 5년 넘게 웹 백엔드를 개발했고, AI 엔지니어링 과정을 마쳤습니다.", "/career");

export default async function CareerPage() {
  const [experiences, educations] = await Promise.all([getExperiences(), getEducations()]);

  return (
    <>
      <PageHeader
        label="02 ── CAREER"
        title="경력 · 교육"
        desc="공공기관 SI와 웹에이전시에서 5년 넘게 웹 백엔드를 개발했고, AI 엔지니어링 과정을 마쳤습니다."
      />

      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionTitle label="경력" title="회사 경력" />
          <Timeline
            items={experiences.map((e) => ({
              id: e.id, period: e.period, duration: e.duration, title: e.company,
              subtitle: e.role, desc: e.desc, tags: e.tags, current: e.isCurrent,
            }))}
          />
        </div>
      </section>

      {educations.length > 0 && (
        <section className="py-24 px-6" style={{ background: "var(--surface)" }}>
          <div className="max-w-5xl mx-auto">
            <SectionTitle label="교육" title="교육 · 수료" />
            <Timeline
              onSurface
              items={educations.map((e) => ({
                id: e.id, period: e.period, duration: e.duration, title: e.name,
                subtitle: e.course, desc: e.desc, tags: e.tags,
              }))}
            />
          </div>
        </section>
      )}
    </>
  );
}
