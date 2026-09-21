"use client";

import { useEffect, useRef, useState } from "react";

// "5년 4개월"처럼 글 속 숫자만 0부터 올라가게 보여 준다. 서버 렌더링 결과는 최종 값 그대로.
export default function CountUp({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(text);

  useEffect(() => {
    const el = ref.current;
    if (!el || !/\d/.test(text)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const k = Math.min(1, (now - start) / 1200);
        const eased = 1 - Math.pow(1 - k, 3);
        setShown(text.replace(/\d+/g, (m) => String(Math.round(Number(m) * eased))));
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    observer.observe(el);
    return () => { observer.disconnect(); cancelAnimationFrame(raf); };
  }, [text]);

  return <span ref={ref}>{shown}</span>;
}
