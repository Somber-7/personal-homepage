import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-meta";

// 관리자 화면과 API는 검색에서 뺀다
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
