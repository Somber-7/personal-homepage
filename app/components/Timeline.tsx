import Reveal from "./Reveal";
import { Tag } from "./ui";

export type TimelineItem = {
  id: number;
  period: string;
  duration: string;
  title: string;
  subtitle: string;
  desc: string;
  tags: string[];
  current?: boolean;
};

// 왼쪽 세로선이 위에서 아래로 그려지고, 항목이 차례로 떠오른다.
export default function Timeline({ items, onSurface = false }: { items: TimelineItem[]; onSurface?: boolean }) {
  return (
    <div className="relative mt-12">
      <Reveal className="absolute left-[7px] top-3 bottom-3 w-px">
        <span className="timeline-line block h-full w-full" style={{ background: "linear-gradient(var(--accent), var(--border))" }} />
      </Reveal>
      <div className="space-y-8">
        {items.map((item, i) => (
          <Reveal key={item.id} delay={i * 120} className="relative pl-10">
            <span
              className="absolute left-0 top-7 w-[15px] h-[15px] rounded-full"
              style={{ background: "var(--background)", border: `2px solid ${item.current ? "var(--accent-green)" : "var(--accent)"}`, boxShadow: "0 0 0 4px rgba(88,166,255,0.12)" }}
            />
            <div
              className="card-lift p-6 rounded-xl flex flex-col md:flex-row gap-6"
              style={{ background: onSurface ? "var(--background)" : "var(--surface)", border: item.current ? "1px solid var(--accent)" : "1px solid var(--border)" }}
            >
              <div className="md:w-44 flex-shrink-0 space-y-1">
                <span className="inline-block text-xs font-mono px-2 py-1 rounded" style={{ background: item.current ? "rgba(63,185,80,0.15)" : "var(--surface2)", color: item.current ? "var(--accent-green)" : "var(--accent)" }}>
                  {item.duration}
                </span>
                <p className="text-xs font-mono" style={{ color: "var(--muted)" }}>{item.period}</p>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base mb-1" style={{ color: "var(--foreground)" }}>{item.title}</h3>
                <p className="text-sm mb-3" style={{ color: "var(--accent)" }}>{item.subtitle}</p>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--muted)" }}>{item.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
