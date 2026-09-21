import { ImageResponse } from "next/og";

// 링크를 공유했을 때 보이는 대표 이미지 (빌드 때 한 번 만들어진다).
// 기본 폰트에 한글이 없어서 이미지 안 글자는 영문으로 쓴다. 한글 제목·설명은 layout.tsx의 metadata로 나간다.
export const alt = "임준 | Backend Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(circle at 85% 10%, rgba(88,166,255,0.22), transparent 55%), #0d1117",
          color: "#e6edf3",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 28, color: "#58a6ff", letterSpacing: 4 }}>&gt; HELLO, WORLD_</div>
          <svg width="72" height="72" viewBox="0 0 64 64">
            <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.5">
              <path d="M22 20 10 32l12 12" stroke="#58a6ff" />
              <path d="M42 20l12 12-12 12" stroke="#58a6ff" />
              <path d="M36 16 28 48" stroke="#3fb950" />
            </g>
          </svg>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 104, fontWeight: 700, letterSpacing: -2 }}>
            IM<span style={{ color: "#58a6ff", marginLeft: 28 }}>JUNE</span>
          </div>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 600, marginTop: 8 }}>Backend Developer</div>
          <div style={{ display: "flex", fontSize: 28, color: "#8b949e", marginTop: 20 }}>
            PHP · Java · eGovFramework · LLM Agents
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 26 }}>
          <div style={{ display: "flex", color: "#3fb950" }}>5+ years web backend · AI engineering</div>
          <div style={{ display: "flex", color: "#8b949e" }}>imjune.vercel.app</div>
        </div>
      </div>
    ),
    size
  );
}
