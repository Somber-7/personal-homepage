"use client";

import { useEffect, useRef } from "react";

// 화면 맨 위의 얇은 스크롤 진행 막대
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? window.scrollY / max : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${ratio})`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={bar}
      aria-hidden
      className="fixed top-0 left-0 right-0 h-0.5 z-[60] origin-left"
      style={{ transform: "scaleX(0)", background: "linear-gradient(90deg, var(--accent), var(--accent-green))" }}
    />
  );
}
