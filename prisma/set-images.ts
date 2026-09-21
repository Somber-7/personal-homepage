import { PrismaClient } from "@prisma/client";

// 프로젝트 대표 이미지 경로만 제목 기준으로 갱신한다.
// 기존 내용이나 관리자 계정은 건드리지 않는다.
const prisma = new PrismaClient();

const IMAGES: [string, string][] = [
  ["halil · 프로젝트 운영 Agent Platform", "/projects/halil.jpg"],
  ["명가작명소 · AI 작명 웹 서비스", "/projects/myeongga.jpg"],
  ["조건 기반 맞춤 작명 QA 시스템", "/projects/naming-qa.jpg"],
  ["아파트 실거래 ML 인터랙티브 플랫폼", "/projects/apartment.jpg"],
  ["에너지 가격 변동의 모빌리티 시장 영향 분석", "/projects/energy.jpg"],
  ["웹에이전시 웹사이트 구축 · 운영 (약 200개 사이트)", "/projects/agency.jpg"],
  ["RunPod Serverless 문서 처리 워커", "/projects/runpod.jpg"],
  ["개인 포트폴리오 홈페이지", "/projects/homepage.jpg"],
  ["제8회 K-디지털 트레이닝 해커톤", "/projects/hackathon.jpg"],
];

async function main() {
  for (const [title, image] of IMAGES) {
    const r = await prisma.project.updateMany({ where: { title }, data: { image } });
    console.log(r.count ? "ok " : "-- ", title);
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
