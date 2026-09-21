import type { CSSProperties } from "react";
import Reveal from "./Reveal";

export function SectionTitle({ label, title, desc }: { label: string; title: string; desc?: string }) {
  return (
    <Reveal>
      <span className="text-xs font-mono tracking-widest" style={{ color: "var(--accent)" }}>
        {label} ──
      </span>
      <h2 className="text-3xl font-bold mt-1" style={{ color: "var(--foreground)" }}>
        {title}
      </h2>
      {desc && <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>{desc}</p>}
    </Reveal>
  );
}

// 하위 페이지 맨 위 제목 영역. 페이지를 열 때 순서대로 떠오른다.
export function PageHeader({ label, title, desc }: { label: string; title: string; desc: string }) {
  return (
    <section className="relative overflow-hidden px-6 pt-36 pb-16">
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "linear-gradient(to bottom, black, transparent)",
        }}
      />
      <div className="relative max-w-5xl mx-auto">
        <p className="hero-in font-mono text-xs tracking-widest" style={{ color: "var(--accent)" }}>{label}</p>
        <h1 className="hero-in text-4xl md:text-5xl font-bold mt-3 tracking-tight" style={{ color: "var(--foreground)", "--d": "80ms" } as CSSProperties}>
          {title}
        </h1>
        <p className="hero-in mt-4 max-w-2xl text-base leading-relaxed" style={{ color: "var(--muted)", "--d": "160ms" } as CSSProperties}>
          {desc}
        </p>
      </div>
    </section>
  );
}

export function Tag({ children, variant = "default" }: { children: string; variant?: "default" | "accent" | "green" }) {
  const styles = {
    default: { background: "var(--surface2)", color: "var(--muted)", border: "1px solid var(--border)" },
    accent: { background: "rgba(88,166,255,0.12)", color: "var(--accent)", border: "1px solid rgba(88,166,255,0.3)" },
    green: { background: "rgba(63,185,80,0.12)", color: "var(--accent-green)", border: "1px solid rgba(63,185,80,0.3)" },
  };
  return (
    <span className="text-xs px-2 py-0.5 rounded font-mono" style={styles[variant]}>
      {children}
    </span>
  );
}
