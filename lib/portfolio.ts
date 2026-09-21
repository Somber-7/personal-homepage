import { prisma } from "@/lib/prisma";

// tags·items는 DB에 JSON 문자열로 저장되어 있어 읽을 때 배열로 바꾼다.
const parse = (s: string) => JSON.parse(s) as string[];

export async function getExperiences() {
  const rows = await prisma.experience.findMany({ orderBy: { order: "asc" } });
  return rows.map((e) => ({ ...e, tags: parse(e.tags) }));
}

export async function getEducations() {
  const rows = await prisma.education.findMany({ orderBy: { order: "asc" } });
  return rows.map((e) => ({ ...e, tags: parse(e.tags) }));
}

export async function getProjects() {
  const rows = await prisma.project.findMany({ orderBy: { order: "asc" } });
  return rows.map((p) => ({ ...p, tags: parse(p.tags) }));
}

export async function getSkills() {
  const rows = await prisma.skill.findMany({ orderBy: { order: "asc" } });
  return rows.map((s) => ({ ...s, items: parse(s.items) }));
}

export async function getCertifications() {
  return prisma.certification.findMany({ orderBy: { order: "asc" } });
}

export type Experience = Awaited<ReturnType<typeof getExperiences>>[number];
export type Education = Awaited<ReturnType<typeof getEducations>>[number];
export type Project = Awaited<ReturnType<typeof getProjects>>[number];
export type Skill = Awaited<ReturnType<typeof getSkills>>[number];
export type Certification = Awaited<ReturnType<typeof getCertifications>>[number];

// 소속이 처음 나온 순서대로 묶는다 (projects는 order 순)
export function groupByOrg(projects: Project[]) {
  const groups: { org: string; items: Project[] }[] = [];
  for (const p of projects) {
    const org = p.org || "기타";
    const g = groups.find((x) => x.org === org);
    if (g) g.items.push(p);
    else groups.push({ org, items: [p] });
  }
  return groups;
}
