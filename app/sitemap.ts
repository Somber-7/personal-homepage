import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/portfolio";
import { SITE_URL } from "@/lib/site-meta";

// 공개 페이지 목록. 빌드 때와 관리자 저장 후 다시 만들어진다
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/projects`, changeFrequency: "monthly", priority: 0.8 },
    ...projects.map((p) => ({ url: `${SITE_URL}/projects/${p.id}`, lastModified: p.updatedAt, priority: 0.6 })),
  ];
}
