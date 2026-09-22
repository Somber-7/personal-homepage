import { prisma } from "@/lib/prisma";
import type { ResourceKey } from "@/lib/admin-resources";

type Row = Record<string, unknown> & { id: number };
const byOrder = { orderBy: { order: "asc" as const } };

// 관리자 목록·수정 페이지용 조회. 항목마다 prisma 모델이 달라 switch로 나눈다
export async function listRows(key: ResourceKey): Promise<Row[]> {
  switch (key) {
    case "experiences": return prisma.experience.findMany(byOrder);
    case "educations": return prisma.education.findMany(byOrder);
    case "projects": return prisma.project.findMany(byOrder);
    case "skills": return prisma.skill.findMany(byOrder);
    case "certifications": return prisma.certification.findMany(byOrder);
  }
}

export async function getRow(key: ResourceKey, id: number): Promise<Row | null> {
  const where = { where: { id } };
  switch (key) {
    case "experiences": return prisma.experience.findUnique(where);
    case "educations": return prisma.education.findUnique(where);
    case "projects": return prisma.project.findUnique(where);
    case "skills": return prisma.skill.findUnique(where);
    case "certifications": return prisma.certification.findUnique(where);
  }
}

// 프로젝트 상세 페이지 세 칸(맡은 일·구현과 문제 해결·결과) 중 비어 있는 수
export function emptyDetailCount(row: Row) {
  return ["work", "solution", "result"].filter((k) => !String(row[k] ?? "").trim()).length;
}

// 관리자 API 쓰기용. 항목마다 모델이 달라 최소한의 공통 모양으로 다룬다
type Writable = {
  create(args: { data: Record<string, unknown> }): Promise<Row>;
  update(args: { where: { id: number }; data: Record<string, unknown> }): Promise<Row>;
  delete(args: { where: { id: number } }): Promise<Row>;
};

function writable(key: ResourceKey): Writable {
  const models = {
    experiences: prisma.experience,
    educations: prisma.education,
    projects: prisma.project,
    skills: prisma.skill,
    certifications: prisma.certification,
  };
  return models[key] as unknown as Writable;
}

export const createRow = (key: ResourceKey, data: Record<string, unknown>) => writable(key).create({ data });
export const updateRow = (key: ResourceKey, id: number, data: Record<string, unknown>) => writable(key).update({ where: { id }, data });
export const deleteRow = (key: ResourceKey, id: number) => writable(key).delete({ where: { id } });
