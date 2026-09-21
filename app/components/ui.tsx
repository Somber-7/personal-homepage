import type { CSSProperties } from "react";

// 하위 페이지 맨 위 제목 영역. 페이지를 열 때 순서대로 떠오른다.
export function PageHeader({ title, desc }: { title: string; desc?: string }) {
  return (
    <section className="px-6 pt-36 pb-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="hero-in text-4xl md:text-6xl font-bold" style={{ color: "var(--foreground)" }}>
          {title}
        </h1>
        {desc && (
          <p className="hero-in mt-4 text-base" style={{ color: "var(--muted)", "--d": "100ms" } as CSSProperties}>
            {desc}
          </p>
        )}
      </div>
    </section>
  );
}

export function Tag({ children, variant = "default" }: { children: string; variant?: "default" | "accent" }) {
  const styles = {
    default: { background: "var(--surface2)", color: "var(--muted)" },
    accent: { background: "#f7e4d8", color: "var(--accent)" },
  };
  return (
    <span className="text-xs px-2 py-0.5 rounded font-mono" style={styles[variant]}>
      {children}
    </span>
  );
}
