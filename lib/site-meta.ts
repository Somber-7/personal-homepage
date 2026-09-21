import type { Metadata } from "next";

export const SITE_URL = "https://imjune.vercel.app";
export const SITE_NAME = "임준 | Backend Developer";
export const SITE_DESC = "웹 개발 5년 4개월, LLM·에이전트로 영역을 넓히고 있는 백엔드 개발자 임준의 포트폴리오입니다.";

// 페이지별 제목·설명을 링크 공유 미리보기(Open Graph)에도 똑같이 넣는다.
// images를 넘기지 않으면 app/opengraph-image.tsx의 대표 이미지를 쓴다.
// (페이지에서 openGraph를 지정하면 상위의 이미지를 물려받지 않아서 직접 넣어 준다)
export function pageMeta(title: string, description = SITE_DESC, path = "/", images = ["/opengraph-image"]): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      siteName: SITE_NAME,
      url: path,
      title,
      description,
      images,
    },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
