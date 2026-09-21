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
          background: "#ffffff",
          color: "#191918",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#62625d" }}>
          Web Backend · LLM Applications
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 120, fontWeight: 800, letterSpacing: -4 }}>Im June</div>
          <div style={{ display: "flex", fontSize: 36, marginTop: 16, fontFamily: "sans-serif", color: "#191918" }}>
            5+ years building web backends. Now connecting LLM agents to real systems.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 26,
            fontFamily: "sans-serif",
            borderTop: "2px solid #191918",
            paddingTop: 24,
          }}
        >
          <div style={{ display: "flex", color: "#c2410c" }}>PHP · Java · eGovFramework · LLM Agents</div>
          <div style={{ display: "flex", color: "#62625d" }}>imjune.vercel.app</div>
        </div>
      </div>
    ),
    size
  );
}
