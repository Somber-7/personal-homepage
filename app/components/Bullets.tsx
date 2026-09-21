// 여러 줄 글을 한 줄에 하나씩 bullet로 보여 준다. "라벨: 내용" 형식이면 라벨을 굵게.
export default function Bullets({ text, className = "" }: { text: string; className?: string }) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return null;
  return (
    <ul className={`space-y-1.5 ${className}`}>
      {lines.map((line, i) => {
        const m = line.match(/^([^:]{1,20}):\s+(.+)$/);
        return (
          <li key={i} className="relative pl-4 leading-relaxed" style={{ color: "var(--muted)" }}>
            <span className="absolute left-0 top-[0.7em] w-1.5 h-px" style={{ background: "var(--muted)" }} />
            {m ? (
              <>
                <b className="font-semibold" style={{ color: "var(--foreground)" }}>{m[1]}</b> {m[2]}
              </>
            ) : (
              line
            )}
          </li>
        );
      })}
    </ul>
  );
}
