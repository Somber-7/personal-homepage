"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

// 화면에 들어오면 is-in 클래스를 붙인다. 숨김·등장 효과는 globals.css의 [data-reveal]에서 처리.
export default function Reveal({ children, delay = 0, className = "", style }: {
  children?: ReactNode; delay?: number; className?: string; style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal
      className={`${className} ${inView ? "is-in" : ""}`}
      style={{ ...style, "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
