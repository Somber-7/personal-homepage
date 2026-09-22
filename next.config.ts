import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 소개·경력 페이지는 홈(한 페이지 이력서)으로 합쳤다. 예전 링크는 홈의 해당 위치로 보낸다
  async redirects() {
    return [
      { source: "/about", destination: "/#skills", permanent: true },
      { source: "/career", destination: "/#experience", permanent: true },
    ];
  },
  // 기본 보안 헤더: 다른 사이트의 iframe에 넣지 못하게, 파일 형식 추측 금지, 쓰지 않는 브라우저 권한 차단
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
