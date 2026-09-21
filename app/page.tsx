import { prisma } from "@/lib/prisma";
import HomeClient from "./HomeClient";

type ExperienceRow = {
  id: number; period: string; duration: string; company: string;
  role: string; desc: string; tags: string; isCurrent: boolean;
  order: number; createdAt: Date; updatedAt: Date;
};
type EducationRow = {
  id: number; period: string; duration: string; name: string;
  course: string; desc: string; tags: string; order: number;
  createdAt: Date; updatedAt: Date;
};
type ProjectRow = {
  id: number; title: string; client: string; period: string;
  desc: string; role: string; image: string | null; tags: string; order: number;
  createdAt: Date; updatedAt: Date;
};
type SkillRow = {
  id: number; category: string; items: string; isLearning: boolean; order: number;
};

export default async function Home() {
  const [experienceRows, educationRows, projectRows, skillRows, certifications] = await Promise.all([
    prisma.experience.findMany({ orderBy: { order: "asc" } }),
    prisma.education.findMany({ orderBy: { order: "asc" } }),
    prisma.project.findMany({ orderBy: { order: "asc" } }),
    prisma.skill.findMany({ orderBy: { order: "asc" } }),
    prisma.certification.findMany({ orderBy: { order: "asc" } }),
  ]);

  const experiences = (experienceRows as ExperienceRow[]).map((e) => ({ ...e, tags: JSON.parse(e.tags) as string[] }));
  const educations = (educationRows as EducationRow[]).map((e) => ({ ...e, tags: JSON.parse(e.tags) as string[] }));
  const projects = (projectRows as ProjectRow[]).map((p) => ({ ...p, tags: JSON.parse(p.tags) as string[] }));
  const skills = (skillRows as SkillRow[]).map((s) => ({ ...s, items: JSON.parse(s.items) as string[] }));

  return (
    <HomeClient
      experiences={experiences}
      educations={educations}
      projects={projects}
      skills={skills}
      certifications={certifications}
    />
  );
}
