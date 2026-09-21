import { ImageResponse } from "next/og";

// iOS 홈 화면 등에 쓰이는 아이콘. app/icon.svg와 같은 모양을 PNG로 만든다.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d1117" }}>
        <svg width="120" height="120" viewBox="0 0 64 64">
          <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.5">
            <path d="M22 20 10 32l12 12" stroke="#58a6ff" />
            <path d="M42 20l12 12-12 12" stroke="#58a6ff" />
            <path d="M36 16 28 48" stroke="#3fb950" />
          </g>
        </svg>
      </div>
    ),
    size
  );
}
