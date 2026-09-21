import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 소개·경력 페이지는 홈(한 페이지 이력서)으로 합쳤다. 예전 링크는 홈의 해당 위치로 보낸다
  async redirects() {
    return [
      { source: "/about", destination: "/#skills", permanent: true },
      { source: "/career", destination: "/#experience", permanent: true },
    ];
  },
};

export default nextConfig;
